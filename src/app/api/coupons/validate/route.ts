import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Cupom inválido ou inativo" }, { status: 404 });
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json({ error: "Cupom expirado" }, { status: 400 });
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "Cupom esgotado" }, { status: 400 });
  }

  const discount =
    coupon.type === "PERCENTAGE"
      ? (subtotal * coupon.value) / 100
      : Math.min(coupon.value, subtotal);

  return NextResponse.json({
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount: parseFloat(discount.toFixed(2)),
  });
}
