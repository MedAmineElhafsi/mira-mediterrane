import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getDeliveryFeeCents } from "@/lib/delivery";
import { calculateItemTax } from "@/lib/tax";
import { CartItemType } from "@/types/cart";
import { RESTAURANT } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // We allow guest checkout, but if user is logged in, use their ID
    const userId = session?.user?.id;

    const body = await req.json();
    const { items, orderType, tipCents, specialInstructions, deliveryAddress } = body as {
      items: CartItemType[];
      orderType: "DELIVERY" | "PICKUP";
      tipCents: number;
      specialInstructions: string;
      deliveryAddress?: { street: string; city: string; postalCode: string; notes?: string };
    };

    if (!items || items.length === 0) {
      return new NextResponse("Warenkorb ist leer", { status: 400 });
    }

    let subtotalCents = 0;
    let totalTaxCents = 0;

    // 1. Verify prices against database to prevent tampering
    const orderItemsForDb = [];
    
    for (const item of items) {
      const dbItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
        include: { variants: true }
      });

      if (!dbItem) {
        return new NextResponse(`Gericht nicht gefunden: ${item.name}`, { status: 400 });
      }

      let priceCents = dbItem.priceCents;
      let variantId = null;

      if (item.variantId) {
        const variant = dbItem.variants.find(v => v.id === item.variantId);
        if (!variant) {
          return new NextResponse(`Variante nicht gefunden: ${item.variantName}`, { status: 400 });
        }
        priceCents = variant.priceCents;
        variantId = variant.id;
      }

      if (priceCents == null) {
        return new NextResponse(`Preis auf Anfrage für ${item.name}`, { status: 400 });
      }

      const itemTotal = priceCents * item.quantity;
      subtotalCents += itemTotal;
      
      totalTaxCents += calculateItemTax({
        priceCents,
        quantity: item.quantity,
        isBeverage: dbItem.isBeverage
      });

      orderItemsForDb.push({
        menuItemId: dbItem.id,
        variantId,
        quantity: item.quantity,
        priceCents, // the verified price
        specialInstructions: item.specialInstructions,
      });
    }

    // 2. Add Delivery Fee
    const deliveryFeeCents = orderType === "DELIVERY" ? getDeliveryFeeCents() : 0;
    const totalCents = subtotalCents + deliveryFeeCents + tipCents;

    // 3. Create Stripe Line Items
    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.variantName ? `${item.name} (${item.variantName})` : item.name,
            description: item.specialInstructions ? `Notiz: ${item.specialInstructions}` : undefined,
          },
          unit_amount: item.priceCents, // Stripe uses cents
        },
        quantity: item.quantity,
      };
    });

    if (deliveryFeeCents > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Liefergebühr" },
          unit_amount: deliveryFeeCents,
        },
        quantity: 1,
      });
    }

    if (tipCents > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Trinkgeld für das Team" },
          unit_amount: tipCents,
        },
        quantity: 1,
      });
    }

    // 4. Create address in DB if it's delivery
    let addressId = undefined;
    if (orderType === "DELIVERY" && deliveryAddress) {
      // In a real app we'd link this to the user, for guest we can just create a dummy "guest text address"
      // Wait, our schema says address requires userId! So for guests we need a generic guest user or anonymous string 
      // Actually, since schema Address requires userId: User, guests can't have an Address entity unless we create a guest User.
      // Let's create an anonymous user or use an existing one if session is missing.
    }

    // Since our schema enforces Order.userId, we must ensure every order has a user.
    // Let's find or create a guest user if no session
    let orderUserId = userId;
    if (!orderUserId) {
      const guestEmail = `guest_${Date.now()}@guest.mira-merseburg.de`;
      const guestUser = await prisma.user.create({
        data: {
          name: "Gast",
          email: guestEmail,
          role: "CUSTOMER",
        }
      });
      orderUserId = guestUser.id;
    }

    if (orderType === "DELIVERY" && deliveryAddress) {
      const address = await prisma.address.create({
        data: {
          userId: orderUserId,
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          postalCode: deliveryAddress.postalCode,
          notes: deliveryAddress.notes,
        }
      });
      addressId = address.id;
    }

    // 5. Create Order in DB (Status: PENDING_PAYMENT)
    const order = await prisma.order.create({
      data: {
        userId: orderUserId,
        type: orderType,
        status: "PENDING_PAYMENT",
        subtotalCents,
        taxCents: totalTaxCents,
        deliveryFeeCents,
        tipCents,
        totalCents,
        deliveryAddressId: addressId,
        specialInstructions,
        items: {
          create: orderItemsForDb
        }
      }
    });

    // 6. Create Stripe Checkout Session (or bypass if no Stripe account)
    if (
      !process.env.STRIPE_SECRET_KEY || 
      process.env.STRIPE_SECRET_KEY === "" || 
      process.env.STRIPE_SECRET_KEY === "sk_test_placeholder"
    ) {
      // Test mode bypass: mark paid and jump straight to success
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID", paidAt: new Date() },
        include: {
          user: true,
          items: { include: { menuItem: true } }
        }
      });
      await prisma.orderStatusEvent.create({
        data: { orderId: order.id, status: "PAID" }
      });
      
      // Attempt to send email
      const { sendOrderConfirmation } = await import('@/lib/email');
      try {
        await sendOrderConfirmation(updatedOrder, updatedOrder.user.email!);
      } catch (e) {
        console.error("Email block failed:", e);
      }
      
      const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return NextResponse.json({ url: `${origin}/success?session_id=test_bypass_${order.id}` });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], 
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
      },
    });

    // 7. Update Order with Stripe Session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: sessionStripe.id }
    });

    return NextResponse.json({ url: sessionStripe.url });

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
