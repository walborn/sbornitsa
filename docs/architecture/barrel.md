# 🎯 Стратегии экспорта/импорта компонентов

Мы используем **комбинированную стратегию**:

## 📁 **СТРУКТУРА С BARREL-ФАЙЛАМИ**

```sh
components/
├── ui/
│   ├── index.ts        # ← Barrel-файл
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── shared/
│   ├── index.ts        # ← Barrel-файл  
│   ├── user-avatar.tsx
│   └── theme-toggler.tsx
├── layout/
│   ├── index.ts        # ← Barrel-файл
│   ├── header.tsx
│   └── sidebar.tsx
└── index.ts            # ← Главный barrel-файл
```

## 🚀 ПРАКТИЧЕСКАЯ РЕАЛИЗАЦИЯ

### 1. Barrel-файлы для каждой категории
```ts
// components/ui/index.ts
export { Button } from './button'
export { Input } from './input' 
export { Card, CardHeader, CardContent, CardFooter } from './card'
export { Avatar, AvatarImage, AvatarFallback } from './avatar'

// components/shared/index.ts
export { UserAvatar } from './user-avatar'
export { ThemeToggler } from './theme-toggler'
export { SearchBox } from './search-box'

// components/layout/index.ts
export { Header } from './header'
export { Sidebar } from './sidebar'
export { MainLayout } from './main-layout'
```

### 2. Главный barrel-файл компонентов
```ts
// components/index.ts
// Реэкспортируем все компоненты через категории
export * from './ui'
export * from './shared' 
export * from './layout'
```

### 3. Использование в проекте**
```ts
// ✅ КОМПАКТНЫЕ ИМПОРТЫ
import { Button, Input, Card } from '@/components/ui'
import { UserAvatar, ThemeToggler } from '@/components/shared'
import { Header, Sidebar } from '@/components/layout'

// ✅ ИЛИ ЕЩЕ КОРОЧЕ (если часто используете)
import { Button, UserAvatar, Header } from '@/components'
```

## 🎯 РЕКОМЕНДАЦИИ

### Используйте barrel-файлы для:
- **UI компонентов** - часто импортируются вместе
- **Layout компонентов** - обычно импортируются группами  
- **Shared компонентов** - переиспользуются везде

### Избегайте barrel-файлов для:
- **Очень тяжелых компонентов** (чтобы не попадали в бандл)
- **Компонентов с side-effects** 
- **Временных/экспериментальных компонентов**

## 🔧 ОПТИМИЗАЦИИ ДЛЯ TANSTACK START + VITE

### Автоматический code-splitting
```ts
// Vite автоматически разделит бандл по barrel-файлам
// components/ui/index.ts → chunk-ui.js
// components/shared/index.ts → chunk-shared.js
```

### Tree-shaking работает отлично
```ts
// Даже при использовании barrel-файлов
import { Button } from '@/components/ui' 
// В бандл попадет ТОЛЬКО Button, а не все ui-компоненты
```

## 🚀 ПОЛНЫЙ ПРИМЕР

### Компоненты:
```tsx
// components/ui/button.tsx
export const Button = ({ variant, children, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant }))} {...props}>{children}</button>
)

// components/shared/user-avatar.tsx  
export const UserAvatar = ({ user, size = "md" }: UserAvatarProps) => (
  <Avatar>
    <AvatarImage src={user.avatar} />
    <AvatarFallback>{user.name[0]}</AvatarFallback>
  </Avatar>
)

// components/layout/header.tsx
export const Header = () => (
  <header className="border-b">
    <div className="flex h-14 items-center px-4">
      <Logo />
      <Navigation />
      <UserAvatar user={user} />
    </div>
  </header>
)
```

### Использование в роутах:
```ts
// app/routes/_index.tsx
import { Button, Card } from '@/components/ui'
import { MainLayout } from '@/components/layout'

export default function HomePage() {
  return (
    <MainLayout>
      <Card>
        <Button>Добро пожаловать</Button>
      </Card>
    </MainLayout>
  )
}
```

## 💡 ВЫВОД

**Используйте barrel-файлы** - они обеспечивают:
- ✅ Чистые импорты
- ✅ Автокомплит в IDE  
- ✅ Легкий рефакторинг
- ✅ Автоматический code-splitting в Vite
- ✅ Tree-shaking работает прекрасно

Для вашего интранет-проекта это идеальный баланс между удобством и производительностью!
