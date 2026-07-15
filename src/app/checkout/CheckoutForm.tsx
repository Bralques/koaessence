"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ orderId, total }: { orderId: string; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { closeCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmacao?orderId=${orderId}`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Erro ao processar pagamento.");
      setLoading(false);
      return;
    }

    closeCart();
    router.push(`/checkout/confirmacao?orderId=${orderId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ["card", "pix"],
        }}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#1c1c1a] text-[#faf8f5] py-4 text-sm tracking-widest uppercase hover:bg-[#2c5f4a] transition-colors duration-300 disabled:opacity-50"
      >
        {loading ? "Processando..." : `Pagar R$ ${total.toFixed(2).replace(".", ",")}`}
      </button>

      <p className="text-xs text-[#4a3c2a]/40 text-center">
        Seus dados de pagamento são processados com segurança pelo Stripe. Nunca armazenamos dados do cartão.
      </p>
    </form>
  );
}
