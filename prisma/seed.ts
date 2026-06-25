import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";
import { slugify } from "../lib/utils/format";

function buildClient(): PrismaClient {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
}

const prisma = buildClient();

interface CategorySeed {
  slug: string;
  name: string;
  sortOrder: number;
}

const CATEGORIES: CategorySeed[] = [
  { slug: "quesos", name: "Quesos", sortOrder: 1 },
  { slug: "charcuteria", name: "Jamones & Charcutería", sortOrder: 2 },
  { slug: "masa-madre", name: "Masa Madre", sortOrder: 3 },
  { slug: "artesanales", name: "Artesanales", sortOrder: 4 },
  { slug: "gastronomia-europea", name: "Gastronomía Europea", sortOrder: 5 },
];

const SETTINGS: Array<{ key: string; value: string }> = [
  { key: "whatsapp", value: "573137144863" },
  { key: "whatsapp_display", value: "313 714 4863" },
  { key: "instagram", value: "laqueseria_plazadelaamerica" },
  { key: "address", value: "Plaza de Mercado de la América, Local 126" },
  { key: "hero_title", value: "La Quesería" },
  { key: "hero_subtitle", value: "Quesos & Masa Madre" },
  { key: "slogan", value: "Todo comenzó con una Cuajada" },
  { key: "hours", value: "Lun a Sáb 8:00 - 18:00" },
];

interface ProductSeed {
  name: string;
  description: string;
  priceCents: number;
  categorySlug: string;
  isFeatured: boolean;
  sortOrder: number;
}

const PRODUCTS: ProductSeed[] = [
  {
    name: "Queso Campesino Artesanal",
    description:
      "Queso fresco de cuajada suave, elaborado a diario con leche de la región.",
    priceCents: 18000,
    categorySlug: "quesos",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: "Queso Madurado tipo Gouda",
    description:
      "Maduración lenta con notas mantecosas y un final ligeramente dulce.",
    priceCents: 32000,
    categorySlug: "quesos",
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: "Jamón Serrano Curado",
    description:
      "Curado tradicional de larga maduración, cortado fino para tabla.",
    priceCents: 45000,
    categorySlug: "charcuteria",
    isFeatured: false,
    sortOrder: 1,
  },
  {
    name: "Salami Artesanal de la Casa",
    description: "Embutido curado con especias seleccionadas y pimienta negra.",
    priceCents: 28000,
    categorySlug: "charcuteria",
    isFeatured: false,
    sortOrder: 2,
  },
  {
    name: "Pan de Masa Madre Tradicional",
    description:
      "Fermentación natural de 24 horas, corteza crujiente y miga aireada.",
    priceCents: 14000,
    categorySlug: "masa-madre",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: "Focaccia de Romero y Aceite de Oliva",
    description: "Masa madre esponjosa horneada con romero fresco y sal marina.",
    priceCents: 16000,
    categorySlug: "masa-madre",
    isFeatured: false,
    sortOrder: 2,
  },
  {
    name: "Tabla de Quesos Artesanales",
    description:
      "Selección curada de quesos de la casa para compartir, lista para servir.",
    priceCents: 55000,
    categorySlug: "artesanales",
    isFeatured: false,
    sortOrder: 1,
  },
  {
    name: "Aceite de Oliva Virgen Extra Europeo",
    description:
      "Prensado en frío, importado de origen, ideal para acompañar el pan.",
    priceCents: 38000,
    categorySlug: "gastronomia-europea",
    isFeatured: false,
    sortOrder: 1,
  },
];

async function seedCategories(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (const category of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, sortOrder: category.sortOrder },
      create: {
        slug: category.slug,
        name: category.name,
        sortOrder: category.sortOrder,
      },
    });
    map.set(category.slug, record.id);
  }
  return map;
}

async function seedSettings(): Promise<void> {
  for (const setting of SETTINGS) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    });
  }
}

async function seedAdmin(): Promise<void> {
  const email = process.env["ADMIN_EMAIL"] ?? "admin@laqueseria.co";
  const password = process.env["ADMIN_PASSWORD"] ?? "change-me-locally";
  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, isActive: true },
    create: {
      email,
      passwordHash,
      fullName: "Administrador",
      role: "ADMIN",
    },
  });
}

async function seedProducts(categoryIds: Map<string, string>): Promise<void> {
  for (const product of PRODUCTS) {
    const categoryId = categoryIds.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category for slug "${product.categorySlug}"`);
    }
    const slug = slugify(product.name);
    await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        categoryId,
        isFeatured: product.isFeatured,
        sortOrder: product.sortOrder,
        isActive: true,
      },
      create: {
        name: product.name,
        slug,
        description: product.description,
        priceCents: product.priceCents,
        currency: "COP",
        categoryId,
        isFeatured: product.isFeatured,
        sortOrder: product.sortOrder,
      },
    });
  }
}

async function main(): Promise<void> {
  const categoryIds = await seedCategories();
  await seedSettings();
  await seedAdmin();
  await seedProducts(categoryIds);
  console.log("Seed completed: categories, settings, admin user, products.");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
