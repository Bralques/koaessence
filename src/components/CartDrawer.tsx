"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#faf8f5] z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#ede4d4]">
          <div>
            <h2 className="font-display text-2xl font-light text-[#1c1c1a]">
              Carrinho
            </h2>
            <p className="text-xs text-[#4a3c2a]/50 mt-0.5">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="text-[#4a3c2a]/40 hover:text-[#1c1c1a] transition-colors p-1"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-[#4a3c2a]/20"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="font-display text-xl font-light text-[#1c1c1a]">
                Seu carrinho está vazio
              </p>
              <p className="text-sm text-[#4a3c2a]/50">
                Adicione peças da nossa coleção
              </p>
              <button
                onClick={closeCart}
                className="mt-4 text-xs tracking-widest uppercase border-b border-[#4a3c2a]/30 pb-0.5 text-[#4a3c2a]/70 hover:text-[#1c1c1a] hover:border-[#1c1c1a] transition-colors"
              >
                Ver Coleção
              </button>
            </div>
          ) : (
            <ul className="space-y-7">
              {items.map((item) => (
                <li key={item.key} className="flex gap-5">
                  <div className="w-20 h-24 bg-[#ede4d4] shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-display text-lg font-light text-[#1c1c1a] leading-tight">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="w-3 h-3 rounded-full inline-block shrink-0 border border-black/10"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          <span className="text-xs text-[#4a3c2a]/50">
                            {item.color.name} · {item.size}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        aria-label="Remover item"
                        className="text-[#4a3c2a]/30 hover:text-[#1c1c1a] transition-colors shrink-0"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[#ede4d4]">
                        <button
                          onClick={() => updateQuantity(item.key, -1)}
                          className="w-8 h-8 flex items-center justify-center text-[#4a3c2a]/50 hover:text-[#1c1c1a] transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm text-[#1c1c1a] border-x border-[#ede4d4]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#4a3c2a]/50 hover:text-[#1c1c1a] transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-[#1c1c1a] font-light">
                        R${" "}
                        {(item.price * item.quantity)
                          .toFixed(2)
                          .replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-[#ede4d4] space-y-4">
            <div className="flex justify-between items-baseline">
              <p className="text-sm text-[#4a3c2a]/60">Subtotal</p>
              <p className="font-display text-2xl font-light text-[#1c1c1a]">
                R$ {total.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <p className="text-xs text-[#4a3c2a]/40">
              Frete calculado no checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-[#1c1c1a] text-[#faf8f5] py-4 text-sm tracking-widest uppercase hover:bg-[#2c5f4a] transition-colors duration-300 text-center"
            >
              Finalizar Compra
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
