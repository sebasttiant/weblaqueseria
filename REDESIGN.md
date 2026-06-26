# Premium Redesign — progress (for audit)

Status: **foundation + product imagery shipped and validated.** The rest of the
public-site visual pass is scoped below and not yet done.

## Visual strategy
The DOCUMENTACION assets are **brand logos + a store-sign photo + an Instagram
screenshot — there is NO product photography**. Since external hotlinking is
forbidden and no real food photos exist, "premium" is achieved with: the real
brand mark, the real store photo, first-party **SVG category illustrations**
(full warm-toned tiles), editorial layout, warm palette, and tasteful motion.
Real product photos can later be dropped at `/images/products/` and they take
over automatically (seed + `ProductImage` already resolve photo-first).

## Done (commits 68e9497, fa2a62a)
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

## Commands run
- `pnpm lint` → pass
- `pnpm typecheck` → pass
- `pnpm build` → pass

## Docker — skipped (intentional)
Skipped on purpose: (1) this redesign touched **no** Docker/compose/Dockerfile
files, so container behaviour is unchanged and already verified earlier; (2) a
full image build is heavy and this machine's Docker **bridge network can't reach
the registry** — it needs the local `docker-compose.override.yml` (build:
network: host) workaround. Non-Docker gates are green.

## Remaining (next session)
Still on the OLD design (functional, not broken):
- **Motion** components (`Reveal`, `HeroMotion`, `StaggeredProducts`) — animejs
  v4 `createScope`/`animate`/`stagger`, respect `prefers-reduced-motion`.
- **Hero** rebuild (collage w/ logo + store sign + illustrations, new headline,
  trust chips, dual CTA).
- **Sections**: Featured ("Favoritos de la casa"), "Arma tu tabla", "De la cava
  a tu mesa", "Masa madre", Location ("Visítanos") with store-sign photo.
- **Header/Footer**: logo treatment, active nav state, richer footer.
- **Contact page**: warm imagery, bigger WhatsApp, stronger panels.
- **Product detail** (`app/productos/[slug]/page.tsx`): large image via
  `ProductImage`, serving suggestion, related products (still has its own
  image fallback — wire `ProductImage` to remove any blank there too).
- Admin: leave as-is.

## Manual review
- `/productos` and home featured grid — confirm cards show category tiles, hover
  feels premium, no blanks.
- After `pnpm db:seed`, confirm products have `/images/products/*.svg`.

## Git
- Branch `main`, ahead of `origin/main` by the redesign commits + earlier
  `.gitignore` commit. **Not pushed** (left for audit).
