"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { label: "Dashboard", href: "/admin", icon: "▦" },
  { label: "Produtos", href: "/admin/produtos", icon: "◈" },
  { label: "Pedidos", href: "/admin/pedidos", icon: "◎" },
  { label: "Cupons", href: "/admin/cupons", icon: "◇" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1c1c1a] flex flex-col shrink-0">
        <div className="px-6 py-8 border-b border-white/10">
          <img src="/logo.png" alt="KOA" className="h-8 w-auto brightness-0 invert opacity-90" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mt-2">Admin</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                pathname === item.href
                  ? "bg-[#2c5f4a] text-[#faf8f5]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <span>↩</span> Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
