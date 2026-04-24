import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("Webhook Error: No orderId in metadata");
      return new NextResponse("Webhook Error: No orderId", { status: 400 });
    }

    try {
      // Update the order status to PAID
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paidAt: new Date(session.created * 1000), // Stripe timestamp
        },
        include: {
          user: true,
          items: { include: { menuItem: true } }
        }
      });

      // Track history
      await prisma.orderStatusEvent.create({
        data: {
          orderId,
          status: "PAID",
        },
      });

      // Send email confirmation
      try {
        const { sendOrderConfirmation } = await import('@/lib/email');
        await sendOrderConfirmation(updatedOrder, updatedOrder.user.email!);
      } catch (err) {
        console.error("Email block failed during webhook:", err);
      }

      console.log(`Order ${orderId} successfully completed and updated.`);

      // In a real app we'd trigger SSE update here to Admin dashboard
      // Next steps for production: trigger Pusher / Resend email

    } catch (error) {
      console.error("Database update failed for order", orderId, error);
      return new NextResponse("Database Error", { status: 500 });
    }
  }

  return new NextResponse("OK", { status: 200 });
}
