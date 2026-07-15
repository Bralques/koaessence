import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductsAdmin from "./ProductsAdmin";

export default async function ProdutosPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-[#1c1c1a] mb-8">Produtos & Estoque</h1>
      <ProductsAdmin products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
