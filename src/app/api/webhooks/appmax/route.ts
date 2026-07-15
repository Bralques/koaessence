import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHmac, timingSafeEqual } from "crypto";

function verifySignature(payload: string, signature: string | null): boolean {
  const secret = process.env.APPMAX_WEBHOOK_SECRET;
  if (!secret) return false;
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify AppMax webhook signature
  const signature = req.headers.get("x-appmax-signature") ?? req.headers.get("x-hub-signature-256");
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const externalId =
    (body?.data as Record<string, unknown>)?.external_id ?? body?.external_id;
  const appmaxStatus =
    (body?.data as Record<string, unknown>)?.status ?? body?.status;

  if (typeof externalId !== "string" || !externalId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const statusMap: Record<string, string> = {
    approved: "PAID",
    paid: "PAID",
    refused: "CANCELLED",
    refunded: "REFUNDED",
    pending: "PROCESSING",
    waiting_payment: "PROCESSING",
  };

  const newStatus =
    statusMap[String(appmaxStatus).toLowerCase()] ?? "PROCESSING";

  await prisma.order.update({
    where: { id: externalId },
    data: {
      status: newStatus as "PAID" | "CANCELLED" | "REFUNDED" | "PROCESSING",
      paymentStatus: String(appmaxStatus),
    },
  });

  return NextResponse.json({ ok: true });
}
