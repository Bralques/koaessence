"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; type: string; value: number; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const finalTotal = coupon ? Math.max(0, total - coupon.discount) : total;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setCoupon(null);

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal: total }),
    });

    const data = await res.json();
    setCouponLoading(false);

    if (!res.ok) { setCouponError(data.error); return; }
    setCoupon(data);
  };

  const [form, setForm] = useState({
    name: "", email: "", cpf: "", phone: "",
    zipcode: "", street: "", number: "", complement: "", district: "", city: "", state: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const fetchCep = async () => {
    const cep = form.zipcode.replace(/\D/g, "");
    if (cep.length !== 8) return;
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (!data.erro) {
      setForm((prev) => ({
        ...prev,
        street: data.logradouro,
        district: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, cpf: form.cpf, phone: form.phone },
          address: {
            street: form.street, number: form.number, complement: form.complement,
            district: form.district, city: form.city, state: form.state, zipcode: form.zipcode,
          },
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            color: item.color.name,
            size: item.size,
            quantity: item.quantity,
          })),
          couponCode: coupon?.code ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao processar pedido.");
        return;
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl font-light text-[#1c1c1a] mb-4">Seu carrinho está vazio</p>
          <a href="/" className="text-sm tracking-widest uppercase text-[#4a3c2a]/60 border-b border-[#4a3c2a]/30 pb-0.5 hover:text-[#1c1c1a] transition-colors">
            Voltar à loja
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <a href="/" className="inline-block mb-10">
          <img src="/logo.png" alt="KOA" className="h-9 w-auto" />
        </a>

        <div className="grid md:grid-cols-[1fr_340px] gap-10">
          {/* Left — form or payment */}
          <div>
            {!clientSecret ? (
              /* Step 1 — Customer info */
              <form onSubmit={handleContinue} className="space-y-6">
                <div className="bg-white p-8 shadow-sm space-y-5">
                  <h2 className="font-display text-2xl font-light text-[#1c1c1a]">Seus dados</h2>

                  {[
                    { label: "Nome completo", field: "name", type: "text", full: true },
                    { label: "Email", field: "email", type: "email", full: true },
                    { label: "CPF", field: "cpf", type: "text", placeholder: "000.000.000-00" },
                    { label: "Telefone / WhatsApp", field: "phone", type: "tel", placeholder: "(11) 99999-9999" },
                  ].map((inp) => (
                    <div key={inp.field} className={inp.full ? "" : "inline-block w-1/2 pr-2 last:pr-0"}>
                      <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">{inp.label}</label>
                      <input type={inp.type} required placeholder={inp.placeholder} value={form[inp.field as keyof typeof form]}
                        onChange={set(inp.field)}
                        className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors" />
                    </div>
                  ))}

                  <div className="pt-4 border-t border-[#f5f0e8]">
                    <h3 className="text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-4">Endereço de entrega</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-1">
                        <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">CEP</label>
                        <input type="text" required placeholder="00000-000" value={form.zipcode} onChange={set("zipcode")} onBlur={fetchCep}
                          className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Bairro</label>
                        <input type="text" required value={form.district} onChange={set("district")}
                          className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Rua</label>
                        <input type="text" required value={form.street} onChange={set("street")}
                          className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Número</label>
                        <input type="text" required value={form.number} onChange={set("number")}
                          className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Complemento</label>
                        <input type="text" value={form.complement} onChange={set("complement")}
                          className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Cidade</label>
                        <input type="text" required value={form.city} onChange={set("city")}
                          className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-1.5">Estado</label>
                        <input type="text" required maxLength={2} value={form.state} onChange={set("state")}
                          className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors uppercase" />
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full bg-[#1c1c1a] text-[#faf8f5] py-4 text-sm tracking-widest uppercase hover:bg-[#2c5f4a] transition-colors duration-300 disabled:opacity-50">
                    {loading ? "Processando..." : "Continuar para pagamento →"}
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2 — Stripe Payment */
              <div className="bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-light text-[#1c1c1a] mb-6">Pagamento</h2>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "flat",
                      variables: {
                        colorPrimary: "#2c5f4a",
                        colorBackground: "#ffffff",
                        colorText: "#1c1c1a",
                        colorDanger: "#dc2626",
                        fontFamily: "Inter, sans-serif",
                        borderRadius: "0px",
                        spacingUnit: "4px",
                      },
                    },
                  }}
                >
                  <CheckoutForm orderId={orderId!} total={finalTotal} />
                </Elements>
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div className="space-y-4">
            <div className="bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl font-light text-[#1c1c1a] mb-5">
                Resumo ({itemCount} {itemCount === 1 ? "item" : "itens"})
              </h2>
              <ul className="space-y-4 mb-6">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-3">
                    <div className="w-14 h-16 bg-[#ede4d4] shrink-0 overflow-hidden">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1c1c1a] truncate">{item.name}</p>
                      <p className="text-xs text-[#4a3c2a]/50">{item.color.name} · {item.size} · ×{item.quantity}</p>
                      <p className="text-sm text-[#1c1c1a] mt-1">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Coupon input */}
              <div className="border-t border-[#f5f0e8] pt-4">
                <p className="text-xs tracking-widest uppercase text-[#4a3c2a]/50 mb-2">Cupom de desconto</p>
                {coupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-emerald-700 tracking-widest">{coupon.code}</p>
                      <p className="text-xs text-emerald-600">
                        {coupon.type === "PERCENTAGE" ? `${coupon.value}% off` : `R$ ${coupon.value.toFixed(2).replace(".", ",")} off`}
                      </p>
                    </div>
                    <button onClick={() => { setCoupon(null); setCouponCode(""); }}
                      className="text-emerald-500 hover:text-emerald-700 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      placeholder="CÓDIGO"
                      className="flex-1 px-4 py-2.5 border border-[#ede4d4] text-sm uppercase tracking-widest focus:outline-none focus:border-[#2c5f4a] transition-colors"
                    />
                    <button onClick={applyCoupon} disabled={couponLoading}
                      className="px-4 py-2.5 bg-[#1c1c1a] text-white text-xs tracking-widest uppercase hover:bg-[#2c5f4a] transition-colors disabled:opacity-50">
                      {couponLoading ? "..." : "Aplicar"}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm text-[#4a3c2a]/60">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Desconto ({coupon.code})</span>
                    <span>− R$ {coupon.discount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-[#4a3c2a]/60">
                  <span>Frete</span><span className="text-[#2c5f4a]">Grátis</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[#f5f0e8]">
                  <span className="text-sm text-[#1c1c1a]">Total</span>
                  <span className="font-display text-2xl font-light text-[#1c1c1a]">
                    R$ {finalTotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#4a3c2a]/40 text-center leading-relaxed px-2">
              Pagamento processado com segurança pelo Stripe · SSL 256-bit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
