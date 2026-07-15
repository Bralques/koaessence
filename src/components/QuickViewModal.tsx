"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  tag?: string;
  description: string;
  image?: string;
  placeholderColor?: string;
  colors: { name: string; hex: string; image?: string }[];
}

const SIZES = ["P", "M", "G", "GG"];

const SIZE_GUIDE = [
  { size: "P",  busto: "88–92", ombro: "43", comprimento: "68" },
  { size: "M",  busto: "92–96", ombro: "45", comprimento: "70" },
  { size: "G",  busto: "96–100", ombro: "47", comprimento: "72" },
  { size: "GG", busto: "100–106", ombro: "49", comprimento: "74" },
];

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);

  const currentImage =
    product.colors[selectedColor].image ?? product.image ?? null;

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) { setError(true); return; }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: currentImage ?? "",
      color: product.colors[selectedColor],
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 pointer-events-none">
        <div
          className="bg-[#faf8f5] w-full max-w-3xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl flex flex-col md:flex-row rounded-t-2xl md:rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle — mobile only */}
          <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-[#ede4d4]" />
          </div>

          {/* Image — shorter on mobile */}
          <div className="md:w-[45%] shrink-0 bg-[#ede4d4] relative h-52 md:h-auto md:aspect-auto">
            {product.tag && (
              <span className="absolute top-4 left-4 z-10 text-xs tracking-[0.2em] uppercase bg-[#2c5f4a] text-[#faf8f5] px-3 py-1">
                {product.tag}
              </span>
            )}
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ backgroundColor: product.placeholderColor ?? product.colors[selectedColor].hex + "33" }}
              />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 p-6 md:p-8 flex flex-col gap-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-1">
                  {product.description}
                </p>
                <h2 className="font-display text-3xl font-light text-[#1c1c1a]">
                  {product.name}
                </h2>
                <p className="font-display text-2xl font-light text-[#1c1c1a] mt-2">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#4a3c2a]/40 hover:text-[#1c1c1a] transition-colors shrink-0 mt-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Color */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#4a3c2a]/50 mb-3">
                Cor — <span className="text-[#1c1c1a]">{product.colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-7 h-7 rounded-full border border-black/10 transition-all ${
                      selectedColor === i
                        ? "ring-2 ring-offset-2 ring-[#1c1c1a] scale-110"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs tracking-[0.25em] uppercase transition-colors ${
                  error && !selectedSize ? "text-red-400" : "text-[#4a3c2a]/50"
                }`}>
                  {error && !selectedSize ? "Selecione um tamanho" : "Tamanho"}
                </p>
                <button
                  onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                  className="text-xs text-[#4a3c2a]/50 hover:text-[#1c1c1a] underline underline-offset-2 transition-colors"
                >
                  Guia de tamanhos
                </button>
              </div>

              <div className="flex gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setError(false); }}
                    className={`w-12 h-12 text-sm border transition-all ${
                      selectedSize === size
                        ? "border-[#1c1c1a] bg-[#1c1c1a] text-[#faf8f5]"
                        : "border-[#ede4d4] text-[#4a3c2a] hover:border-[#1c1c1a]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Size guide */}
              {sizeGuideOpen && (
                <div className="mt-4 border border-[#ede4d4] overflow-hidden">
                  <table className="w-full text-xs text-[#4a3c2a]">
                    <thead>
                      <tr className="bg-[#f5f0e8]">
                        <th className="px-3 py-2 text-left font-normal tracking-widest uppercase text-[#8b7355]">Tam.</th>
                        <th className="px-3 py-2 text-left font-normal tracking-widest uppercase text-[#8b7355]">Busto</th>
                        <th className="px-3 py-2 text-left font-normal tracking-widest uppercase text-[#8b7355]">Ombro</th>
                        <th className="px-3 py-2 text-left font-normal tracking-widest uppercase text-[#8b7355]">Comp.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_GUIDE.map((row) => (
                        <tr
                          key={row.size}
                          className={`border-t border-[#ede4d4] transition-colors ${
                            selectedSize === row.size ? "bg-[#f5f0e8]" : ""
                          }`}
                        >
                          <td className="px-3 py-2 font-medium text-[#1c1c1a]">{row.size}</td>
                          <td className="px-3 py-2">{row.busto} cm</td>
                          <td className="px-3 py-2">{row.ombro} cm</td>
                          <td className="px-3 py-2">{row.comprimento} cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Composition */}
            <div className="border-t border-[#ede4d4] pt-5 space-y-3">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#4a3c2a]/50 mb-1.5">Composição</p>
                <p className="text-sm text-[#4a3c2a]/70">95% Algodão Peruano Pima · 5% Elastano</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#4a3c2a]/50 mb-1.5">Cuidados</p>
                <p className="text-sm text-[#4a3c2a]/70">Lavar a frio · Não usar alvejante · Secar à sombra</p>
              </div>
            </div>

            {/* CTA — sticky no mobile */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-sm tracking-widest uppercase transition-colors duration-300 sticky bottom-0 ${
                added
                  ? "bg-[#2c5f4a] text-[#faf8f5]"
                  : "bg-[#1c1c1a] text-[#faf8f5] hover:bg-[#2c5f4a]"
              }`}
            >
              {added ? "✓ Adicionado ao carrinho" : "Adicionar ao carrinho"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
