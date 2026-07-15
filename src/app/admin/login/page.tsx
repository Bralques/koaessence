"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Email ou senha incorretos.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="KOA" className="h-12 w-auto mx-auto mb-6" />
          <h1 className="font-display text-3xl font-light text-[#1c1c1a]">Admin</h1>
          <p className="text-sm text-[#4a3c2a]/50 mt-1">Acesso restrito</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-5 shadow-sm">
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/60 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#4a3c2a]/60 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#ede4d4] text-sm focus:outline-none focus:border-[#2c5f4a] transition-colors"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c1c1a] text-[#faf8f5] py-3.5 text-sm tracking-widest uppercase hover:bg-[#2c5f4a] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
