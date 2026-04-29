1. Для пропсов, которые передаются в компонент - всегда используйте `interface` (не `type`)

1. Локальные интерфейсы компонента нужно называть, как Props
Если нужно их экспортировать, то делаем так:

```tsx
// src/components/shared/avatar.tsx
export interface Props { ... }

const Avatar = (props: Props) => {
  // ...
}
```
```tsx
// src/routes/profile.tsx

import { type Props as AvatarProps, Avatar } from '@/components/shared'

//...
```
2. Интерфейсы и типы должны начинаться с большой буквы и без использования I и T для обозначения, что это тип
