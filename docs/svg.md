# 💡 Добавление импортов svg напрямую
https://www.npmjs.com/package/vite-plugin-svgr

1.  **Установите плагин**: Сперва нужно установить `vite-plugin-svgr` в наш проект.
  ```bash
  bun add -D vite-plugin-svgr
  ```

2.  **Настройка Vite**: Затем добавьте его в `vite.config.ts` после react() плагина.
  ```ts
  // vite.config.ts
  import { defineConfig } from 'vite'
  import svgr from 'vite-plugin-svgr'

  export default defineConfig({
    plugins: [
      // ... other plugins
      svgr(),
    ],
  })
  ```
3. **TypeScript**: Поскольку мы используем TypeScript, мы должны ему рассказать о типах. Добавьте следующий код в `vite-env.d.ts`:
```ts
/// <reference types="vite-plugin-svgr/client" />
```

4.  **Import и использование SVGs**: Теперь можете импортировать SVG  файлы напрямую, как React компоненты.
  ```tsx
  import Logo from './path/to/logo.svg?react'

  function App() {
    return (
      <div>
        <Logo />
      </div>
    )
  }
  ```

5. **Issues**: 
На данный момент не знаю, как сделать, чтоб при Cmd+Click по SVG компоненту у нас перекидывало в соответствующий svg файл
