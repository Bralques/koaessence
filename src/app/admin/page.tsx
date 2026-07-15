import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [orders, products] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.product.findMany({ include: { variants: true } }),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status === "PAID" || o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = await prisma.order.count();
  const paidOrders = await prisma.order.count({ where: { status: "PAID" } });

  const lowStock = products
    .flatMap((p) => p.variants.map((v) => ({ ...v, productName: p.name })))
    .filter((v) => v.stock <= 3);

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-[#1c1c1a] mb-8">Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          {
            label: "Receita total",
            value: `R$ ${totalRevenue.toFixed(2).replace(".", ",")}`,
            sub: "pedidos pagos",
          },
          { label: "Pedidos", value: totalOrders, sub: "no total" },
          { label: "Pagos", value: paidOrders, sub: "confirmados" },
        ].map((m) => (
          <div key={m.label} className="bg-white p-6 shadow-sm">
            <p className="text-xs tracking-[0.2em] uppercase text-[#4a3c2a]/40 mb-2">{m.label}</p>
            <p className="font-display text-4xl font-light text-[#1c1c1a]">{m.value}</p>
            <p className="text-xs text-[#4a3c2a]/40 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent orders */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-light text-[#1c1c1a] mb-5">Pedidos recentes</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-[#4a3c2a]/40">Nenhum pedido ainda.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-2 border-b border-[#f5f0e8] last:border-0">
                  <div>
                    <p className="text-sm text-[#1c1c1a]">{order.customerName}</p>
                    <p className="text-xs text-[#4a3c2a]/40">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#1c1c1a]">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </p>
                    <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      order.status === "PAID" || order.status === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-light text-[#1c1c1a] mb-5">
            Estoque baixo
            {lowStock.length > 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {lowStock.length}
              </span>
            )}
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-[#4a3c2a]/40">Estoque OK em todos os itens.</p>
          ) : (
            <ul className="space-y-2">
              {lowStock.map((v) => (
                <li key={v.id} className="flex justify-between items-center py-2 border-b border-[#f5f0e8] last:border-0">
                  <div>
                    <p className="text-sm text-[#1c1c1a]">{v.productName}</p>
                    <p className="text-xs text-[#4a3c2a]/40">
                      {v.color} · {v.size}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${v.stock === 0 ? "text-red-500" : "text-amber-600"}`}>
                    {v.stock} un.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
