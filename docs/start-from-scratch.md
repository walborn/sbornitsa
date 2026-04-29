# Создание нового проекта с нуля

Этот гайд описывает процесс создания нового сервиса используя наш стандартный стек (Bun, TanStack Start, Vite), настраивая всё с чистого листа.

## 1. Инициализация

Мы используем официальный генератор TanStack Start.

```bash
take my-awesome-project
bun create @tanstack/start@latest
```

В интерактивном меню выберите следующие опции:
1.  **Folder**: `.` (текущая папка)
2.  **Tailwind CSS**: `Yes` (обязательно)
3.  **Toolchain**: `Biome` (наш стандарт линтинга/форматирования)
4.  **Deployment**: `Nitro` (стандартный серверный движок)
5.  **Add-ons**: Выберите `Shadcn` и `Query`. (`Drizzle` и `Form` — по необходимости)
6.  **Examples**: `none` (начинаем с чистого листа)

## 2. Очистка и Базовая структура

После установки удалите лишние демо-файлы, если они есть:
```bash
rm -rf src/data
rm -rf src/routes/demo
```

Приведите `src/routes/__root.tsx` и `src/routes/index.tsx` к минимальному виду (удалите лишние пункты меню).

## 3. Настройка окружения (Bun + Nitro)

Чтобы проект работал максимально быстро и правильно использовал рантайм Bun, обновите конфигурацию.

### package.json
Измените скрипты, добавив флаг `--bun`, чтобы Vite запускался внутри Bun:

```json
"scripts": {
  "dev": "bun --bun vite dev",
  "build": "bun --bun vite build",
  "serve": "bun --bun vite preview",
  "test": "vitest run",
  "format": "biome format",
  "lint": "biome lint"
}
```

### vite.config.ts
Настройте Nitro на использование пресета `bun` и добавьте проксирование для API и SSO.

```ts
import { defineConfig, loadEnv } from 'vite'
import { nitro } from 'nitro/vite'
// ... остальные импорты

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND

  return {
    plugins: [
      // ...
      nitro({ preset: 'bun' }), // <-- Важно для деплоя
    ],
    server: {
      proxy: {
        // Проксирование API
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/rpc': {
          target: backendUrl,
          changeOrigin: true,
        },
        // Проксирование SSO (см. раздел Авторизация)
        '/sso': {
          target: backendUrl,
          changeOrigin: true,
          secure: false, // если локально нет https
        },
      },
    },
  }
})
```

## 4. Авторизация (Yandex SSO)

В компании принят стандарт авторизации через **Yandex SSO**.
Фронтенд-приложение **не реализует** OAuth-клиент самостоятельно.

**Схема работы:**
1.  Вы настраиваете прокси `/sso` -> `VITE_BACKEND/sso` в `vite.config.ts` (как показано выше).
2.  Если пользователь не авторизован (API вернул 401), вы перенаправляете браузер на `/sso/login`.
3.  Бэкенд сам редиректит пользователя в Яндекс, получает коллбэк и устанавливает Session Cookie (`httpOnly`).
4.  Фронтенд просто делает запросы к API; куки летят автоматически благодаря прокси.

**Пример обработки 401 (в TanStack Query):**
```ts
// src/integrations/tanstack-query/index.ts
new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isUnauthorizedError(error)) return false; // Не ретраим 401
        return failureCount < 3;
      }
    }
  }
})
```

## 5. Завершение

1.  Создайте `.env` файл:
    ```env
    VITE_BACKEND=http://localhost:8080
    ```
2.  Обновите зависимости (опционально):
    ```bash
    bun outdated
    bun update
    ```
3.  Запустите проект:
    ```bash
    bun dev
    ```

Теперь у вас есть чистое приложение, готовое к разработке по нашим стандартам!
