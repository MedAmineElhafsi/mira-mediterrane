import nodemailer from 'nodemailer';
import { formatPrice } from './format';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER || 'test account',
    pass: process.env.SMTP_PASS || 'test password',
  },
});

export async function sendOrderConfirmation(order: any, userEmail: string) {
  if (!process.env.SMTP_HOST) {
    console.warn("No SMTP_HOST found in .env, skipping real email send.");
    return;
  }

  const isDelivery = order.type === 'DELIVERY';
  const typeText = isDelivery ? 'Lieferung' : 'Abholung';
  const itemsHtml = order.items.map((i: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${i.quantity}x ${i.menuItem.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(i.priceCents)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="color: #C0622F;">Rechnung für Ihre Bestellung (#${order.id.slice(-6).toUpperCase()})</h1>
      <p>Vielen Dank für Ihre Bestellung bei Mira Mediterrane Küche!</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Details (${typeText})</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 8px; font-weight: bold; padding-top: 20px;">Gesamtsumme</td>
            <td style="padding: 8px; font-weight: bold; text-align: right; padding-top: 20px;">${formatPrice(order.totalCents)}</td>
          </tr>
        </table>
      </div>

      <p>Wir bereiten Ihr Essen nun frisch zu.</p>
      <p>Mit freundlichen Grüßen,<br/>Ihr Mira Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: '"Mira Restaurant" <noreply@mira-merseburg.de>',
    to: userEmail,
    subject: `Bestellbestätigung #${order.id.slice(-6).toUpperCase()} - Mira Mediterrane Küche`,
    html,
  });
}
