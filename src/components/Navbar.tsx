"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#ede4d4]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-75 transition-opacity duration-300">
          <img src="/logo.png" alt="KOA" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10">
          {[
            { label: "Coleção", href: "#colecao" },
            { label: "Materiais", href: "#materiais" },
            { label: "Nossa História", href: "#historia" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-sm tracking-widest uppercase text-[#4a3c2a]/70 hover:text-[#1c1c1a] transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button
            aria-label="Buscar"
            className="text-[#4a3c2a]/70 hover:text-[#1c1c1a] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button
            aria-label="Carrinho"
            onClick={openCart}
            className="text-[#4a3c2a]/70 hover:text-[#1c1c1a] transition-colors relative"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#2c5f4a] text-[#faf8f5] text-[10px] flex items-center justify-center font-medium leading-none">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-px bg-[#1c1c1a] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-px bg-[#1c1c1a] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-[#1c1c1a] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-[#faf8f5] border-t border-[#ede4d4] overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="px-6 py-6 flex flex-col gap-6">
          {[
            { label: "Coleção", href: "#colecao" },
            { label: "Materiais", href: "#materiais" },
            { label: "Nossa História", href: "#historia" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest uppercase text-[#4a3c2a] hover:text-[#1c1c1a] transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>

    {/* Mobile floating cart button */}
    <button
      onClick={openCart}
      aria-label="Carrinho"
      className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#1c1c1a] text-[#faf8f5] flex items-center justify-center shadow-lg hover:bg-[#2c5f4a] transition-colors duration-300"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#2c5f4a] text-[#faf8f5] text-[10px] flex items-center justify-center font-medium border-2 border-[#faf8f5]">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
    </>
  );
}
