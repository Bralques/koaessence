import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import CuponsAdmin from "./CuponsAdmin";

export default async function CuponsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-[#1c1c1a] mb-8">Cupons</h1>
      <CuponsAdmin coupons={JSON.parse(JSON.stringify(coupons))} />
    </div>
  );
}
