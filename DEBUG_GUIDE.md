# DEBUG_GUIDE.md — Sbornitsa

## Debugging Mindset for This Project

**This is a fully static site.** There are no API routes, no database, no server at runtime. All data is compiled into the JavaScript bundle at build time. "Backend" bugs are almost always a build-pipeline failure or a data shape mismatch.

**Where bugs are most likely:**
1. Zustand hydration timing (`hydrated` flag) — blank render before localStorage is read
2. Auth redirect loop — `AuthProvider` is mounted twice, both layouts guard routes
3. Build data pipeline — missing/wrong `DATA_ENCRYPTION_KEY` breaks the entire build
4. Client/Server component boundary — `use(promise)` in Client components suspended by Suspense
5. Translation namespace mismatches — `fetchTranslations` swallows errors silently and returns `undefined`, causing `notFound()`
6. Static params generation — `generateStaticParams` must return all valid IDs for dynamic routes

---

## Quick Triage Checklist

When something is broken, check in this order:

- [ ] **Is it a blank page?** → Zustand not yet hydrated or `AuthProvider` redirecting. Open DevTools → Application → Local Storage → `sbornitsa-family`. If missing, user is unauthenticated.
- [ ] **Is it a build failure?** → Check `DATA_ENCRYPTION_KEY` env var. Run `bun run scripts/build-data.ts` in isolation first.
- [ ] **Is it a 404 page?** → Either `fetchTranslations` returned `undefined` (translation namespace typo) or the data entity doesn't exist.
- [ ] **Is data missing/undefined?** → Trace the promise chain: API → Repo → Data file. Check if the entity ID exists in `lib/schemas/constants.ts` enums.
- [ ] **Is UI not updating?** → Check if the component is a Client Component (`'use client'`). Server Components don't react to Zustand. Check `hydrated` flag in both stores.
- [ ] **Is routing broken?** → Check `i18n/routing.ts` for locale list. All links must include `/${locale}/` prefix.

---

## Entry Points for Debugging

### UI Bug
Start at the page, then the client component:
```
app/[locale]/(authenticated)/[section]/page.tsx   ← server, data fetching
components/shared/[feature].tsx                    ← client, rendering
```

### Data Issue (wrong/missing data)
```
lib/data/[entity].ts               ← is the data entry present?
lib/schemas/constants.ts           ← is the ID in the enum? (Zod will throw if not)
lib/repositories/[entity].ts       ← is the lookup method correct?
lib/api/[entity].ts                ← which repo method is called?
```

### Auth Issue (login fails / redirects)
```
components/providers/auth-provider.tsx   ← routing logic
lib/store/auth.store.ts                  ← login() method, SHA256 check
lib/repositories/families.repository.ts ← findById() lookup
lib/data/families-generated.json        ← is the family entry present?
scripts/build-data.ts                   ← was password hashed correctly at build?
```

### Build Error
```
scripts/build-data.ts              ← decrypt step
data/families.enc                  ← encrypted source
lib/data/families-generated.json   ← output (should exist post-build)
.env.local / CI env vars           ← DATA_ENCRYPTION_KEY
```

### i18n / Translation Issue
```
components/utils/fetch-translations.tsx   ← namespace mapping, error suppression
messages/ru.json                          ← Russian strings
messages/en.json                          ← English strings
i18n/request.ts                           ← message loading
```

### Routing Issue
```
i18n/routing.ts                           ← locales list
app/[locale]/layout.tsx                   ← locale validation (notFound if invalid)
components/providers/auth-provider.tsx    ← redirect logic
```

---

## Common Bug Scenarios

### "Page is completely blank"
**Cause:** `AuthProvider` renders `null` until `isMounted && hydrated`.  
**Check:**
- Open DevTools Console → any errors?
- Application → Local Storage → key `sbornitsa-family` exists?
- If localStorage is empty: user is not authenticated → should redirect to `/login`
- If localStorage exists but page is still blank: hydration stuck. Check `auth.store.ts:onRehydrateStorage` is calling `state?.setHydrated(true)`.
- **Files:** `components/providers/auth-provider.tsx`, `lib/store/auth.store.ts`

### "Redirecting in a loop"
**Cause:** `AuthProvider` is mounted in BOTH `app/[locale]/layout.tsx` AND `app/[locale]/(authenticated)/layout.tsx`. Both fire `router.push()`.  
**Check:**
- Is `isAuthenticated` true in Zustand but still redirecting to `/login`?
- Are there two simultaneous redirects competing?
- **Files:** `app/[locale]/layout.tsx:36`, `app/[locale]/(authenticated)/layout.tsx:47`

### "Login fails with correct credentials"
**Trace:**
1. `components/ui/forms/login-form.tsx` → `login(username, password)` called
2. `lib/store/auth.store.ts:login()` → `familiesRepo.findById(username)` → check family exists
3. `lib/repositories/families.repository.ts:findById()` → Map lookup
4. SHA256 check: `CryptoJS.SHA256(password).toString() === family.password`
5. `family.password` in `lib/data/families-generated.json` must be the SHA256 hash of the plaintext password
6. **If build was run with wrong `DATA_ENCRYPTION_KEY`**, the generated JSON will be garbled → passwords will not match
- `console.warn` in `auth.store.ts` will log either `"Family not found"` or `"Invalid password"`

### "Data is undefined / component shows nothing"
**Trace the promise chain:**
1. Page (server) calls `lib/api/[entity].ts` → returns promise
2. Promise passed as prop to client component
3. Client component calls `use(promise)` inside `<Suspense>`
4. If entity doesn't exist in data: the `findById()` returns `undefined` → component renders `null` (no error)
5. **Files to check:**
   - `lib/data/[entity].ts` — is the entry there?
   - `lib/schemas/constants.ts` — is the ID in the correct enum? Zod will throw at parse time if not.
   - `lib/repositories/[entity].repository.ts` — Map lookup correct?

### "Page shows 404 unexpectedly"
**Most likely cause:** `fetchTranslations` returned `undefined`.  
**Check:**
- `components/utils/fetch-translations.tsx` catches all errors and returns `undefined`
- Every page does `if (!t) return notFound()` — any translation namespace typo silently 404s
- **Check the namespace string** passed to `fetchTranslations()` against actual keys in `messages/ru.json`
- Example: passing `'pages.transactions'` but the key is `'page.transactions'` → 404

### "Transaction balance is wrong"
**Trace:**
1. `components/shared/balance.tsx`: filters `familyTransactions` by `family.id`, sums `value`
2. `components/shared/transactions-list.tsx`: same filter + join to `transactions` lookup
3. `lib/api/transactions.ts:fetchFamilyTransactions()` → `familyTransactionsRepo.findAll()`
4. `lib/repositories/transactions.repository.ts:FamilyTransactionsRepository`
5. Data source: `lib/data/transactions.ts` → `familyTransactions` array
- Check the `familyTransactions` entries have the correct `family` ID (must be in `FAMILY_IDS` enum)
- Check `value` sign: negative = expense, positive = income

### "New user/family not showing up"
**This project has no database.** Adding data requires:
1. Add entry to `lib/data/users.ts` or `lib/data/families.ts` (for families: edit plaintext source, re-encrypt, rebuild)
2. Add ID to `lib/schemas/constants.ts` enum (`USER_IDS` or `FAMILY_IDS`)
3. Rebuild: `bun run build`
- If ID not in enum: Zod parse will throw at build time or runtime
- For families specifically: edit `data/families.secret.json` (local) or re-encrypt `data/families.enc`

### "Build fails"
**Check in order:**
1. `DATA_ENCRYPTION_KEY` env var is set
2. `data/families.enc` exists (or `data/families.secret.json` for local dev)
3. Run `bun run scripts/build-data.ts` alone — read the error output
4. Check `lib/data/families-generated.json` was created and is valid JSON
5. Zod schema validation errors: a data entry with an ID not in the enum will throw

### "Hydration error (React)"
**Cause:** Server-rendered HTML doesn't match client render. In this static site, common sources:
- `ThemeProvider` with `suppressHydrationWarning` on `<html>` — already handled
- Any component reading `localStorage` or `window` directly (not through Zustand)
- Date formatting that differs between server and client timezone
- `lib/tools/time.ts:format()` — check if it produces locale-dependent output
- **Fix pattern:** Wrap browser-only code in `useEffect` or use a `mounted` state flag (pattern already used in `AuthProvider`)

### "Filter not working on transactions page"
**Check:**
1. `components/shared/transactions-list.tsx` — reads `useSelectedCategoryIds()`, `useFilterHydrated()`
2. If `hydrated === false` → renders `null` (component returns early)
3. Filter state in `lib/store/filter.store.ts` — persisted as `sbornitsa-filter` in localStorage
4. Category IDs must match `TRANSACTIONS_CATEGORY_IDS` enum in `lib/schemas/constants.ts`

---

## Data Tracing Guide

### Tracing a transaction to the UI
```
lib/data/transactions.ts                    → raw Transaction[] + FamilyTransaction[]
lib/repositories/index.ts                   → transactionsRepo, familyTransactionsRepo (singletons)
lib/repositories/transactions.repository.ts → findAll(), findByFamily()
lib/api/transactions.ts                     → fetchTransactions(), fetchFamilyTransactions()
app/[locale]/(authenticated)/transactions/page.tsx  → creates promises, passes to TransactionsList
components/shared/transactions-list.tsx     → use(promise), filters by family.id, renders
```

### Tracing a family to the profile page
```
lib/data/families-generated.json            → decrypted + hashed family data
lib/data/families.ts                        → Families class wrapping the JSON
lib/repositories/families.repository.ts     → FamiliesRepository (Map by id)
lib/store/auth.store.ts:login()             → familiesRepo.findById() → set({family})
lib/store/auth.store.ts                     → persisted to localStorage
components/shared/profile.tsx               → useFamily() from Zustand
components/shared/family-card.tsx           → use(familyPromise), getUserById() (sync)
```

### How `getUserById` works (sync, no async)
```
lib/api/users.ts:getUserById()              → usersRepo.findById()  (synchronous)
lib/repositories/index.ts                  → usersRepo = new UsersRepository(users)
lib/data/users.ts                          → users array
```
Used by `FamilyCard` to synchronously resolve mother/father/children during render.

---

## Logging Strategy

**Add logs at these points for maximum visibility:**

```typescript
// 1. Auth store — login attempts
lib/store/auth.store.ts:login()
// Already has console.warn for failures. Add console.log for success.

// 2. AuthProvider — redirect decisions
components/providers/auth-provider.tsx
// Log: isMounted, hydrated, isAuthenticated, pathname on every effect run

// 3. Build script — data pipeline
scripts/build-data.ts
// Already has console.log/error. Add JSON.stringify(processedFamilies[0]) to verify shape.

// 4. fetchTranslations — silent error swallower
components/utils/fetch-translations.tsx
// The catch block only logs error. Add: console.error('Failed namespace:', Object.values(translations))

// 5. Repository constructors — verify data loaded
lib/repositories/index.ts
// Add: console.log('Loaded', users.length, 'users,', families.length, 'families')
```

---

## High-Risk Files

| File | Risk | Why |
|------|------|-----|
| `components/providers/auth-provider.tsx` | High | Mounted twice, timing-sensitive, controls all access |
| `scripts/build-data.ts` | High | Build fails entirely if env var wrong or file missing |
| `components/utils/fetch-translations.tsx` | High | Silently returns `undefined`, causes `notFound()` on all pages |
| `lib/store/auth.store.ts` | Medium | SHA256 comparison, localStorage persistence, hydration flag |
| `lib/data/families-generated.json` | Medium | Generated file; must exist and be valid JSON for app to work |
| `lib/schemas/constants.ts` | Medium | Adding a user/family without updating this enum breaks Zod parsing |
| `components/shared/transactions-list.tsx` | Medium | 3 async promises + 2 Zustand stores + filter logic in one component |
| `app/[locale]/(authenticated)/families/page.tsx` | Low | Inline balance calc, dead import of `Families` class |

---

## Fast Fix Patterns

**Pattern: entity not found → check enum first**
```bash
grep -n 'the-entity-id' lib/schemas/constants.ts
```
If missing → add to the appropriate `*_IDS` array.

**Pattern: translation 404 → find the namespace**
```bash
grep -rn 'pages.something' messages/ru.json
```
Find the actual key path and fix the `fetchTranslations()` call in the page.

**Pattern: blank page → check hydration**
- Open React DevTools → find `AuthProvider` → inspect `isMounted` and `hydrated` state
- Or: DevTools Console → `JSON.parse(localStorage.getItem('sbornitsa-family'))`

**Pattern: password not matching → check build**
```bash
# Regenerate families-generated.json
DATA_ENCRYPTION_KEY=your-key bun run scripts/build-data.ts
# Then check the hash
node -e "const c=require('crypto-js'); console.log(c.SHA256('yourpassword').toString())"
```
Compare against `lib/data/families-generated.json`.

**Pattern: static param missing (dynamic 404 in prod)**
- `generateStaticParams()` must cover all valid IDs
- For families: `app/[locale]/(authenticated)/families/[id]/page.tsx` uses `fetchFamilies()` — ensure all families are in data
- For users: `users/[id]/page.tsx:generateStaticParams()` returns raw `User[]` — works because Next.js uses the `id` field, but verify `User.id` matches URL param

---

## Anti-Patterns Detected

- **`AuthProvider` in two layouts** — creates race condition between redirect calls; order of effect execution is unclear when user lands on authenticated route
- **`fetchTranslations` error suppression** — errors are logged but `undefined` is returned, leading to `notFound()` with no visible indicator of what failed
- **`FamilyCard` is both Client and Server-compatible** — called via `use(promise)` from client contexts AND from `Profile` (client) with `Promise.resolve(family)`. Works but blurs component boundary intent.
- **Flat data arrays as source of truth** — no referential integrity enforcement at runtime; a typo in a user ID string in `lib/data/users.ts` will pass TypeScript but fail Zod validation only when parsed
- **Balance computed in three different places** — `families/page.tsx` (inline loop), `balance.tsx` (filter+reduce), `familyTransactionsRepo.calculateBalance()` (repo method, never used in UI)

---

## Minimal File Sets for Debugging

| Issue | Files to read |
|-------|--------------|
| Blank page / auth | `auth-provider.tsx`, `auth.store.ts` |
| Login failure | `login-form.tsx`, `auth.store.ts`, `families.repository.ts`, `families-generated.json` |
| Missing data | `constants.ts`, `lib/data/[entity].ts`, `lib/repositories/[entity].repository.ts` |
| Wrong balance | `transactions-list.tsx`, `balance.tsx`, `lib/data/transactions.ts` |
| Build failure | `scripts/build-data.ts`, `.env.local`, `data/families.enc` |
| 404 on valid route | `fetch-translations.tsx`, `messages/ru.json`, relevant `page.tsx` |
| Static route missing in prod | `[entity]/[id]/page.tsx:generateStaticParams`, `lib/api/[entity].ts` |
| Filter broken | `filter.store.ts`, `transactions-list.tsx` |
| i18n text wrong | `messages/ru.json`, `messages/en.json`, `i18n/routing.ts` |

---

## AI Debug Instructions

When asking AI about a bug in this project, include:

1. **The page/route** where the issue occurs (e.g., `/ru/transactions`)
2. **Attach these files** based on issue type:
   - Auth/blank: `auth-provider.tsx` + `auth.store.ts`
   - Data: the relevant `lib/api/*.ts` + `lib/repositories/*.ts` + `lib/data/*.ts`
   - Build: `scripts/build-data.ts` + the error output
   - Translation/404: `fetch-translations.tsx` + `messages/ru.json`
3. **State the data shape** — paste a sample entry from `lib/data/` or `families-generated.json`
4. **Note: no API routes exist** — if asked about API endpoints, clarify this is a static site
5. **Note the dual-AuthProvider** — if routing issues, mention `AuthProvider` is mounted in both `[locale]/layout.tsx` and `(authenticated)/layout.tsx`
