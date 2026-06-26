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
  // Create-only: settings are managed from the admin panel after the first
  // run. Re-seeding must NEVER overwrite operator-edited values in production,
  // so existing keys are left untouched (only missing keys are inserted).
  for (const setting of SETTINGS) {
    const existing = await prisma.setting.findUnique({
      where: { key: setting.key },
    });
    if (!existing) {
      await prisma.setting.create({
        data: { key: setting.key, value: setting.value },
      });
    }
  }
}

const MIN_ADMIN_PASSWORD_LENGTH = 8;

/**
 * Known placeholder/example secrets that must never be accepted as a real
 * admin password. Compared case-insensitively. Mirrors the denylist enforced
 * by deploy.sh so neither path can bootstrap an admin with a sample value.
 */
const PLACEHOLDER_ADMIN_PASSWORDS = new Set<string>([
  "change-me-locally",
  "change-this-securely",
  "replace-with-a-strong-password",
  "replace-with-a-32-plus-character-secret",
  "password",
  "changeme",
  "admin",
]);

/**
 * Known placeholder/example admin emails. Compared case-insensitively. Mirrors
 * the denylist enforced by deploy.sh.
 */
const PLACEHOLDER_ADMIN_EMAILS = new Set<string>([
  "admin@example.com",
  "replace-with-admin-email@example.com",
  "admin@laqueseria.co",
]);

/**
 * A value is a placeholder if it carries the shipped "replace-with" marker or
 * matches a known example value.
 */
function isPlaceholder(value: string, denylist: Set<string>): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes("replace-with") || denylist.has(normalized);
}

/**
 * Bootstrap the initial admin user — security-sensitive.
 *
 * Rules:
 *  - Credentials come ONLY from ADMIN_EMAIL / ADMIN_PASSWORD env vars. There
 *    are no committed default credentials.
 *  - If they are not set, admin bootstrap is skipped (the rest of the seed
 *    still runs). Production stays without an admin until one is provisioned.
 *  - If the admin does not exist, it is created.
 *  - If the admin already exists, its password is LEFT UNCHANGED, unless
 *    FORCE_ADMIN_PASSWORD_RESET=1 is explicitly provided.
 *  - The password is never logged.
 */
async function seedAdmin(): Promise<void> {
  const email = process.env["ADMIN_EMAIL"]?.trim();
  const password = process.env["ADMIN_PASSWORD"];
  const forceReset = process.env["FORCE_ADMIN_PASSWORD_RESET"] === "1";

  if (!email || !password) {
    console.log(
      "[seed] ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin bootstrap.",
    );
    return;
  }

  if (isPlaceholder(email, PLACEHOLDER_ADMIN_EMAILS)) {
    throw new Error(
      "ADMIN_EMAIL is a known placeholder/example value — set a real email.",
    );
  }

  if (password.length < MIN_ADMIN_PASSWORD_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters.`,
    );
  }

  if (isPlaceholder(password, PLACEHOLDER_ADMIN_PASSWORDS)) {
    throw new Error(
      "ADMIN_PASSWORD is a known placeholder/example value — set a real secret.",
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        fullName: "Administrador",
        role: "ADMIN",
        isActive: true,
      },
    });
    console.log(`[seed] created admin user ${email}.`);
    return;
  }

  if (forceReset) {
    await prisma.user.update({
      where: { email },
      data: { passwordHash: await hashPassword(password), isActive: true },
    });
    console.log(
      `[seed] FORCE_ADMIN_PASSWORD_RESET=1 — reset password for ${email}.`,
    );
    return;
  }

  console.log(
    `[seed] admin ${email} already exists — password unchanged ` +
      "(set FORCE_ADMIN_PASSWORD_RESET=1 to reset it).",
  );
}

async function seedProducts(categoryIds: Map<string, string>): Promise<void> {
  for (const product of PRODUCTS) {
    const categoryId = categoryIds.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category for slug "${product.categorySlug}"`);
    }
    const slug = slugify(product.name);
    // Local, first-party category illustration (no external assets). Real
    // per-product photos can later be dropped at /images/products/ and set here.
    const imageUrl = `/images/products/${product.categorySlug}.svg`;
    await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        imageUrl,
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
        imageUrl,
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
  console.log("[seed] completed: categories, settings, products (admin per env).");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
