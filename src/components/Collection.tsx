"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";

type Product = {
  id: string;
  name: string;
  price: number;
  tag?: string;
  description: string;
  image?: string;
  placeholderColor?: string;
  colors: { name: string; hex: string; image?: string }[];
};

const products: Product[] = [
  {
    id: "essencial-branca",
    name: "Essencial Branca",
    price: 189.9,
    tag: "Mais Vendida",
    description: "Fit Regular · Algodão Peruano",
    image: "/branco.jpg",
    colors: [{ name: "Branco", hex: "#f5f0e8" }],
  },
  {
    id: "essencial-off-white",
    name: "Essencial Off-White",
    price: 189.9,
    description: "Fit Regular · Algodão Peruano",
    image: "/off-white.jpg",
    colors: [{ name: "Off-White", hex: "#e8e0d0" }],
  },
  {
    id: "essencial-cinza",
    name: "Essencial Cinza",
    price: 189.9,
    description: "Fit Regular · Algodão Peruano",
    image: "/cinza.jpeg",
    colors: [{ name: "Cinza", hex: "#9a9a98" }],
  },
  {
    id: "essencial-preta",
    name: "Essencial Preta",
    price: 189.9,
    description: "Fit Regular · Algodão Peruano",
    image: "/preto.jpeg",
    colors: [{ name: "Preto", hex: "#1c1c1a" }],
  },
  {
    id: "botanica-verde",
    name: "Botânica Verde",
    price: 209.9,
    tag: "Novo",
    description: "Fit Relaxed · Algodão Peruano",
    image: "/verde.jpg",
    colors: [{ name: "Verde", hex: "#2c5f4a" }],
  },
  {
    id: "horizonte-azul",
    name: "Horizonte Azul",
    price: 209.9,
    description: "Fit Regular · Algodão Peruano",
    image: "/azul.jpg",
    colors: [{ name: "Azul", hex: "#4a7fa5" }],
  },
];

export default function Collection() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <section id="colecao" className="py-28 md:py-36 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-[#8b7355] mb-4">
                Coleção 2025
              </p>
              <h2 className="font-display text-5xl md:text-6xl font-light text-[#1c1c1a]">
                Feito para<br />cada momento
              </h2>
            </div>
            <p className="text-[#4a3c2a]/60 max-w-xs leading-relaxed">
              Cada peça desenvolvida com precisão — do fio à costura — para durar e adaptar-se a qualquer ambiente.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-12">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => setQuickViewProduct(product)}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-[#4a3c2a]/70 hover:text-[#1c1c1a] transition-colors border-b border-[#4a3c2a]/30 pb-0.5 hover:border-[#1c1c1a]"
            >
              Ver toda a coleção
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
