# PROJECT_MAP.md — Sbornitsa

## Overview

**Type:** Next.js App Router, **fully static export** (`output: 'export'`)  
**Runtime:** Bun  
**No API routes. No SSR at request time.** Everything is built statically; data is baked into the JS bundle at build time.  
**Auth:** Client-side only — Zustand store persisted to `localStorage`, SHA256 password check against hashed family passwords.  
**i18n:** next-intl, locales `['ru', 'en']`, default `ru`. Locale is the first path segment.

---

## Architecture Layers

```
data/families.enc          ← encrypted source of truth (git-tracked)
        ↓ [scripts/build-data.ts, requires DATA_ENCRYPTION_KEY env]
lib/data/families-generated.json   ← output, passwords SHA256-hashed
lib/data/*.ts              ← static data arrays (events, transactions, users, categories)
        ↓
lib/repositories/*.ts      ← singletons, Map-indexed, O(1) lookups
        ↓
lib/api/*.ts               ← thin async wrappers calling repos
        ↓
app/[locale]/(authenticated)/*/page.tsx  ← Server Components (call API, pass Promises)
        ↓
components/shared/*.tsx    ← Client Components (use(promise), Zustand stores)
```

---

## Routing Structure

```
app/
  layout.tsx                    → RootLayout (ThemeProvider, fonts)
  page.tsx                      → redirect /ru
  [locale]/
    layout.tsx                  → LocaleLayout (NextIntlClientProvider, AuthProvider, SEO schemas)
    page.tsx                    → redirect /[locale]/profile
    login/
      page.tsx                  → LoginPage (no auth guard)
    (authenticated)/
      layout.tsx                → Auth-guarded layout (AppSidebar, AppHeader, AuthProvider again)
      profile/page.tsx          → reads family from Zustand (no API call)
      transactions/page.tsx     → fetchTransactions + fetchFamilyTransactions + fetchCategories
      families/
        page.tsx                → fetchFamilies + fetchFamilyTransactions (balance calc inline)
        [id]/page.tsx           → fetchFamilyById (Suspense → FamilyCard)
      users/
        page.tsx                → fetchUsers
        [id]/page.tsx           → fetchUserById (Suspense → UserCard)
      events/page.tsx           → fetchEvents (Suspense → EventsList)
```

---

## Component Hierarchy

```
RootLayout
└── ThemeProvider
    └── LocaleLayout
        └── NextIntlClientProvider
            └── AuthProvider  ← CLIENT, guards all routes, reads/writes Zustand
                └── (authenticated)/layout.tsx
                    └── AppHeaderProvider  ← CLIENT, Context for header slot
                        └── SidebarProvider
                            ├── AppSidebar
                            └── SidebarInset
                                ├── <header> → AppHeader (reads Context)
                                └── <main> → {children} → page.tsx (Server Component)
```

**Key Client Components (marked `'use client'`):**
- `components/providers/auth-provider.tsx` — routing guard
- `components/layout/app-header-provider.tsx` — header slot Context
- `components/utils/app-header.tsx` — pushes children into Context via useEffect
- `components/shared/balance.tsx` — unwraps Promise, reads Zustand
- `components/shared/transactions-list.tsx` — unwraps 3 Promises, reads Zustand (auth + filter)
- `components/shared/events-list.tsx` — unwraps Promise
- `components/shared/family-card.tsx` — unwraps Promise via `use()`, calls sync `getUserById`
- `components/shared/profile.tsx` — reads Zustand, renders FamilyCard
- `components/ui/forms/login-form.tsx` — form, calls `useAuthStore().login()`

**Server Components (no directive):**
- All `page.tsx` files in `app/[locale]/(authenticated)/`
- `components/shared/user-card.tsx`
- `components/utils/fetch-translations.tsx`

---

## Data Flow

### Build-time data pipeline
```
data/families.enc
  → scripts/build-data.ts (AES decrypt with DATA_ENCRYPTION_KEY, SHA256 hash passwords)
  → lib/data/families-generated.json
```
All other data (`users`, `transactions`, `events`, `categories`) lives as hardcoded TypeScript arrays in `lib/data/`.

### Request lifecycle (static site)
```
Browser request → static HTML/JS served
  → React hydration
  → AuthProvider mounts, reads localStorage (Zustand rehydrate)
  → hydrated=true → AuthProvider either shows children or redirects to /login
  → Server Components already rendered (data from repos baked in at build)
  → Client Components use(promise) resolves instantly (in-memory data)
```

### Transaction data join (done client-side)
```
TransactionsList (client):
  transactions: Record<id, Transaction>       ← from transactionsPromise
  familyTransactions: FamilyTransaction[]     ← from familyTransactionsPromise
  categories: Record<id, TransactionCategory> ← from categoriesPromise

Filtering: familyTransactions.filter(ft => ft.family === family.id)
Join:      ft.transaction → transactions[ft.transaction]
```

---

## Store State

### `lib/store/auth.store.ts`
- `family: Family | null` — logged-in family object
- `isAuthenticated: boolean`
- `hydrated: boolean` — localStorage rehydration complete flag
- Persisted as `sbornitsa-family` in localStorage

### `lib/store/filter.store.ts`
- `selectedCategoryIds: string[]` — active transaction category filters
- Persisted as `sbornitsa-filter` in localStorage

---

## Dependency Graph (critical paths)

```
lib/schemas/constants.ts     ← USER_IDS, FAMILY_IDS, TRANSACTIONS_CATEGORY_IDS (enums)
  ↑ imported by
lib/schemas/*.ts             ← Zod schemas, types
  ↑ imported by
lib/data/*.ts                ← raw data + Families class
lib/repositories/*.ts        ← data access layer
lib/api/*.ts                 ← async wrappers
  ↑ imported by
app/**/page.tsx              ← Server Components
  ↑ pass promises to
components/shared/*.tsx      ← Client Components
  ↑ also read
lib/store/*.ts               ← Zustand (auth, filter)
```

---

## Known Structural Issues

| Issue | Location | Impact |
|-------|----------|--------|
| `AuthProvider` mounted twice | `[locale]/layout.tsx` AND `(authenticated)/layout.tsx` | Double router.push() on unauthenticated — uncertain behavior |
| Dead import `Families` class | `families/page.tsx` | No runtime impact, misleading |
| Duplicate `fetchFamilies` | `lib/api/users.ts` also exports it | Confusion over canonical import |
| `generateStaticParams` returns full User objects | `users/[id]/page.tsx` | Should return `{id: string}[]` — works coincidentally since User has `id` |
| `fetchTranslations` swallows errors | `components/utils/fetch-translations.tsx` | Translation errors cause silent `notFound()` on all pages |
| `families/page.tsx` balance calc | Inline loop over all `familyTransactions` | Fine at current scale; no repo method used |

---

## Environment Variables

| Var | Required | Purpose |
|-----|----------|---------|
| `DATA_ENCRYPTION_KEY` | **Build-time required** | Decrypt `data/families.enc` |
| `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` | Optional | Yandex Maps (not wired to any current page) |
| `NEXT_PUBLIC_SITE_URL` | Optional | SEO base URL |
| `GOOGLE_VERIFICATION_CODE` | Optional | SEO |
| `YANDEX_VERIFICATION_CODE` | Optional | SEO |

---

## Build Command

```bash
bun run scripts/build-data.ts   # decrypt → families-generated.json
bun next build                  # static export to /out
```
