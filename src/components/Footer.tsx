export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1c1c1a] text-[#faf8f5]/50 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img src="/logo.png" alt="KOA" className="h-10 w-auto mb-4 brightness-0 invert opacity-90" />
            <p className="text-sm leading-relaxed max-w-[200px]">
              Algodão Peruano. Conforto sem limites. Estilo para todos os momentos.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Empresa",
              links: ["Nossa História", "Materiais", "Sustentabilidade", "Imprensa"],
            },
            {
              title: "Ajuda",
              links: ["FAQ", "Trocas & Devoluções", "Guia de Tamanhos", "Contato"],
            },
            {
              title: "Social",
              links: ["Instagram", "TikTok", "Pinterest", "Newsletter"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs tracking-[0.3em] uppercase text-[#faf8f5]/30 mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm hover:text-[#faf8f5] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#faf8f5]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            © {year} KOA. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-[#faf8f5] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#faf8f5] transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
