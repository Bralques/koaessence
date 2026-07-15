"use client";

import { useState } from "react";

interface Variant {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  active: boolean;
  variants: Variant[];
}

export default function ProductsAdmin({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const startEdit = (productId: string, variants: Variant[]) => {
    setEditing(productId);
    const edits: Record<string, number> = {};
    variants.forEach((v) => (edits[v.id] = v.stock));
    setStockEdits(edits);
  };

  const saveStock = async (productId: string) => {
    setSaving(productId);
    for (const [variantId, stock] of Object.entries(stockEdits)) {
      await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stock }),
      });
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id !== productId
          ? p
          : {
              ...p,
              variants: p.variants.map((v) => ({
                ...v,
                stock: stockEdits[v.id] ?? v.stock,
              })),
            }
      )
    );
    setEditing(null);
    setSaving(null);
  };

  const totalStock = (variants: Variant[]) =>
    variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white shadow-sm overflow-hidden">
          {/* Product header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#f5f0e8]">
            <div className="flex items-center gap-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-14 object-cover bg-[#ede4d4]"
                />
              )}
              <div>
                <h3 className="font-display text-xl font-light text-[#1c1c1a]">
                  {product.name}
                </h3>
                <p className="text-sm text-[#4a3c2a]/50">
                  R$ {product.price.toFixed(2).replace(".", ",")} ·{" "}
                  {totalStock(product.variants)} unidades totais
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {editing === product.id ? (
                <>
                  <button
                    onClick={() => setEditing(null)}
                    className="text-xs tracking-widest uppercase text-[#4a3c2a]/50 hover:text-[#1c1c1a] transition-colors px-4 py-2"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => saveStock(product.id)}
                    disabled={saving === product.id}
                    className="text-xs tracking-widest uppercase bg-[#2c5f4a] text-white px-4 py-2 hover:bg-[#1c1c1a] transition-colors disabled:opacity-50"
                  >
                    {saving === product.id ? "Salvando..." : "Salvar"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit(product.id, product.variants)}
                  className="text-xs tracking-widest uppercase text-[#4a3c2a]/70 hover:text-[#1c1c1a] border border-[#ede4d4] px-4 py-2 hover:border-[#1c1c1a] transition-colors"
                >
                  Editar estoque
                </button>
              )}
            </div>
          </div>

          {/* Variants grid */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {product.variants.map((variant) => {
                const stock =
                  editing === product.id
                    ? (stockEdits[variant.id] ?? variant.stock)
                    : variant.stock;
                const isLow = stock <= 3;

                return (
                  <div
                    key={variant.id}
                    className={`p-3 border rounded ${
                      isLow ? "border-red-200 bg-red-50" : "border-[#ede4d4]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                      <span className="text-xs text-[#1c1c1a]">
                        {variant.color} / {variant.size}
                      </span>
                    </div>

                    {editing === product.id ? (
                      <input
                        type="number"
                        min={0}
                        value={stockEdits[variant.id] ?? variant.stock}
                        onChange={(e) =>
                          setStockEdits((prev) => ({
                            ...prev,
                            [variant.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full text-sm px-2 py-1 border border-[#ede4d4] focus:outline-none focus:border-[#2c5f4a]"
                      />
                    ) : (
                      <p
                        className={`text-xl font-display font-light ${
                          isLow ? "text-red-500" : "text-[#1c1c1a]"
                        }`}
                      >
                        {stock}
                        <span className="text-xs text-[#4a3c2a]/40 ml-1">un.</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
