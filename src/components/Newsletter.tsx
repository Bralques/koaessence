"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-24 bg-[#f5f0e8] border-t border-[#ede4d4]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#8b7355] mb-4">
            Comunidade KOA
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1c1c1a] mb-4">
            Fique por dentro
          </h2>
          <p className="text-[#4a3c2a]/60 mb-10">
            Novos lançamentos, histórias por trás das peças e acesso antecipado à coleção.
          </p>

          {submitted ? (
            <div className="py-6">
              <p className="font-display text-2xl text-[#2c5f4a] italic">Obrigado!</p>
              <p className="text-sm text-[#4a3c2a]/60 mt-2">Em breve você receberá nossas novidades.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 px-5 py-3.5 bg-white border border-[#ede4d4] text-sm text-[#1c1c1a] placeholder:text-[#4a3c2a]/30 focus:outline-none focus:border-[#2c5f4a] transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#1c1c1a] text-[#faf8f5] text-sm tracking-widest uppercase hover:bg-[#2c5f4a] transition-colors duration-300 whitespace-nowrap"
              >
                Inscrever-se
              </button>
            </form>
          )}

          <p className="text-xs text-[#4a3c2a]/40 mt-4">
            Sem spam. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
}
