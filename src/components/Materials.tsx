const materials = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1" />
        <path d="M24 8 C18 14 14 20 14 24 C14 32 18 36 24 38 C30 36 34 32 34 24 C34 20 30 14 24 8Z" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M10 24 C16 20 20 20 24 24 C28 28 32 28 38 24" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    ),
    title: "Algodão Peruano",
    subtitle: "Pima Extra Longa",
    description:
      "O melhor algodão do mundo. Fibras extra longas que proporcionam maciez inigualável, durabilidade superior e toque de seda na pele.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 24 C8 14 14 8 24 8 C34 8 40 14 40 24" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M8 24 C8 34 14 40 24 40 C34 40 40 34 40 24" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M16 20 C16 20 20 16 24 20 C28 24 32 20 32 20" stroke="currentColor" strokeWidth="1" />
        <path d="M16 28 C16 28 20 24 24 28 C28 32 32 28 32 28" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    title: "Elastano Premium",
    subtitle: "5% de composição",
    description:
      "Mobilidade sem limites. O elastano garante que a peça acompanhe cada movimento sem perder a forma, mantendo o caimento perfeito.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M12 36 L24 12 L36 36" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M16 28 L32 28" stroke="currentColor" strokeWidth="1" />
        <path d="M24 12 L24 8" stroke="currentColor" strokeWidth="1" />
        <circle cx="24" cy="6" r="2" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    title: "Tecnologia Antiodor",
    subtitle: "Tratamento especial",
    description:
      "Fio tratado com tecnologia antimicrobiana que inibe a proliferação de bactérias, mantendo frescor por mais tempo em qualquer atividade.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 40 C24 40 8 32 8 20 C8 14 14 8 24 8" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M24 40 C24 40 40 32 40 20 C40 14 34 8 24 8" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M20 24 L24 28 L30 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Certificação OEKO-TEX",
    subtitle: "Sem substâncias nocivas",
    description:
      "Certificado internacionalmente livre de substâncias prejudiciais. Seguro para a pele, para as pessoas que produzem e para o planeta.",
  },
];

export default function Materials() {
  return (
    <section id="materiais" className="py-28 md:py-36 bg-[#f5f0e8]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-xs tracking-[0.4em] uppercase text-[#8b7355] mb-4">
            Tecnologia & Matéria-prima
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-[#1c1c1a] mb-6">
            O que faz<br />a diferença
          </h2>
          <p className="text-[#4a3c2a]/60 text-lg leading-relaxed">
            Cada detalhe escolhido com propósito. Conforto que se sente desde o primeiro uso.
          </p>
        </div>

        {/* Materials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {materials.map((mat) => (
            <div key={mat.title} className="flex flex-col gap-5">
              <div className="text-[#2c5f4a]">{mat.icon}</div>
              <div>
                <h3 className="font-display text-2xl font-light text-[#1c1c1a] mb-0.5">
                  {mat.title}
                </h3>
                <p className="text-xs tracking-[0.2em] uppercase text-[#8b7355] mb-3">
                  {mat.subtitle}
                </p>
                <p className="text-sm text-[#4a3c2a]/60 leading-relaxed">
                  {mat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Composition bar */}
        <div className="mt-24 p-8 md:p-12 bg-[#ede4d4]">
          <p className="text-xs tracking-[0.4em] uppercase text-[#8b7355] mb-6">Composição</p>
          <div className="flex items-center gap-0 rounded-full overflow-hidden h-3 mb-4">
            <div className="h-full bg-[#2c5f4a]" style={{ width: "95%" }} />
            <div className="h-full bg-[#a8d4c3]" style={{ width: "5%" }} />
          </div>
          <div className="flex justify-between text-sm text-[#4a3c2a]">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2c5f4a] inline-block" />
              95% Algodão Peruano Pima
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#a8d4c3] inline-block" />
              5% Elastano
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
