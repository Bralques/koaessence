"use client";

import { useState } from "react";

const STATUSES = [
  { value: "PENDING", label: "Pendente", color: "bg-gray-100 text-gray-600" },
  { value: "PROCESSING", label: "Processando", color: "bg-amber-100 text-amber-700" },
  { value: "PAID", label: "Pago", color: "bg-emerald-100 text-emerald-700" },
  { value: "SHIPPED", label: "Enviado", color: "bg-blue-100 text-blue-700" },
  { value: "DELIVERED", label: "Entregue", color: "bg-emerald-200 text-emerald-800" },
  { value: "CANCELLED", label: "Cancelado", color: "bg-red-100 text-red-600" },
  { value: "REFUNDED", label: "Reembolsado", color: "bg-purple-100 text-purple-700" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OrdersTable({ orders: initial }: { orders: any[] }) {
  const [orders, setOrders] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const statusInfo = (val: string) =>
    STATUSES.find((s) => s.value === val) ?? STATUSES[0];

  return (
    <div className="bg-white shadow-sm overflow-hidden">
      {orders.length === 0 && (
        <p className="p-8 text-sm text-[#4a3c2a]/40">Nenhum pedido ainda.</p>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#f5f0e8] text-xs tracking-widest uppercase text-[#4a3c2a]/40">
            <th className="text-left px-6 py-4">Pedido</th>
            <th className="text-left px-4 py-4">Cliente</th>
            <th className="text-left px-4 py-4">Pagamento</th>
            <th className="text-left px-4 py-4">Total</th>
            <th className="text-left px-4 py-4">Status</th>
            <th className="px-4 py-4" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <>
              <tr
                key={order.id}
                className="border-b border-[#f5f0e8] hover:bg-[#faf8f5] cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <td className="px-6 py-4 text-[#1c1c1a] font-mono text-xs">
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-4">
                  <p className="text-[#1c1c1a]">{order.customerName}</p>
                  <p className="text-xs text-[#4a3c2a]/40">{order.customerEmail}</p>
                </td>
                <td className="px-4 py-4 text-[#4a3c2a]/60 capitalize">
                  {order.paymentMethod}
                </td>
                <td className="px-4 py-4 text-[#1c1c1a]">
                  R$ {order.total.toFixed(2).replace(".", ",")}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateStatus(order.id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer focus:outline-none ${statusInfo(order.status).color}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-[#4a3c2a]/30 text-xs">
                  {expanded === order.id ? "▲" : "▼"}
                </td>
              </tr>

              {expanded === order.id && (
                <tr key={`${order.id}-detail`} className="bg-[#faf8f5]">
                  <td colSpan={6} className="px-6 py-5">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs tracking-widest uppercase text-[#4a3c2a]/40 mb-3">
                          Itens
                        </p>
                        <ul className="space-y-2">
                          {order.items.map((item: {
                            id: string;
                            product: { name: string };
                            color: string;
                            size: string;
                            quantity: number;
                            price: number;
                          }) => (
                            <li key={item.id} className="flex justify-between text-sm">
                              <span className="text-[#1c1c1a]">
                                {item.product.name} — {item.color} / {item.size} × {item.quantity}
                              </span>
                              <span className="text-[#4a3c2a]/60">
                                R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs tracking-widest uppercase text-[#4a3c2a]/40 mb-3">
                          Entrega
                        </p>
                        <p className="text-sm text-[#1c1c1a]">
                          {(order.address as { street: string; number: string; complement?: string; district: string; city: string; state: string; zipcode: string }).street},{" "}
                          {(order.address as { street: string; number: string }).number}
                          {(order.address as { complement?: string }).complement &&
                            `, ${(order.address as { complement: string }).complement}`}
                        </p>
                        <p className="text-sm text-[#4a3c2a]/60">
                          {(order.address as { district: string; city: string; state: string }).district} — {(order.address as { city: string }).city}/{(order.address as { state: string }).state}
                        </p>
                        <p className="text-sm text-[#4a3c2a]/60">{(order.address as { zipcode: string }).zipcode}</p>
                        <p className="text-xs mt-3 text-[#4a3c2a]/40">
                          {new Date(order.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
