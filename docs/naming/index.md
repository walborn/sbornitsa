# Именование папок, файлов, компонентов, типов и переменных

## Kebab-case для файлов `theme-provider.tsx`
```typescript
// ✅ good
theme-provider.tsx
user-avatar.tsx
knowledge-base.tsx

// ❌ bad
ThemeProvider.tsx
UserAvatar.tsx
KnowledgeBase.tsx
```

## PascalCase для компонентов `ThemeProvider`
```ts
// ✅ good
export function ThemeProvider() { ... }
export const UserAvatar = () => { ... }
```

## camelCase для переменных `themeProvider`
```ts
// ✅ good
const value = 42
let userData = { name: 'Vasya', createdAt: 'Tue Nov 11 2025', ... }
```

# 🤔 ПОЧЕМУ ТАК?

## 1. КОНСИСТЕНТНОСТЬ С СИСТЕМОЙ
Файловая система большинства ОС **case-insensitive** (на Windows/Mac):
```bash
# На Windows/Mac это ОДИН И ТОТ ЖЕ файл:
ThemeProvider.tsx
themeProvider.tsx
themeprovider.tsx
```

### 2. URL-совместимость
Веб-стандарты используют kebab-case:
```sh
# Веб-адреса всегда в kebab-case
https://api.com/user-profile
https://app.com/theme-provider
```
```tsx
// Импорты следуют тому же принципу
import { ThemeProvider } from './theme-provider'
```

### 3. Автодополнение и поиск
```sh
# Легко искать и автодополнять
"theme-" → покажет все theme-* файлы
"user-" → покажет все user-* файлы

# В PascalCase сложнее
"Theme" → ThemeProvider, ThemeToggler, ThemeContext - все перемешано
```

### 4. Визуальное разделение
```typescript
// Четко видно что файл, а что компонент
import { ThemeProvider } from './theme-provider'
import { UserAvatar } from './user-avatar' 
//          ↑ компонент        ↑ файл
```

## 📋 ПОЛНЫЙ СПИСОК ПРАВИЛ

### Файлы/Папки → kebab-case
```ts
components/
├── theme-provider.tsx    // ✅
├── user-avatar.tsx       // ✅
├── knowledge-base/       // ✅
│   ├── article-list.tsx  // ✅
```

### Компоненты/Типы → PascalCase  
```ts
export function ThemeProvider() {}    // ✅
export const UserAvatar = () => {}    // ✅
export type UserProfile = {}          // ✅
interface KnowledgeArticle {}         // ✅
```

### Переменные/Функции → camelCase
```ts
const [currentUser, setCurrentUser] = useState()  // ✅
const handleThemeChange = () => {}                // ✅
const knowledgeBaseApi = {}                       // ✅
```

### Константы → UPPER_SNAKE_CASE
```typescript
export const API_ENDPOINTS = {        // ✅
  USER_PROFILE: '/api/user-profile',
  THEME_CONFIG: '/api/theme-config'
}
```

## 🚀 РЕАЛЬНЫЙ ПРИМЕР ИЗ ПРОЕКТА

```typescript
// ✅ ПРАВИЛЬНАЯ СТРУКТУРА
app/
├── providers/
│   ├── theme-provider.tsx      // ← файл kebab-case
│   └── auth-provider.tsx
├── components/
│   ├── shared/
│   │   ├── theme-toggler.tsx   // ← файл kebab-case  
│   │   └── user-avatar.tsx
│   └── ui/
│       ├── button.tsx
│       └── input.tsx

// theme-provider.tsx
export function ThemeProvider() { ... }  // ← компонент PascalCase

// theme-toggler.tsx  
export function ThemeToggler() { ... }   // ← компонент PascalCase

// Использование
import { ThemeProvider } from '~/providers/theme-provider'    // ✅
import { ThemeToggler } from '~/components/shared/theme-toggler' // ✅
```

## 💡 ГЛАВНОЕ ПРАВИЛО
**Файл** = kebab-case
**Компонент** = PascalCase
**Переменная** = snakeCase
**Константа** = UPPER_SNAKE_CASE

Это стандарт де-факто в современной React-экосистеме, который избегает проблем с кроссплатформенностью и делает код более читаемым!
