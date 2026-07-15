export default function Story() {
  return (
    <section id="historia" className="py-28 md:py-36 bg-[#1c1c1a] text-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left — visual */}
          <div className="relative">
            <div className="aspect-[4/5] bg-[#2c2c2a] flex items-center justify-center overflow-hidden">
              {/* Organic nature pattern */}
              <svg viewBox="0 0 400 500" className="w-full h-full" fill="none">
                {/* Background gradient */}
                <rect width="400" height="500" fill="#2c2c2a" />

                {/* Leaf / organic shapes */}
                <path
                  d="M200 450 C200 450 80 350 80 200 C80 100 150 50 200 50 C250 50 320 100 320 200 C320 350 200 450 200 450Z"
                  fill="none"
                  stroke="#2c5f4a"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <path
                  d="M200 420 C200 420 100 330 100 210 C100 120 160 70 200 70 C240 70 300 120 300 210 C300 330 200 420 200 420Z"
                  fill="none"
                  stroke="#6fb89f"
                  strokeWidth="0.5"
                  opacity="0.4"
                />

                {/* Central texture lines */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line
                    key={i}
                    x1="200"
                    y1="50"
                    x2={50 + i * 27}
                    y2="450"
                    stroke="#8b7355"
                    strokeWidth="0.3"
                    opacity="0.2"
                  />
                ))}

                {/* KOA brand mark */}
                <text
                  x="200"
                  y="260"
                  textAnchor="middle"
                  fontSize="48"
                  fill="#f5f0e8"
                  fontFamily="Georgia, serif"
                  letterSpacing="12"
                  opacity="0.15"
                  fontWeight="300"
                >
                  KOA
                </text>

                {/* Small tagline */}
                <text
                  x="200"
                  y="285"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#8b7355"
                  fontFamily="sans-serif"
                  letterSpacing="4"
                  opacity="0.8"
                >
                  ALGODÃO PERUANO
                </text>

                {/* Corner detail */}
                <path d="M20 20 L50 20 M20 20 L20 50" stroke="#8b7355" strokeWidth="0.5" opacity="0.5" />
                <path d="M380 20 L350 20 M380 20 L380 50" stroke="#8b7355" strokeWidth="0.5" opacity="0.5" />
                <path d="M20 480 L50 480 M20 480 L20 450" stroke="#8b7355" strokeWidth="0.5" opacity="0.5" />
                <path d="M380 480 L350 480 M380 480 L380 450" stroke="#8b7355" strokeWidth="0.5" opacity="0.5" />
              </svg>
            </div>

            {/* Floating detail card */}
            <div className="absolute -bottom-6 -right-6 bg-[#2c5f4a] p-6 max-w-[180px]">
              <p className="font-display text-4xl font-light text-[#faf8f5] leading-none mb-1">100%</p>
              <p className="text-xs tracking-[0.2em] uppercase text-[#a8d4c3]">Natural Origin</p>
            </div>
          </div>

          {/* Right — text */}
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[#8b7355] mb-6">Nossa História</p>
            <h2 className="font-display text-5xl md:text-6xl font-light text-[#faf8f5] mb-8 leading-[1.05]">
              Nascida da<br />
              <em className="not-italic text-[#6fb89f]">simplicidade</em>
            </h2>

            <div className="space-y-5 text-[#faf8f5]/60 leading-relaxed">
              <p>
                KOA nasceu de uma pergunta simples: por que uma camiseta boa precisa ser complicada?
              </p>
              <p>
                Escolhemos o algodão Pima peruano — reconhecido como um dos melhores do mundo — e adicionamos uma pitada de elastano para garantir mobilidade real. O resultado é uma peça que desaparece no seu corpo, deixando só o conforto.
              </p>
              <p>
                Minimalismo não é apenas estética para nós. É uma forma de pensar cada detalhe com intenção: o que fica é o que importa.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-[#faf8f5]/10 pt-10">
              {[
                { number: "180g", label: "Gramatura" },
                { number: "2x", label: "Mais durável" },
                { number: "0", label: "Substâncias nocivas" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-light text-[#6fb89f] mb-1">{stat.number}</p>
                  <p className="text-xs text-[#faf8f5]/40 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
