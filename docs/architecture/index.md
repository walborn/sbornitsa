
```sh
my-awesome-application/
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── _auth/
│   │   │   ├── login.tsx
│   │   │   └── logout.tsx
│   │   ├── profile/
│   │   │   ├── index.tsx
│   │   │   └── edit.tsx
│   │   └── index.tsx
│   ├── components/
│   │   ├── ui/ # shadcn компоненты и наши мелкие, без особенностей конкретно нашего проекта
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layout/ # наши компоненты 
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   └── shared/ # компоненты, которые используются в разных местах
│   │       ├── user-avatar.tsx
│   │       └── search-box.tsx
│   ├── lib/
│   │   ├── db.ts # инициализация Prisma
│   │   ├── auth.ts
│   │   ├── validators.ts # Zod схемы
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── use-user.ts
│   │   └── use-is-mobile.ts
│   ├── styles/
│   │   └── globals.css
│   └── root.tsx
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── favicon.ico
├── .env
├── .env.example
├── biome.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md

```
