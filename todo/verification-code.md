Чтобы получить verification codes для Google и Yandex, вам нужно зарегистрировать сайт в соответствующих сервисах:

## **Google Search Console**
1. Перейдите на [Google Search Console](https://search.google.com/search-console)
2. Выберите "URL-префикс" и введите URL вашего сайта
3. Выберите метод проверки "HTML-тег"
4. Скопируйте код из тега `<meta>`, который будет выглядеть примерно так:
   ```html
   <meta name="google-site-verification" content="ABCdEfGhiJkLmNoPqRsTuVwXyZ1234567890" />
   ```
5. Скопируйте только значение из `content` (часть после `content="...`)

## **Yandex.Webmaster**
1. Перейдите на [Yandex.Webmaster](https://webmaster.yandex.ru)
2. Добавьте сайт
3. Выберите метод проверки "HTML-код на странице"
4. Скопируйте код из тега `<meta>`, который будет выглядеть примерно так:
   ```html
   <meta name="yandex-verification" content="0123456789abcdef" />
   ```
5. Скопируйте только значение из `content`

## **Обновление кода**

В вашем коде нужно обновить секцию `verification` в `generateMetadata`:

```typescript
verification: {
  google: 'ваш_код_от_google', // замените на реальный код
  yandex: 'ваш_код_от_yandex', // замените на реальный код
},
```

## **Рекомендации**

1. **Лучше использовать переменные окружения** для хранения этих кодов:
```typescript
verification: {
  google: process.env.GOOGLE_VERIFICATION_CODE || '',
  yandex: process.env.YANDEX_VERIFICATION_CODE || '',
},
```

2. Добавьте в `.env.local`:
```env
GOOGLE_VERIFICATION_CODE=ваш_код_от_google
YANDEX_VERIFICATION_CODE=ваш_код_от_yandex
```

3. После добавления кодов, вернитесь в Search Console/Yandex.Webmaster и нажмите "Подтвердить"

## **Альтернативные методы проверки**

Если теги не работают, можно использовать другие методы:
- **Файл проверки** (upload HTML file)
- **DNS запись** (добавить TXT запись в DNS)
- **Аналитика** (через Google Analytics или Yandex.Metrika)

После успешной проверки сайт появится в панелях веб-мастеров, где вы сможете отслеживать индексацию, ошибки и производительность сайта.