"use client";

import { useState } from "react";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const empty = { code: "", type: "PERCENTAGE" as const, value: "", maxUses: "", expiresAt: "" };

export default function CuponsAdmin({ coupons: initial }: { coupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initial);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Erro ao criar cupom."); return; }

    setCoupons((p) => [data, ...p]);
    setForm(empty);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    setCoupons((p) => p.map((c) => c.id === id ? { ...c, active: !active } : c));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este cupom?")) return;
    await fetch("/api/admin/coupons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCoupons((p) => p.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-white p-8 shadow-sm">
        <h2 className="font-display text-xl font-light text-[#1c1c1a] mb-6">Novo cupom</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-1">
            <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Código</label>
            <input
              required value={form.code} onChange={set("code")}
              placeholder="PROMO10"
              className="w-full px-4 py-2.5 border border-[#ede4d4] text-sm uppercase focus:outline-none focus:border-[#2c5f4a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Tipo</label>
            <select value={form.type} onChange={set("type")}
              className="w-full px-4 py-2.5 border border-[#ede4d4] text-sm bg-white focus:outline-none focus:border-[#2c5f4a] transition-colors">
              <option value="PERCENTAGE">Percentual (%)</option>
              <option value="FIXED">Valor fixo (R$)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">
              {form.type === "PERCENTAGE" ? "Desconto (%)" : "Desconto (R$)"}
            </label>
            <input
              required type="number" min="1" max={form.type === "PERCENTAGE" ? "100" : undefined}
              value={form.value} onChange={set("value")} placeholder={form.type === "PERCENTAGE" ? "10" : "30"}
              className="w-full px-4 py-2.5 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Limite de usos</label>
            <input
              type="number" min="1" value={form.maxUses} onChange={set("maxUses")} placeholder="Ilimitado"
              className="w-full px-4 py-2.5 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Expira em (opcional)</label>
            <input
              type="datetime-local" value={form.expiresAt} onChange={set("expiresAt")}
              className="w-full px-4 py-2.5 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button type="submit" disabled={loading}
          className="bg-[#2c5f4a] text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-[#1c1c1a] transition-colors disabled:opacity-50">
          {loading ? "Criando..." : "Criar cupom"}
        </button>
      </form>

      {/* Coupons list */}
      <div className="bg-white shadow-sm overflow-hidden">
        {coupons.length === 0 && (
          <p className="p-8 text-sm text-[#4a3c2a]/40">Nenhum cupom criado ainda.</p>
        )}
        {coupons.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f5f0e8] text-xs tracking-widest uppercase text-[#4a3c2a]/40">
                <th className="text-left px-6 py-4">Código</th>
                <th className="text-left px-4 py-4">Desconto</th>
                <th className="text-left px-4 py-4">Usos</th>
                <th className="text-left px-4 py-4">Expira</th>
                <th className="text-left px-4 py-4">Status</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-[#f5f0e8] last:border-0 hover:bg-[#faf8f5]">
                  <td className="px-6 py-4 font-mono font-medium text-[#1c1c1a] tracking-widest">
                    {c.code}
                  </td>
                  <td className="px-4 py-4 text-[#1c1c1a]">
                    {c.type === "PERCENTAGE" ? `${c.value}%` : `R$ ${c.value.toFixed(2).replace(".", ",")}`}
                  </td>
                  <td className="px-4 py-4 text-[#4a3c2a]/60">
                    {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : " / ∞"}
                  </td>
                  <td className="px-4 py-4 text-[#4a3c2a]/60 text-xs">
                    {c.expiresAt
                      ? new Date(c.expiresAt).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => toggleActive(c.id, c.active)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                        c.active
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}>
                      {c.active ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => handleDelete(c.id)}
                      className="text-[#4a3c2a]/30 hover:text-red-500 transition-colors text-xs">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
