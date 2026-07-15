import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, price, image, variants } = body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      image,
      variants: {
        create: variants.map((v: { color: string; colorHex: string; size: string; stock: number }) => ({
          color: v.color,
          colorHex: v.colorHex,
          size: v.size,
          stock: Number(v.stock),
        })),
      },
    },
    include: { variants: true },
  });

  return NextResponse.json(product, { status: 201 });
}
