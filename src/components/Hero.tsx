"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 1.2s ease, transform 1.2s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#f5f0e8]">
      {/* Background texture pattern — organic SVG */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e8]/30 via-transparent to-[#faf8f5]" />

        {/* Decorative large circle — nature/organic feel */}
        <div
          className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #d4ebe2 0%, #a8d4c3 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #dfd0b8 0%, #c4b5a0 50%, transparent 70%)",
          }}
        />

        {/* Thin organic lines */}
        <svg
          className="absolute right-0 top-0 w-full h-full opacity-10"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M1440 0C1200 100 900 80 600 200S200 400 0 350"
            stroke="#8b7355"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M1440 150C1100 250 800 180 500 320S100 500 0 480"
            stroke="#2c5f4a"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M1440 300C1000 380 750 280 400 450S50 600 0 620"
            stroke="#8b7355"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>

        {/* Botanical SVG illustration */}
        <div className="absolute right-[2%] top-[5%] w-[44%] h-[90%] hidden md:flex items-center justify-center">
          <svg viewBox="0 0 420 580" className="w-full h-full" fill="none">

            {/* Background frame */}
            <circle cx="230" cy="270" r="220" stroke="#2c5f4a" strokeWidth="0.5" opacity="0.12"/>
            <circle cx="230" cy="270" r="185" stroke="#8b7355" strokeWidth="0.3" opacity="0.08"/>
            <ellipse cx="220" cy="260" rx="160" ry="200" fill="#2c5f4a" opacity="0.03"/>

            {/* ── CULMO PRINCIPAL ── */}
            <path d="M195 560 C194 480 196 400 196 320 C196 240 194 160 195 80 C195 60 196 45 196 35"
              stroke="#2c5f4a" strokeWidth="5.5" strokeLinecap="round"/>

            {/* ── CULMO SECUNDÁRIO (mais fino, levemente à direita) ── */}
            <path d="M240 560 C239 488 241 408 241 328 C241 248 239 172 240 95 C240 75 240 58 240 48"
              stroke="#2c5f4a" strokeWidth="3.5" strokeLinecap="round" opacity="0.55"/>

            {/* ── NÓS — culmo principal ── */}
            {[80, 160, 240, 320, 400, 480].map((y) => (
              <line key={y} x1="186" y1={y} x2="205" y2={y} stroke="#2c5f4a" strokeWidth="3" strokeLinecap="round"/>
            ))}

            {/* ── NÓS — culmo secundário ── */}
            {[95, 175, 255, 335, 415, 495].map((y) => (
              <line key={y} x1="233" y1={y} x2="248" y2={y} stroke="#2c5f4a" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
            ))}

            {/* ── GALHOS E FOLHAS ── */}

            {/* Galho 1 — nó 160, direita */}
            <path d="M196 160 C218 152 248 142 272 132" stroke="#2c5f4a" strokeWidth="1.2" strokeLinecap="round"/>
            {/* Folhas no galho 1 */}
            <path d="M272 132 C278 118 295 105 308 98 C295 108 278 122 272 132Z" fill="#2c5f4a" fillOpacity="0.75" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M272 132 C282 120 304 112 318 108 C304 116 280 126 272 132Z" fill="#2c5f4a" fillOpacity="0.65" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M272 132 C280 140 298 148 312 152 C298 146 278 140 272 132Z" fill="#2c5f4a" fillOpacity="0.55" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M272 132 C268 118 268 100 265 88 C266 102 267 120 272 132Z" fill="#2c5f4a" fillOpacity="0.6" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M272 132 C260 120 248 112 238 108 C250 116 262 124 272 132Z" fill="#2c5f4a" fillOpacity="0.5" stroke="#2c5f4a" strokeWidth="0.4"/>

            {/* Galho 2 — nó 240, esquerda */}
            <path d="M196 240 C174 232 148 222 118 215" stroke="#2c5f4a" strokeWidth="1.2" strokeLinecap="round"/>
            {/* Folhas no galho 2 */}
            <path d="M118 215 C108 200 92 188 78 182 C92 192 108 206 118 215Z" fill="#2c5f4a" fillOpacity="0.75" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M118 215 C104 208 85 205 70 206 C86 205 105 210 118 215Z" fill="#2c5f4a" fillOpacity="0.65" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M118 215 C110 226 96 236 82 240 C96 234 112 224 118 215Z" fill="#2c5f4a" fillOpacity="0.55" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M118 215 C120 200 125 185 124 172 C122 186 118 202 118 215Z" fill="#2c5f4a" fillOpacity="0.6" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M118 215 C124 204 135 196 144 192 C133 198 122 208 118 215Z" fill="#2c5f4a" fillOpacity="0.5" stroke="#2c5f4a" strokeWidth="0.4"/>

            {/* Galho 3 — nó 320, direita */}
            <path d="M196 320 C220 312 255 302 282 295" stroke="#2c5f4a" strokeWidth="1.2" strokeLinecap="round"/>
            {/* Folhas no galho 3 */}
            <path d="M282 295 C290 280 308 268 322 262 C308 272 290 286 282 295Z" fill="#2c5f4a" fillOpacity="0.75" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M282 295 C294 285 316 280 330 280 C316 282 292 290 282 295Z" fill="#2c5f4a" fillOpacity="0.65" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M282 295 C290 306 306 316 318 320 C306 312 288 304 282 295Z" fill="#2c5f4a" fillOpacity="0.55" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M282 295 C276 280 275 262 272 250 C274 264 276 282 282 295Z" fill="#2c5f4a" fillOpacity="0.6" stroke="#2c5f4a" strokeWidth="0.4"/>

            {/* Galho 4 — nó 400, esquerda */}
            <path d="M196 400 C172 392 144 382 115 376" stroke="#2c5f4a" strokeWidth="1.2" strokeLinecap="round"/>
            {/* Folhas no galho 4 */}
            <path d="M115 376 C104 360 88 348 74 342 C88 352 104 366 115 376Z" fill="#2c5f4a" fillOpacity="0.75" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M115 376 C100 370 82 368 68 370 C84 368 102 374 115 376Z" fill="#2c5f4a" fillOpacity="0.65" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M115 376 C108 388 96 398 82 402 C96 396 110 386 115 376Z" fill="#2c5f4a" fillOpacity="0.55" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M115 376 C118 360 122 345 120 332 C118 346 114 362 115 376Z" fill="#2c5f4a" fillOpacity="0.6" stroke="#2c5f4a" strokeWidth="0.4"/>

            {/* Galho 5 — nó 80, esquerda (topo) */}
            <path d="M196 80 C175 74 152 66 128 60" stroke="#2c5f4a" strokeWidth="1" strokeLinecap="round"/>
            <path d="M128 60 C118 46 105 36 92 30 C105 40 118 52 128 60Z" fill="#2c5f4a" fillOpacity="0.7" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M128 60 C114 56 98 55 84 57 C99 55 116 58 128 60Z" fill="#2c5f4a" fillOpacity="0.6" stroke="#2c5f4a" strokeWidth="0.4"/>
            <path d="M128 60 C120 70 108 78 96 82 C108 76 122 68 128 60Z" fill="#2c5f4a" fillOpacity="0.5" stroke="#2c5f4a" strokeWidth="0.4"/>

            {/* ── DETALHES DECORATIVOS ── */}
            <line x1="48" y1="200" x2="58" y2="200" stroke="#8b7355" strokeWidth="0.5" opacity="0.3"/>
            <line x1="53" y1="195" x2="53" y2="205" stroke="#8b7355" strokeWidth="0.5" opacity="0.3"/>
            <line x1="365" y1="360" x2="375" y2="360" stroke="#8b7355" strokeWidth="0.5" opacity="0.25"/>
            <line x1="370" y1="355" x2="370" y2="365" stroke="#8b7355" strokeWidth="0.5" opacity="0.25"/>
            <circle cx="360" cy="180" r="3.5" stroke="#8b7355" strokeWidth="0.5" opacity="0.2"/>
            <circle cx="52" cy="460" r="2.5" stroke="#2c5f4a" strokeWidth="0.5" opacity="0.2"/>

            {/* Linhas horizontais finas — base */}
            <line x1="60" y1="530" x2="185" y2="530" stroke="#8b7355" strokeWidth="0.4" opacity="0.2"/>
            <line x1="60" y1="537" x2="170" y2="537" stroke="#8b7355" strokeWidth="0.3" opacity="0.15"/>

            {/* Nome científico */}
            <text x="60" y="552" fontSize="7.5" fill="#8b7355" letterSpacing="2.5" opacity="0.55"
              fontFamily="Georgia, serif" fontStyle="italic">
              Bambusoideae · Poaceae
            </text>

          </svg>
        </div>
      </div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <div className="max-w-xl">
          <p className="text-xs tracking-[0.4em] uppercase text-[#8b7355] mb-6">
            Algodão Peruano · Elastano
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-light text-[#1c1c1a] leading-[0.95] mb-8">
            Vista a<br />
            <em className="not-italic text-[#2c5f4a]">natureza</em>
          </h1>
          <p className="text-[#4a3c2a]/70 text-lg font-light leading-relaxed mb-10 max-w-sm">
            Camisetas que se adaptam a você — do trabalho ao esporte, do esporte ao dia a dia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#colecao"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1c1c1a] text-[#faf8f5] text-sm tracking-widest uppercase hover:bg-[#2c5f4a] transition-colors duration-300"
            >
              Ver Coleção
            </a>
            <a
              href="#historia"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-[#1c1c1a]/30 text-[#1c1c1a] text-sm tracking-widest uppercase hover:border-[#1c1c1a] transition-colors duration-300"
            >
              Nossa História
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator — hidden on mobile to avoid overlapping CTAs */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[#8b7355]/60 animate-bounce">
        <span className="text-xs tracking-[0.3em] uppercase">Rolar</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="6.5" y="0.5" width="3" height="23" rx="1.5" stroke="currentColor" strokeWidth="1" />
          <rect x="7" y="4" width="2" height="5" rx="1" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>
    </section>
  );
}
