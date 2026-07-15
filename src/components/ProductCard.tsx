"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  tag?: string;
  colors: { name: string; hex: string; image?: string }[];
  description: string;
  image?: string;
  placeholderColor?: string;
}

const SIZES = ["P", "M", "G", "GG"];

export default function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: () => void;
}) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const currentImage =
    product.colors[selectedColor].image ?? product.image ?? null;

  const handleAddToCart = (size: string) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: currentImage ?? "",
      color: product.colors[selectedColor],
      size,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative bg-[#ede4d4] overflow-hidden aspect-[3/4] mb-5">
        {product.tag && (
          <span className="absolute top-4 left-4 z-10 text-xs tracking-[0.2em] uppercase bg-[#2c5f4a] text-[#faf8f5] px-3 py-1">
            {product.tag}
          </span>
        )}

        {/* Clickable image area → Quick View */}
        <button
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={onQuickView}
          aria-label={`Ver detalhes de ${product.name}`}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full transition-colors duration-500"
              style={{
                backgroundColor:
                  product.placeholderColor ??
                  product.colors[selectedColor].hex + "33",
              }}
            />
          )}
        </button>

        {/* Quick view icon — aparece no hover */}
        <button
          onClick={onQuickView}
          className={`absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm p-2 shadow-sm transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
          aria-label="Quick view"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1c1c1a" strokeWidth="1.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>

        {/* Hover overlay — size picker */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[#1c1c1a] transition-all duration-300 ${
            hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          {added ? (
            <div className="py-3.5 flex items-center justify-center gap-2 text-[#a8d4c3] text-xs tracking-[0.25em] uppercase">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Adicionado
            </div>
          ) : (
            <div className="py-2.5 flex items-center justify-center gap-1">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleAddToCart(size)}
                  className="text-[#faf8f5]/60 text-xs hover:text-[#faf8f5] hover:bg-white/10 transition-all w-10 h-9 tracking-widest rounded-sm"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-light text-[#1c1c1a]">
              {product.name}
            </h3>
            <p className="text-sm text-[#4a3c2a]/60 mt-0.5">{product.description}</p>
          </div>
          <span className="text-[#1c1c1a] font-light text-base shrink-0 ml-4">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-2">
          {product.colors.map((color, i) => (
            <button
              key={color.name}
              title={color.name}
              onClick={() => setSelectedColor(i)}
              className={`w-5 h-5 rounded-full transition-all duration-200 border border-black/10 ${
                selectedColor === i
                  ? "ring-1 ring-offset-2 ring-[#1c1c1a]"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
