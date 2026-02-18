# AI Assistant Project Context Guide

> **Цель**: Это руководство помогает ИИ-ассистенту понимать контекст проекта "Sbornitsa" и принимать правильные архитектурные решения при генерации кода.

---

## 📋 О проекте

**Sbornitsa** - это приложение для управления финансами семейного кооператива, работающее как статический сайт на GitHub Pages.

### Ключевые характеристики:

- **Тип**: Статический Next.js сайт (SSG)
- **Деплой**: GitHub Pages
- **Аутентификация**: Локальная (localStorage) с шифрованием
- **Данные**: Хранятся в TypeScript файлах, генерируются на этапе сборки
- **Интернационализация**: Русский (основной) + Английский

### Доменная область:

- **Пользователи**: Семьи с родителями и детьми
- **Транзакции**: Финансовые операции между семьями и общими расходами
- **Категории**: Музыка, английский, переводы, супермаркеты, подарки
- **Теги**: Группировка пользователей (родители, учителя, дети, матери, отцы, сыновья, дочери)

---

## 🏗️ Архитектурные решения

### 1. Статическая генерация (SSG)

**Почему**: GitHub Pages не поддерживает серверную логику.

**Следствия**:
- ❌ НЕЛЬЗЯ использовать Server Actions
- ❌ НЕЛЬЗЯ использовать `headers()` в компонентах
- ❌ НЕЛЬЗЯ использовать API routes
- ✅ Используйте `process.env.NEXT_PUBLIC_*` для динамических значений
- ✅ Все данные генерируются в build time через `scripts/build-data.ts`

**Пример правильного подхода**:
```ts
// ❌ НЕПРАВИЛЬНО - headers() не работает в статической генерации
import { headers } from 'next/headers'
const host = headers().get('host')

// ✅ ПРАВИЛЬНО - используйте env переменные
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
```

### 2. Аутентификация через localStorage

**Почему**: Нет бэкенда, данные статические, нужна простая аутентификация для семей.

**Реализация**:
- Данные семьи (ID, пароль) хранятся в `lib/data/families-generated.json`
- При логине данные сохраняются в `zustand` store (с персистенцией в localStorage)
- Используется `useAuthStore` для управления состоянием

**API функции**:
```ts
// lib/auth.ts (re-exports from store)
useAuthStore()
useFamily()
useIsAuthenticated()
```

**Важно**: Не предлагайте JWT, cookies, или серверную аутентификацию - они не подходят для статического сайта.

### 3. Система типов

**Централизация**: 
- Типы в `lib/definitions.ts`
- Схемы валидации в `lib/schemas/index.ts`
- Branded types в `lib/types/branded.ts`

**Строгая типизация с Branded Types**:
```ts
// Compile-time защита от смешивания ID
export type UserId = Brand<string, 'UserId'>
export type FamilyId = Brand<string, 'FamilyId'>

// Zod schemas для runtime валидации
export const FamilySchema = z.object({
  id: FamilyIdSchema,
  mother: UserIdSchema,
  // ...
})
```

**Почему**: 
- Runtime validation (Zod)
- Compile-time safety (Branded types)
- Автодополнение и предотвращение ошибок

**Правило для ИИ**: При работе с данными всегда используйте Zod schemas для валидации и Branded types для аргументов функций.

### 4. Структура данных

**Принцип**: Данные в TypeScript файлах → генерация JSON на этапе сборки

```
lib/data/
├── users.ts              # Массив всех пользователей
├── families.ts           # Класс для работы с семьями
├── transactions.ts       # Транзакции и связи семья-транзакция
└── families-generated.json  # Автогенерируемый файл (НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ)
```

**Паттерн Репозитория**:
Доступ к данным осуществляется через типизированные репозитории:

```ts
import { usersRepo, familiesRepo, transactionsRepo } from '@/lib/repositories.instance'

// Быстрый доступ O(1)
const user = usersRepo.findById(userId)
const family = familiesRepo.findById(familyId)
```

**Правило для ИИ**: 
- Не импортируйте массивы данных напрямую (кроме скриптов сборки)
- Используйте методы репозиториев для поиска и фильтрации
- JSON файлы генерируются автоматически через build скрипт

---

## 🎯 Паттерны кода

### 1. Компоненты

#### Server vs Client компоненты

```tsx
// ✅ Server Component (по умолчанию) - для статического контента
export default function UserProfile({ userId }: Props) {
  const user = users.find(u => u.id === userId)
  return <div>{user.name}</div>
}

// ✅ Client Component - для интерактивности
'use client'

import { useState } from 'react'

export default function LoginForm() {
  const [error, setError] = useState<string>()
  // ...
}
```

#### React 19 Patterns (RSC + Suspense)

```tsx
// ✅ Server Component с Streaming
export default function UserPage({ params }: Props) {
  // 1. Start fetching early (non-blocking)
  const userPromise = fetchUser(params.id)
  
  // 2. Pass promise to child
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserCard userPromise={userPromise} />
    </Suspense>
  )
}

// ✅ Client Component с use()
'use client'
import { use } from 'react'

export default function UserCard({ userPromise }: Props) {
  // 3. Unwrap promise in render
  const user = use(userPromise)
  return <div>{user.name}</div>
}
```

**Правило для ИИ**: 
- Используйте паттерн "Pass Promise to Child"
- Оборачивайте асинхронные части в `<Suspense>`
- Используйте хук `use()` для получения данных из промисов
- Избегайте `await` на верхнем уровне page.tsx для критического пути (блокирует рендеринг всей страницы)

#### Типизация Props

```tsx
// ✅ ПРАВИЛЬНО - интерфейс Props
interface Props {
  user: User
  onUpdate?: () => void
}

export const UserCard = ({ user, onUpdate }: Props) => {
  // ...
}

// ❌ НЕПРАВИЛЬНО - inline типизация
export const UserCard = ({ user, onUpdate }: { user: User, onUpdate?: () => void }) => {
  // ...
}
```

### 2. Утилиты

#### cn() для условных классов

```tsx
import { cn } from '@/lib/utils'

// ✅ ПРАВИЛЬНО
<div className={cn(
  'text-base',
  isActive && 'bg-blue-500',
  value > 0 ? 'text-green-500' : 'text-red-500'
)}>

// ❌ НЕПРАВИЛЬНО - конкатенация строк
<div className={`text-base ${isActive ? 'bg-blue-500' : ''}`}>
```

#### Специализированные утилиты

```ts
// lib/tools/ - специфичные инструменты
lib/tools/
├── time.ts         # format(timestamp) - форматирование времени
├── calc.ts         # Калькуляции для транзакций
└── webpify.ts      # Конвертация изображений
```

**Правило для ИИ**: Общие утилиты в `lib/utils.ts`, специализированные в `lib/tools/`.

### 3. Импорты

**Используйте алиас `@/*`**:

```ts
// ✅ ПРАВИЛЬНО
import { Button } from '@/components/ui/button'
import { users } from '@/lib/data/users'

// ❌ НЕПРАВИЛЬНО
import { Button } from '../../../components/ui/button'
```

**Организация импортов** (Biome делает автоматически):

```ts
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { clsx } from 'clsx'

import { Button } from '@/components/ui/button'
import { getFamily } from '@/lib/auth'

import type { User } from './types'
```

### 4. SEO и метаданные

```ts
// ✅ ПРАВИЛЬНО - для статической генерации
export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  
  return {
    title: 'Page Title | Sbornitsa',
    description: '...',
    openGraph: {
      url: `${siteUrl}/path`,
      // ...
    },
  }
}

// ❌ НЕПРАВИЛЬНО - headers() не работает в SSG
import { headers } from 'next/headers'
const host = headers().get('host')
```

**Правило для ИИ**: ВСЕГДА используйте `process.env.NEXT_PUBLIC_SITE_URL`, никогда `headers()`.

---

## 🔐 Безопасность и криптография

### Шифрование данных

```ts
// crypto-js для шифрования
import CryptoJS from 'crypto-js'

// Приватный ключ из переменных окружения
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY

// Шифрование перед сохранением в localStorage
const encrypted = CryptoJS.AES.encrypt(data, PRIVATE_KEY).toString()
localStorage.setItem('family', encrypted)

// Расшифровка при чтении
const decrypted = CryptoJS.AES.decrypt(encrypted, PRIVATE_KEY)
const data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
```

**Правило для ИИ**: Используйте crypto-js для шифрования чувствительных данных в localStorage.

---

## 🌐 Интернационализация (i18n)

### Структура переводов

```
messages/
├── en.json
└── ru.json
```

### Использование

```tsx
'use client'

import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('ComponentName')
  
  return <h1>{t('title')}</h1>
}
```

**Правило для ИИ**: При добавлении новых текстов ВСЕГДА обновляйте ОБА файла (en.json и ru.json).

### Локализованные роуты

```
app/
  [locale]/
    page.tsx              # /{locale}/
    profile/
      page.tsx            # /{locale}/profile
```

**Правило для ИИ**: Все страницы должны быть внутри `app/[locale]/`.

---

## 📊 Работа с данными

### Паттерн: Вычисление балансов

```ts
// Вычисляем балансы из транзакций
const values: Record<string, number> = {}

for (const { family, value } of familyTransactions) {
  values[family] = (values[family] ?? 0) + value
}

// Обновляем семьи с новыми балансами
const families = familiesInstance.update_values(values)
```

**Правило для ИИ**: Балансы вычисляются динамически из транзакций, не хранятся отдельно.

### Паттерн: Фильтрация по семье

```ts
// В клиентском компоненте получаем текущую семью
const family = getFamily()

if (!family) return null

// Фильтруем транзакции
const familyTransactions = allTransactions.filter(
  tx => tx.family === family.id
)
```

### Паттерн: Работа с тегами

```ts
// Создание тегов с проверкой уникальности
import { createTags } from '@/lib/definitions'

const tags = createTags(['parents', 'mothers'] as const)

// Проверка наличия тега
if (user.tags.has('teachers')) {
  // ...
}
```

**Правило для ИИ**: Всегда используйте `createTags()` для создания тегов - это обеспечивает уникальность.

---

## 🎨 UI/UX паттерны

### Shadcn UI компоненты

Проект использует Shadcn UI компоненты в `components/ui/`:

```tsx
// Используйте готовые компоненты
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

<Card>
  <CardContent>
    <Avatar>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.name[0]}</AvatarFallback>
    </Avatar>
  </CardContent>
</Card>
```

**Правило для ИИ**: Используйте существующие UI компоненты. Не создавайте дубликаты.

### Темная тема

```tsx
// Поддержка dark mode через модификатор dark:
<div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">
```

**Правило для ИИ**: ВСЕГДА добавляйте `dark:` варианты для новых компонентов.

### Адаптивность

```tsx
// Используйте responsive модификаторы Tailwind
<div className="flex flex-col md:flex-row gap-4">
  <img className="w-full md:w-1/2" />
</div>
```

---

## 🚫 Частые ошибки и как их избегать

### 1. Async Client Components

```tsx
// ❌ ОШИБКА
'use client'

export default async function Component() {
  // Async клиентские компоненты запрещены!
}

// ✅ РЕШЕНИЕ: Уберите 'use client' для async компонентов
export default async function Component() {
  const data = await fetchData()
  return <ClientComponent data={data} />
}
```

### 2. Забытые обновления типов

```ts
// ❌ ОШИБКА: Добавили пользователя в users.ts, но забыли обновить UserId
export const users: User[] = [
  { id: 'new.user', ... }, // TypeScript не ругается!
]

// ✅ РЕШЕНИЕ: Обновите union type в definitions.ts
type UserId = 
  | 'anastasia.chernaya'
  | 'new.user'  // ← Добавьте сюда
  | ...
```

### 3. Неправильная работа с localStorage в SSR

```tsx
// ❌ ОШИБКА: localStorage вызывается в Server Component
export default function Page() {
  const data = localStorage.getItem('key') // Error!
}

// ✅ РЕШЕНИЕ: Используйте Client Component
'use client'

export default function Page() {
  const [data, setData] = useState<string | null>(null)
  
  useEffect(() => {
    setData(localStorage.getItem('key'))
  }, [])
}
```

### 4. Использование deprecated паттернов

```tsx
// ❌ ОШИБКА: forEach вместо map
const items: JSX.Element[] = []
data.forEach(item => {
  items.push(<Item key={item.id} {...item} />)
})

// ✅ РЕШЕНИЕ: Используйте map
const items = data.map(item => (
  <Item key={item.id} {...item} />
))
```

---

## 🔄 Процесс сборки

### Build flow

```bash
1. bun run scripts/build-data.ts  # Генерация JSON из TypeScript данных
2. next build                      # Next.js статическая генерация
3. GitHub Actions                  # Деплой на GitHub Pages
```

### Переменные окружения

```bash
# .env.local (для разработки)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PRIVATE_KEY=your_private_key

# GitHub Actions (для продакшена)
NEXT_PUBLIC_SITE_URL=https://yoursite.github.io
NEXT_PUBLIC_PRIVATE_KEY=${{ secrets.PRIVATE_KEY }}
```

**Правило для ИИ**: Все публичные переменные должны начинаться с `NEXT_PUBLIC_`.

---

## 📐 Принципы принятия решений для ИИ

### Когда добавлять новый компонент

```
✅ Создавайте новый компонент если:
- Логика переиспользуется в 2+ местах
- Компонент > 100 строк и имеет чёткую ответственность
- Нужна изоляция состояния

❌ НЕ создавайте компонент если:
- Используется только один раз
- Логика тривиальна (< 20 строк)
- Уже есть похожий компонент
```

### Когда добавлять новую утилиту

```
✅ Создавайте утилиту если:
- Функция используется в 3+ местах
- Логика не связана с React (чистая функция)
- Функция решает конкретную задачу

❌ НЕ создавайте утилиту если:
- Функция очень простая (1-2 строки)
- Логика специфична для одного компонента
```

### Когда использовать Client Component

```
✅ 'use client' нужен для:
- useState, useEffect, другие React hooks
- Browser APIs (localStorage, window, document)
- Event handlers (onClick, onChange, onSubmit)
- Библиотеки, требующие browser (maps, charts)

❌ 'use client' НЕ нужен для:
- Статического контента
- Серверных данных (fetch в компоненте)
- SEO-критичных страниц
```

### Когда обновлять типы в definitions.ts

```
✅ ВСЕГДА обновляйте definitions.ts при:
- Добавлении нового пользователя → UserId
- Добавлении новой семьи → FamilyId
- Добавлении новой категории → Category['id']
- Изменении структуры User/Family/Transaction

❌ НЕ добавляйте в definitions.ts:
- Типы, специфичные для одного компонента
- Временные/вспомогательные типы
```

---

## 🎯 Чеклист для ИИ перед генерацией кода

Перед тем как предложить решение, проверьте:

### Общие проверки:
- [ ] Совместимо ли решение со статической генерацией (SSG)?
- [ ] Используются ли правильные импорты с алиасом `@/*`?
- [ ] Есть ли явная типизация для всех функций и компонентов?
- [ ] Обновлены ли типы в `definitions.ts` если добавлены новые сущности?

### TypeScript:
- [ ] Используется `type` для импорта типов (`import type { ... }`)?
- [ ] Используется `const` вместо `let` где возможно?
- [ ] Используются стрелочные функции вместо `function`?
- [ ] Нет `any` типов без крайней необходимости?

### React:
- [ ] `'use client'` добавлен только где необходимо?
- [ ] Нет async функций в Client Components?
- [ ] Props типизированы через интерфейс?
- [ ] Используются самозакрывающиеся теги где возможно?

### Стили:
- [ ] Используется `cn()` для условных классов?
- [ ] Добавлены `dark:` варианты для стилей?
- [ ] Используются существующие UI компоненты вместо создания новых?

### i18n:
- [ ] Обновлены ОБА файла перевода (en.json и ru.json)?
- [ ] Используется `useTranslations` hook для клиентских компонентов?

### Безопасность:
- [ ] Нет хардкода паролей или секретов?
- [ ] Используется шифрование для чувствительных данных в localStorage?
- [ ] Используются переменные окружения для конфигурации?

---

## 💡 Примеры правильных решений

### Пример 1: Добавление нового пользователя

```ts
// 1. Добавляем в lib/definitions.ts
type UserId = 
  | 'existing.user'
  | 'new.user'  // ← NEW
  | ...

// 2. Добавляем в lib/data/users.ts
export const users: User[] = [
  // ...existing users
  {
    id: 'new.user',
    name: 'New User',
    family: 'somefamily',
    avatar: '/users/new.user.webp',
    birthdate: new Date(1990, 0, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
]

// 3. Добавляем аватар в public/users/new.user.webp
```

### Пример 2: Создание нового компонента со списком

```tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { getFamily } from '@/lib/auth'
import type { User } from '@/lib/definitions'

interface Props {
  users: User[]
}

export default function UsersList({ users }: Props) {
  const family = getFamily()
  
  if (!family) return null
  
  // Фильтруем пользователей по семье
  const familyUsers = users.filter(user => user.family === family.id)
  
  return (
    <div className="space-y-4">
      {familyUsers.map(user => (
        <Card key={user.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold dark:text-white">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.role}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### Пример 3: Добавление новой транзакции

```ts
// lib/data/transactions.ts

export const transactions: Transaction[] = [
  // ...existing transactions
  {
    id: 'tx-new-transaction',
    name: 'Название транзакции',
    description: 'Описание',
    value: -5000,
    category: 'music',
    families: {
      'eremeev': -1000,
      'petrov': -1500,
      'fadeev': -2500,
    },
    timestamp: Date.now(),
    teacher: 'veronika.zolotareva',
  },
]

// Создаём связи семья-транзакция
export const familyTransactions: FamilyTransaction[] = [
  // ...
  { family: 'eremeevs', transaction: 'tx-new-transaction', value: -1000 },
  { family: 'petrovs', transaction: 'tx-new-transaction', value: -1500 },
  { family: 'fadeevs', transaction: 'tx-new-transaction', value: -2500 },
]
```

---

## 📚 Справочная информация

### Структура User

```ts
type User = {
  id: UserId                      // Уникальный ID (name.surname)
  name: string                    // Отображаемое имя
  family?: FamilyId               // ID семьи
  birthdate: Date                 // Дата рождения
  avatar: string                  // Путь к аватару
  contacts?: Partial<Contacts>    // Телефон, telegram
  role: 'user' | 'manager' | 'admin'
  tags: Set<UserTag>              // Теги (parents, children, etc.)
}
```

### Структура Family

```ts
type Family = {
  id: FamilyId                    // Уникальный ID
  name: { ru: string; en: string } // Локализованное имя
  mother: User['id']              // ID матери
  father?: User['id']             // ID отца (опционально)
  children: User['id'][]          // Массив ID детей
  value: number                   // Текущий баланс
  password: string                // Пароль для входа
  avatar?: string                 // Аватар семьи
}
```

### Структура Transaction

```ts
type Transaction = {
  id: string                      // Уникальный ID (tx-*)
  name: string                    // Название
  description: string             // Описание
  value: number                   // Общая сумма (+ доход, - расход)
  category: Category['id']        // ID категории
  families: FamiliesIncomes       // Распределение по семьям
  timestamp: number               // Unix timestamp
  teacher?: User['id']            // ID учителя (если применимо)
  target?: TransactionTarget      // Детали получателя
  source?: TransactionSource      // Детали отправителя
}
```

### Основные API функции

```ts
// Аутентификация (lib/auth.ts)
login(username: string, password: string): boolean
logout(): void
getCurrentUser(): User | null
getFamily(): Family | null

// Утилиты (lib/utils.ts)
cn(...classes): string                          // Объединение классов
removeHtmlTags(str: string): string            // Удаление HTML
arrayToObjectById<T>(items: T[]): Record       // Массив → словарь

// Время (lib/tools/time.ts)
format(timestamp: number): string              // Форматирование даты
```

---

## 🎓 Обучение на примерах кода проекта

### Изучите эти файлы как примеры:

1. **Типизация**: `lib/definitions.ts` - образец строгой типизации
2. **Компоненты**: `components/shared/transaction-card.tsx` - простой компонент
3. **Client компонент**: `components/ui/forms/login-form.tsx` - форма с состоянием
4. **Работа с данными**: `lib/data/users.ts` - паттерны работы с данными
5. **Утилиты**: `lib/utils.ts` - примеры полезных функций

---

## ✅ Финальные рекомендации для ИИ

1. **Следуйте существующим паттернам** - не изобретайте новые подходы, если есть устоявшиеся
2. **Типизация превыше всего** - явные типы для всех функций и компонентов
3. **Статическая генерация - ограничение** - всегда проверяйте совместимость
4. **Минимализм** - не добавляйте лишние зависимости или абстракции
5. **Консистентность** - код должен выглядеть как написанный одним человеком

### Когда сомневаетесь:

- Проверьте существующий код для похожей задачи
- Следуйте принципу KISS (Keep It Simple, Stupid)
- Спросите пользователя при неоднозначностях
- Предложите простейшее рабочее решение первым

---

**Помните**: Этот проект - статический сайт для управления финансами семейного кооператива. Все решения должны быть просты, надёжны и совместимы с GitHub Pages.
