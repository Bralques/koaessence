import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

const SIZES = ["P", "M", "G", "GG"];

const products = [
  {
    id: "essencial-branca",
    name: "Essencial Branca",
    description: "Fit Regular · Algodão Peruano",
    price: 189.9,
    image: "/branco.jpg",
    colors: [{ name: "Branco", hex: "#f5f0e8" }],
  },
  {
    id: "essencial-off-white",
    name: "Essencial Off-White",
    description: "Fit Regular · Algodão Peruano",
    price: 189.9,
    image: "/off-white.jpg",
    colors: [{ name: "Off-White", hex: "#e8e0d0" }],
  },
  {
    id: "essencial-cinza",
    name: "Essencial Cinza",
    description: "Fit Regular · Algodão Peruano",
    price: 189.9,
    image: "/cinza.jpeg",
    colors: [{ name: "Cinza", hex: "#9a9a98" }],
  },
  {
    id: "essencial-preta",
    name: "Essencial Preta",
    description: "Fit Regular · Algodão Peruano",
    price: 189.9,
    image: "/preto.jpeg",
    colors: [{ name: "Preto", hex: "#1c1c1a" }],
  },
  {
    id: "botanica-verde",
    name: "Botânica Verde",
    description: "Fit Relaxed · Algodão Peruano",
    price: 209.9,
    image: "/verde.jpg",
    colors: [{ name: "Verde", hex: "#2c5f4a" }],
  },
  {
    id: "horizonte-azul",
    name: "Horizonte Azul",
    description: "Fit Regular · Algodão Peruano",
    price: 209.9,
    image: "/azul.jpg",
    colors: [{ name: "Azul", hex: "#4a7fa5" }],
  },
];

async function main() {
  console.log("🌱 Iniciando seed...\n");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        active: true,
        variants: {
          create: p.colors.flatMap((color) =>
            SIZES.map((size) => ({
              color: color.name,
              colorHex: color.hex,
              size,
              stock: 20,
            }))
          ),
        },
      },
    });

    console.log(`  ✓ ${product.name} — ${p.colors.length * SIZES.length} variantes (20 un. cada)`);
  }

  console.log("\n✅ Seed concluído! 6 produtos, 24 variantes cada.");
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
