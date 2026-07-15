"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useCart } from "@/context/CartContext";

function ConfirmacaoContent() {
  const params = useSearchParams();
  const { items: _, closeCart } = useCart();
  const orderId = params.get("orderId");
  const type = params.get("type");
  const pixCopyPaste = params.get("pix");
  const [copied, setCopied] = useState(false);

  const copyPix = () => {
    if (pixCopyPaste) {
      navigator.clipboard.writeText(pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  closeCart();

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <a href="/">
            <img src="/logo.png" alt="KOA" className="h-10 w-auto mx-auto mb-8" />
          </a>

          <div className="w-16 h-16 rounded-full bg-[#2c5f4a] flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="font-display text-4xl font-light text-[#1c1c1a] mb-2">
            Pedido realizado!
          </h1>
          <p className="text-[#4a3c2a]/60 mb-1">
            #{orderId?.slice(-8).toUpperCase()}
          </p>
        </div>

        {type === "pix" && pixCopyPaste && (
          <div className="bg-white p-6 shadow-sm mb-6 text-left">
            <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-4">
              Pague com PIX
            </p>
            <p className="text-sm text-[#4a3c2a]/60 mb-4">
              Copie o código abaixo e cole no app do seu banco:
            </p>
            <div className="bg-[#f5f0e8] p-3 rounded text-xs font-mono text-[#1c1c1a] break-all mb-3">
              {pixCopyPaste.slice(0, 60)}...
            </div>
            <button
              onClick={copyPix}
              className="w-full bg-[#2c5f4a] text-white py-3 text-sm tracking-widest uppercase hover:bg-[#1c1c1a] transition-colors"
            >
              {copied ? "✓ Copiado!" : "Copiar código PIX"}
            </button>
            <p className="text-xs text-[#4a3c2a]/40 mt-3 text-center">
              O pedido é confirmado automaticamente após o pagamento.
            </p>
          </div>
        )}

        {type === "credit" && (
          <div className="bg-white p-6 shadow-sm mb-6">
            <p className="text-sm text-[#4a3c2a]/70">
              Seu cartão está sendo processado. Você receberá um email de confirmação em breve.
            </p>
          </div>
        )}

        <p className="text-sm text-[#4a3c2a]/60 mb-6">
          Acompanhe seu pedido pelo email cadastrado.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-[#4a3c2a]/70 border-b border-[#4a3c2a]/30 hover:text-[#1c1c1a] hover:border-[#1c1c1a] transition-colors"
        >
          Continuar comprando
        </a>
      </div>
    </div>
  );
}

export default function ConfirmacaoPage() {
  return (
    <Suspense>
      <ConfirmacaoContent />
    </Suspense>
  );
}
