import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

// PATCH /api/admin/inventory — update stock of a variant
export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { variantId, stock } = await req.json();

  const variant = await prisma.variant.update({
    where: { id: variantId },
    data: { stock: Number(stock) },
  });

  return NextResponse.json(variant);
}
