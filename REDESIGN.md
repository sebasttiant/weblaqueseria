# Premium Redesign — progress (for audit)

Status: **public-site premium visual pass implemented and awaiting/under final
validation.** Admin, auth, cart, orders, Docker and deploy files were intentionally
left untouched.

## Visual strategy
The DOCUMENTACION assets are **brand logos + a store-sign photo + an Instagram
screenshot — there is NO product photography**. Since external hotlinking is
forbidden and no real food photos exist, "premium" is achieved with: the real
brand mark, the real store photo, first-party **SVG category illustrations**
(full warm-toned tiles), editorial layout, warm palette, and tasteful motion.
Real product photos can later be dropped at `/images/products/` and they take
over automatically (seed + `ProductImage` already resolve photo-first).

## Done (commits 68e9497, fa2a62a + current polish pass)
- **Assets copied** (no external hotlinks):
  - `public/images/brand/la-queseria-logo.png`  ← DOCUMENTACION/2.png
  - `public/images/brand/la-queseria-emblem.png` ← DOCUMENTACION/4.png
  - `public/images/sections/store-sign.png`      ← DOCUMENTACION/3.png
  - `public/images/sections/instagram-profile.png` ← DOCUMENTACION/1.png
- **Created** first-party SVG category illustrations:
  - `public/images/products/{quesos,masa-madre,charcuteria,artesanales,gastronomia-europea}.svg`
- `components/product/ProductImage.tsx` — photo-first, category-illustration
  fallback on a warm gradient panel (next/image). **No blank placeholders.**
- `components/product/ProductCard.tsx` — rebuilt: image-first, category pill,
  description, larger price, hover lift/scale/ring.
- `prisma/seed.ts` — products carry local `/images/products/<category>.svg`.
- `next.config.ts` — safe SVG optimization (CSP + attachment).
- `app/globals.css` — added `--color-gold`, `--color-cream-200`.
- `animejs@4.5.0` installed (for motion, not wired yet).
- Motion wired through React-safe client components:
  - `components/motion/Reveal.tsx`
  - `components/motion/HeroMotion.tsx`
  - `components/motion/StaggeredProducts.tsx`
  These use Anime.js v4 `createScope`, `animate`, `stagger`, cleanup via
  `scope.current?.revert()`, and respect `prefers-reduced-motion`.
- Home hero rebuilt with a premium dark editorial layout, dual CTA, trust chips,
  store-sign photo, brand logo/emblem, and local category illustration accents.
- Home sections refreshed:
  - `Favoritos de la casa` featured grid with staggered products.
  - `Arma tu tabla` category section.
  - `De la cava a tu mesa` differentiators section.
  - `Masa madre` editorial story block.
  - `Visítanos` location block with real store-sign image.
- Header/footer enriched with local emblem/logo treatment, active public nav
  state, stronger CTA copy, and professional Spanish copy.
- Contact page rebuilt with warm imagery, stronger WhatsApp panel, Instagram and
  visit cards, and store-sign image instead of a plain placeholder.
- Product detail now uses `ProductImage`, stronger purchase layout, serving
  suggestion panels, resolved cart image fallback, and related products by
  category when available.

## Commands run
- `pnpm lint` → pass
- `pnpm typecheck` → pass
- `pnpm build` → pass when run with build-time `DATABASE_URL` and
  `NEXT_PUBLIC_SITE_URL` placeholders. Without `DATABASE_URL`, build fails during
  `/sitemap.xml` page-data collection due existing env validation.

## Docker — skipped (intentional)
Skipped on purpose: (1) this redesign touched **no** Docker/compose/Dockerfile
files, so container behaviour is unchanged and already verified earlier; (2) a
full image build is heavy and this machine's Docker **bridge network can't reach
the registry** — it needs the local `docker-compose.override.yml` (build:
network: host) workaround. Non-Docker gates are green.

## Remaining / follow-up
- Replace category illustrations with real product photography when available;
  the current implementation remains first-party/local and has no blank product
  placeholders.
- Manual browser review recommended for final spacing and animation feel on home,
  `/productos`, `/productos/[slug]`, and `/contacto`.
- Admin remains intentionally unchanged.

## Manual review
- `/productos` and home featured grid — confirm cards show category tiles, hover
  feels premium, no blanks.
- After `pnpm db:seed`, confirm products have `/images/products/*.svg`.

## Git
- Branch `main`, ahead of `origin/main` by the redesign commits + earlier
  `.gitignore` commit. **Not pushed** (left for audit).
