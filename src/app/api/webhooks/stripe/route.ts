import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmed } from "@/lib/email";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const pi = event.data.object as { metadata?: { orderId?: string } };
  const orderId = pi.metadata?.orderId;
  if (!orderId) return NextResponse.json({ ok: true });

  switch (event.type) {
    case "payment_intent.succeeded": {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", paymentStatus: "succeeded" },
        include: { items: { include: { product: true } } },
      });

      // Send payment confirmed email (non-blocking)
      sendPaymentConfirmed({
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        items: order.items.map((item) => ({
          name: item.product.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
      }).catch((err) => console.error("Email error:", err));

      break;
    }

    case "payment_intent.payment_failed": {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED", paymentStatus: "failed" },
      });

      const failedItems = await prisma.orderItem.findMany({ where: { orderId } });
      for (const item of failedItems) {
        await prisma.variant.updateMany({
          where: { productId: item.productId, color: item.color, size: item.size },
          data: { stock: { increment: item.quantity } },
        });
      }
      break;
    }
  }

  return NextResponse.json({ ok: true });
}
