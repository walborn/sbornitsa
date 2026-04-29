# Sbornitsa

[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-8A2BE2?style=for-the-badge&logo=shadcnui&color=131316&logoColor=white)
[![Bun](https://img.shields.io/badge/Bun-1.2-orange?style=flat&logo=bun&logoColor=white)](https://bun.sh/)

Sbornitsa is a Skolkovo-based startup founded by scientists and engineers from the Skolkovo Institute of Science and Technology. The company specializes in producing high-quality laboratory tools and equipment to improve reproducibility and ease of use in scientific research.

## Technologies

This project is built with a modern stack focusing on performance and developer experience:

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
-   **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
-   **Linting & Formatting**: [Biome](https://biomejs.dev/)
-   **Maps**: Yandex Maps API
-   **Carousel**: Embla Carousel

## Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

To create a production build (Static Export):

```bash
bun run build
```

This project is configured for static export (`output: 'export'`), making it suitable for hosting on platforms like GitHub Pages.

## Project Structure

-   `app/[locale]`: Main application routes with internationalization support.
-   `components`: Reusable UI components.
-   `messages`: Localization files (JSON).
-   `public`: Static assets.
-   `i18n`: Internationalization configuration.

## License

[MIT](LICENSE)
