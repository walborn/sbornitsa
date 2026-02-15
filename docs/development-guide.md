# Development Guide / Руководство по разработке

Это руководство описывает стиль кода, технологии и паттерны, используемые в проекте Sbornitsa.

## 🛠️ Технологический стек

### Основные технологии

- **Next.js 16** (App Router) - React-фреймворк с поддержкой SSG (Static Site Generation)
- **React 19** - UI библиотека
- **TypeScript 5** - строгая типизация
- **Tailwind CSS 4** - утилитарные стили
- **Bun** - пакетный менеджер и runtime

### UI библиотеки и компоненты

- **Radix UI** - headless UI примитивы (Dialog, Accordion, Navigation Menu, Tooltip, etc.)
- **Shadcn UI** - переиспользуемые компоненты на базе Radix UI
- **Lucide React** - иконки
- **Heroicons** - дополнительные иконки
- **Embla Carousel** - карусели с автоплеем

### Интернационализация и локализация

- **next-intl** - i18n для Next.js
- **@formatjs/intl-localematcher** - определение локали пользователя
- **negotiator** - HTTP content negotiation
- Поддерживаемые языки: русский (`ru`), английский (`en`)

### Дополнительные библиотеки

- **crypto-js** - криптографические операции
- **zod** - валидация схем и типов
- **class-variance-authority (cva)** - управление вариантами компонентов
- **clsx** + **tailwind-merge** - объединение CSS классов
- **next-themes** - темная/светлая тема
- **@pbe/react-yandex-maps** - интеграция с Яндекс.Картами

### Инструменты разработки

- **Biome** - линтер и форматтер кода (замена ESLint + Prettier)
- **git-cz** (Commitizen) - структурированные коммиты
- **React Compiler** - оптимизация React компонентов

---

## 📁 Структура проекта

```
sbornitsa/
├── app/                       # Next.js App Router
│   ├── [locale]/             # Локализованные маршруты
│   └── globals.css           # Глобальные стили
├── components/               # React компоненты
│   ├── ui/                   # UI компоненты (формы, кнопки, т.д.)
│   └── shared/               # Переиспользуемые компоненты
├── lib/                      # Утилиты и бизнес-логика
│   ├── api/                  # API функции
│   ├── data/                 # Данные и модели
│   ├── seo/                  # SEO утилиты
│   ├── tools/                # Вспомогательные инструменты
│   ├── auth.ts               # Аутентификация
│   ├── definitions.ts        # TypeScript определения
│   └── utils.ts              # Общие утилиты
├── hooks/                    # Custom React хуки
├── i18n/                     # Настройки интернационализации
├── messages/                 # Переводы (en.json, ru.json)
├── public/                   # Статические файлы
├── scripts/                  # Скрипты сборки
└── docs/                     # Документация
```

---

## 🎨 Стиль кода

### TypeScript правила

#### Строгая типизация

```typescript
// ✅ ХОРОШО: Явная типизация
interface User {
  id: string
  name: string
  email: string
}

const getUser = (id: string): User | null => {
  // ...
}

// ❌ ПЛОХО: Неявные any
const getUser = (id) => {
  // ...
}
```

#### Используйте Type-Only импорты

```typescript
// ✅ ХОРОШО
import type { NextConfig } from 'next'
import type { User } from '@/lib/definitions'

// ❌ ПЛОХО
import { NextConfig } from 'next'
```

#### Используйте const вместо let когда возможно

```typescript
// ✅ ХОРОШО
const items = [1, 2, 3]

// ❌ ПЛОХО (если переменная не меняется)
let items = [1, 2, 3]
```

### JavaScript/TypeScript паттерны

#### Стрелочные функции

```typescript
// ✅ ХОРОШО: Стрелочные функции для колбэков
const numbers = [1, 2, 3].map(n => n * 2)

// ❌ ПЛОХО: function выражения
const numbers = [1, 2, 3].map(function (n) {
  return n * 2
})
```

#### Optional chaining и Nullish coalescing

```typescript
// ✅ ХОРОШО
const userName = user?.profile?.name ?? 'Anonymous'

// ❌ ПЛОХО
const userName = user && user.profile && user.profile.name || 'Anonymous'
```

#### Template literals

```typescript
// ✅ ХОРОШО
const greeting = `Hello, ${name}!`

// ❌ ПЛОХО
const greeting = 'Hello, ' + name + '!'
```

#### Избегайте forEach, используйте map/filter/reduce

```typescript
// ✅ ХОРОШО
const doubled = numbers.map(n => n * 2)

// ⚠️ ДОПУСТИМО (но предпочтительно map)
numbers.forEach(n => console.log(n))
```

### React паттерны

#### Используйте функциональные компоненты

```tsx
// ✅ ХОРОШО: Функциональный компонент с типизацией
interface Props {
  name: string
  age: number
}

export const UserCard = ({ name, age }: Props) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age} years old</p>
    </div>
  )
}

// ❌ ПЛОХО: Классовые компоненты (не используем)
class UserCard extends React.Component {
  // ...
}
```

#### Client/Server компоненты

```tsx
// ✅ Server Component (по умолчанию в Next.js 16)
export default function Page() {
  return <div>Server rendered</div>
}

// ✅ Client Component (с 'use client')
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

#### Самозакрывающиеся теги

```tsx
// ✅ ХОРОШО
<Image src="/logo.png" alt="Logo" />

// ❌ ПЛОХО
<Image src="/logo.png" alt="Logo"></Image>
```

### Стили и Tailwind

#### Используйте утилитарный подход

```tsx
// ✅ ХОРОШО: Tailwind утилиты
<div className="flex gap-4 p-4 bg-gray-100 dark:bg-gray-800">
  <Image className="rounded-full w-8 h-8" />
</div>

// Для условных классов используйте cn() (clsx + tailwind-merge)
import { cn } from '@/lib/utils'

<div className={cn(
  'font-normal',
  value > 0 && 'text-green-500',
  isActive && 'bg-blue-500'
)}>
```

#### Темная тема

```tsx
// Используйте dark: модификатор для dark mode стилей
<div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">
```

### Организация импортов

Biome автоматически организует импорты в следующем порядке:

1. React импорты
2. Пустая строка
3. Next.js импорты
4. Пустая строка
5. Сторонние пакеты
6. Пустая строка
7. Алиас импорты (`@/*`)
8. Пустая строка
9. Относительные импорты

```typescript
// Пример правильной организации:
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { cn } from 'class-variance-authority'

import { Button } from '@/components/ui/button'
import { login } from '@/lib/auth'

import type { User } from './types'
```

---

## 🎯 Архитектурные паттерны

### Путь алиас

Используйте `@/*` для абсолютных импортов:

```typescript
// ✅ ХОРОШО
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ❌ ПЛОХО
import { Button } from '../../components/ui/button'
```

### Определения типов

Храните типы и интерфейсы в `lib/definitions.ts`:

```typescript
// lib/definitions.ts
export interface User {
  id: string
  name: string
  email: string
}

export type UserId = string
export type Timestamp = number
```

### Утилиты

Общие утилиты в `lib/utils.ts`, специализированные в `lib/tools/`:

```typescript
// lib/utils.ts - общие утилиты
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// lib/tools/time.ts - специализированные утилиты
export const format = (timestamp: number): string => {
  // форматирование времени
}
```

### Аутентификация

Используйте localStorage для хранения аутентификации (статический сайт):

```typescript
// lib/auth.ts
export const login = (username: string, password: string): boolean => {
  // проверка и сохранение в localStorage
}

export const logout = (): void => {
  // очистка localStorage
}

export const getCurrentUser = (): User | null => {
  // получение текущего пользователя из localStorage
}
```

### SEO

Утилиты SEO в `lib/seo/`:

- Используйте динамические метаданные через `generateMetadata`
- Используйте переменную окружения `NEXT_PUBLIC_SITE_URL`
- Избегайте `headers()` для совместимости со статической генерацией

```typescript
// lib/seo/metadata.ts
export const generatePageMetadata = (title: string, description: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  return {
    title: `${title} | Sbornitsa`,
    description,
    // ...
  }
}
```

---

## 🚀 Команды и скрипты

```bash
# Разработка
bun dev                    # Запуск dev сервера

# Сборка
bun run scripts/build-data.ts  # Генерация данных
bun run build              # Сборка статического сайта

# Линтинг и форматирование
bun run lint               # Проверка с Biome
bun run format             # Форматирование кода

# Утилиты
bun run webpify            # Конвертация изображений в WebP
```

---

## 📝 Форматирование кода

### Настройки Biome

- **Отступы**: 2 пробела
- **Ширина строки**: 100 символов
- **Кавычки**: одинарные (`'`) для JS/TS, двойные (`"`) для JSX атрибутов
- **Точки с запятой**: только когда необходимо (`asNeeded`)
- **Trailing commas**: ES5
- **Arrow парентезы**: только когда необходимо (`asNeeded`)

### Примеры форматирования

```typescript
// Правильное форматирование
const user = {
  name: 'John',
  age: 30,
}

const greet = name => `Hello, ${name}!`

const Component = ({ title }: Props) => <div className="container">{title}</div>
```

---

## ⚠️ Частые ошибки и как их избежать

### 1. Async Client Components

```tsx
// ❌ ПЛОХО: async клиентский компонент
'use client'

export default async function Component() {
  // Это вызовет ошибку!
}

// ✅ ХОРОШО: async серверный компонент (без 'use client')
export default async function Component() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

### 2. Забытые зависимости в useState/useEffect

```tsx
// ❌ ПЛОХО
useEffect(() => {
  fetchData(userId)
}, []) // userId не в зависимостях!

// ✅ ХОРОШО
useEffect(() => {
  fetchData(userId)
}, [userId])
```

### 3. Неиспользуемые переменные

```typescript
// ❌ ПЛОХО
const unused = 'value' // Biome выдаст ошибку

// ✅ ХОРОШО: удалите неиспользуемые переменные
```

### 4. console.log в продакшене

```typescript
// ❌ ПЛОХО
console.log('debug info')

// ✅ ХОРОШО: используйте разрешённые методы
console.warn('Warning message')
console.error('Error message')
console.info('Info message')
```

---

## 🌐 Интернационализация

### Добавление переводов

1. Добавьте ключ в `messages/en.json` и `messages/ru.json`
2. Используйте `useTranslations` hook:

```tsx
'use client'

import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('ComponentName')
  
  return <h1>{t('title')}</h1>
}
```

### Локализованные роуты

Все маршруты должны быть в `app/[locale]/`:

```
app/
  [locale]/
    page.tsx           # /{locale}/
    profile/
      page.tsx         # /{locale}/profile
    about/
      page.tsx         # /{locale}/about
```

---

## 🔐 Безопасность

- Храните приватные ключи в GitHub Secrets/Variables
- Используйте `crypto-js` для шифрования
- Не храните пароли в plaintext
- Используйте хеширование для паролей клиентской стороны

---

## 📦 Статическая генерация

Проект настроен на статическую генерацию для GitHub Pages:

```typescript
// next.config.ts
const nextConfig = {
  output: 'export',          // Статический экспорт
  images: { unoptimized: true },
  trailingSlash: true,
}
```

**Ограничения:**
- Нельзя использовать Server Actions
- Нельзя использовать `headers()` в компонентах
- Нельзя использовать динамические маршруты без `generateStaticParams`
- Используйте environment variables для динамических данных

---

## ✅ Чеклист перед коммитом

- [ ] Код проходит `bun run lint` без ошибок
- [ ] Все импорты организованы (Biome сделает автоматически)
- [ ] Нет `console.log` в коде
- [ ] Типы определены для всех функций и компонентов
- [ ] Добавлены переводы для новых строк (en + ru)
- [ ] Тестирование в dev режиме
- [ ] Проверка сборки: `bun run build`

---

## 🔗 Полезные ссылки

- [Next.js документация](https://nextjs.org/docs)
- [React документация](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Biome](https://biomejs.dev/)
- [next-intl](https://next-intl-docs.vercel.app/)
