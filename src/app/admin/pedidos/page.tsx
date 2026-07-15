import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrdersTable from "./OrdersTable";

export default async function PedidosPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-[#1c1c1a] mb-8">Pedidos</h1>
      <OrdersTable orders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
