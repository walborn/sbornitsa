# 🎯 Стратегия хранения типов и интерфейсов

## 📁 СТРУКТУРА ПАПОК ДЛЯ ТИПОВ

```sh
src/
├── types/
│   ├── api.ts          # Типы API-ответов/запросов
│   ├── auth.ts         # Типы аутентификации
│   ├── knowledge.ts    # Типы базы знаний
│   ├── user.ts         # Типы пользователей
│   └── index.ts        # Баррель-экспорт
├── lib/
│   ├── validators.ts   # Zod схемы (генерируют типы)
│   └── db-types.ts     # Типы на основе Prisma
└── components/
    ├── shared/
    │   └── types.ts    # Локальные типы компонента (редко)
```

## 🎯 КОГДА И КУДА КЛАСТЬ ТИПЫ

### 1. Типы данных (на основе Prisma) → `types/`
```ts
// types/user.ts
export type UserProfile = {
  id: string
  name: string
  email: string
  department: string
  avatar?: string
}

export type UserWithProfile = Prisma.UserGetPayload<{
  include: { profile: true }
}>
```

### 2. API типы → `types/api.ts`
```ts
// types/api.ts
export type ApiResponse<T> = {
  data: T
  error?: string
  success: boolean
}

export type LoginRequest = {
  username: string
  password: string
}

export type KnowledgeArticle = {
  id: string
  title: string
  content: string
  author: UserProfile
  tags: string[]
  createdAt: string
}
```

### 3. Типы форм (на основе Zod) → `lib/validators.ts`
```ts
// lib/validators.ts
import { z } from 'zod'

export const profileFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  department: z.string(),
  bio: z.string().optional()
})

// Автогенерация типов из Zod схем
export type ProfileFormData = z.infer<typeof profileFormSchema>
export type ArticleFormData = z.infer<typeof articleFormSchema>
```

### 4. Типы компонентов → Локально или `types/`
```ts
// components/shared/user-avatar.tsx
// Локальные пропсы компонента
interface UserAvatarProps {
  user: UserProfile
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

// Если тип используется несколькими компонентами → выносим в types/
// types/components.ts
export interface SearchableSelectProps<T> {
  options: T[]
  onSelect: (item: T) => void
  placeholder?: string
}
```

## 🚀 ПРАКТИЧЕСКИЕ ПРИМЕРЫ

### Полная структура `types/`
```ts
// types/index.ts (баррель-экспорт)
export * from './auth'
export * from './user'
export * from './knowledge'
export * from './api'

// types/auth.ts
export interface UserSession {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'editor'
}

export interface LoginCredentials {
  email: string
  password: string
}

// types/knowledge.ts
export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  excerpt: string
  author: UserProfile
  tags: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface ArticleFilters {
  tags?: string[]
  author?: string
  search?: string
  page?: number
}
```

### Использование в компонентах
```ts
// components/shared/knowledge-card.tsx
import type { KnowledgeArticle } from '@/types'

interface KnowledgeCardProps {
  article: KnowledgeArticle
  onEdit?: (article: KnowledgeArticle) => void
  variant?: 'compact' | 'detailed'
}

export function KnowledgeCard({ article, onEdit }: KnowledgeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <CardDescription>{article.excerpt}</CardDescription>
      </CardHeader>
    </Card>
  )
}
```

### Использование в API роутах
```ts
// app/routes/api.knowledge.$id.ts
import type { KnowledgeArticle, ApiResponse } from '@/types'

export async function loader({ params }: LoaderFunctionArgs) {
  const article = await db.article.findUnique({
    where: { id: params.id },
    include: { author: true }
  })
  
  const response: ApiResponse<KnowledgeArticle> = {
    data: article,
    success: true
  }
  
  return json(response)
}
```

## 🎯 ПРАВИЛА ВЫБОРА МЕСТА

### Выносим в `types/` когда:
- Тип используется в 2+ компонентах
- Тип описывает данные API
- Тип используется в нескольких слоях приложения
- Тип сложный и требует документации

### Оставляем локально когда:
- Тип используется только в одном компоненте
- Это простые пропсы компонента
- Тип временный/вспомогательный

### Используем Zod-генерацию когда:
- Нужна валидация форм
- Хотим единый источник истины для формы
- Нужны runtime-проверки

## 🔧 ДОПОЛНИТЕЛЬНЫЕ ВОЗМОЖНОСТИ

### Генерация типов из Prisma
```ts
// lib/db-types.ts
import type { Prisma } from '@prisma/client'

export type UserWithProfile = Prisma.UserGetPayload<{
  include: { profile: true }
}>

export type ArticleWithAuthor = Prisma.ArticleGetPayload<{
  include: { author: true }
}>
```
