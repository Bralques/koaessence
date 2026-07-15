import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer, items, address, couponCode } = body;

  if (!customer?.name || !customer?.email || !customer?.cpf || !customer?.phone) {
    return NextResponse.json({ error: "Dados do cliente incompletos" }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  // Fetch real prices from DB
  const productIds: string[] = items.map((i: { productId: string }) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });
  const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]));

  // Validate products and stock
  for (const item of items) {
    if (!priceMap[item.productId]) {
      return NextResponse.json({ error: `Produto não encontrado: ${item.productId}` }, { status: 400 });
    }
    const variant = await prisma.variant.findFirst({
      where: { productId: item.productId, color: item.color, size: item.size, stock: { gte: item.quantity } },
    });
    if (!variant) {
      return NextResponse.json(
        { error: `Sem estoque: ${item.name} — ${item.color} / ${item.size}` },
        { status: 409 }
      );
    }
  }

  const subtotal = items.reduce(
    (sum: number, item: { productId: string; quantity: number }) =>
      sum + (priceMap[item.productId] ?? 0) * item.quantity,
    0
  );

  // Validate and apply coupon
  let discount = 0;
  let validCouponCode: string | null = null;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: String(couponCode).toUpperCase().trim() },
    });
    if (coupon && coupon.active && !(coupon.expiresAt && new Date() > coupon.expiresAt) &&
      !(coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)) {
      discount = coupon.type === "PERCENTAGE"
        ? (subtotal * coupon.value) / 100
        : Math.min(coupon.value, subtotal);
      discount = parseFloat(discount.toFixed(2));
      validCouponCode = coupon.code;
    }
  }

  const total = parseFloat((subtotal - discount).toFixed(2));

  // Create order in DB
  const order = await prisma.order.create({
    data: {
      customerName: customer.name,
      customerEmail: customer.email,
      customerCpf: customer.cpf,
      customerPhone: customer.phone,
      subtotal,
      discount,
      total,
      shipping: 0,
      couponCode: validCouponCode,
      paymentMethod: "stripe",
      address,
      items: {
        create: items.map((item: { productId: string; color: string; size: string; quantity: number }) => ({
          productId: item.productId,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: priceMap[item.productId],
        })),
      },
    },
  });

  // Increment coupon usage
  if (validCouponCode) {
    await prisma.coupon.update({
      where: { code: validCouponCode },
      data: { usedCount: { increment: 1 } },
    });
  }

  // Reserve stock
  for (const item of items) {
    await prisma.variant.updateMany({
      where: { productId: item.productId, color: item.color, size: item.size, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100), // centavos
    currency: "brl",
    metadata: { orderId: order.id },
    automatic_payment_methods: { enabled: true },
    receipt_email: customer.email,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentId: paymentIntent.id, paymentStatus: "pending" },
  });

  // Send confirmation email (non-blocking)
  sendOrderConfirmation({
    orderId: order.id,
    customerName: customer.name,
    customerEmail: customer.email,
    total,
    paymentMethod: "stripe",
    items: items.map((item: { name: string; color: string; size: string; quantity: number; productId: string }) => ({
      name: item.name,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: priceMap[item.productId],
    })),
    address,
  }).catch((err) => console.error("Email error:", err));

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  });
}
