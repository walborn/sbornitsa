Вот план рефакторинга на основе анализа кодовой базы:
---
Приоритет 1: Немедленные исправления (безопасно, высокая отдача)
#	Проблема
1	lib/data/transactions.ts (3151 строка) — содержит типы, хелперы, билдеры, сырые данные и логику трансформации в одном файле. На уровне модуля выполняются побочные эффекты (цикл for заполняет familyTransactions)
2	Мёртвый код: lib/types/branded.ts (94 строки) — полностью не используется; типы выводятся из Zod
3	Мёртвый код: lib/api/users.ts:23-46 — закомментированный SQL-запрос
4	Мёртвый код: lib/api/users.ts:12 — getUserById (синхронная версия) никогда не используется
5	async над синхронными данными — все fetch* в lib/api/ помечены async, но ничего асинхронного не делают
6	fetchFamilies() экспортируется из lib/api/users.ts вместо lib/api/families.ts
7	removeHtmlTags(str: string) использует str?.replace при типе string (никогда не undefined)
8	Barrel: lib/api/index.ts не экспортирует fetchFamilyTransactions
---
Приоритет 2: Улучшение сопровождаемости
#	Проблема
9	Дублирование конструкторов репозиториев — 4 репозитория с одинаковым Map-building boilerplate
10	Несогласованное именование методов — findIncomes (transactions) vs findWithPositiveBalance (families); allEvents vs Array.from(map.values())
11	Конфликт имён: два Balance — components/shared/balance.tsx (общий) и app/.../families/balance.tsx (специфичный для семьи)
12	Конфликт имён: два AppHeader — components/layout/app-header.tsx (рендерит) и components/utils/app-header.tsx (устанавливает контекст, рендерит null)
13	Экспорты: Named vs Default — по проекту нет единого стиля
14	auth.store.ts и filter.store.ts — дублирование hydrated/setHydrated
15	Двойное вычисление isLoginPage в auth-provider.tsx (строка 30 и строка 45)
---
Приоритет 3: Архитектурные улучшения
#	Проблема
16	Нет тестов — ни одного тестового файла, конфигурации, скрипта
17	Auth целиком на клиенте — нет middleware, нет серверной проверки. auth-provider.tsx делает всю (authenticated) группу клиентским компонентом
18	lib/schemas/constants.ts — значения с пробелами ('workshops, art') как enum; хардкод российского regex для телефона
19	as any в lib/utils.ts:19 — обход типизации в базовой утилите
20	Нет Error Boundaries — ошибки валятся в консоль (console.warn/console.error) без UI-обработки
---
Рекомендуемый порядок выполнения
Фаза 1 (чистка):
  Удалить мёртвый код (#2, #3, #4)
  Убрать async (#5)
  Исправить типы (#7)
  Починить баррели (#8, #6)
Фаза 2 (большой файл):
  Разделить transactions.ts (#1)
  Заменить модульные побочные эффекты на ленивую инициализацию
Фаза 3 (согласованность):
  Базовый класс репозитория (#9)
  Единый стиль именования (#10)
  Разрешить конфликты имён (#11, #12)
  Единый стиль экспортов (#13)
  Убрать дублирование hydrate (#14, #15)
Фаза 4 (инфраструктура):
  Настроить Vitest (#16)
  Написать тесты для схем и репозиториев (#16)
  Error Boundaries (#20)
Фаза 5 (архитектура):
  Auth Middleware + серверная проверка (#17)
