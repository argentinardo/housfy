# Proyecto Svelte 4 con Tailwind CSS y TypeScript

Este es un proyecto base que utiliza:
- Svelte 4
- Tailwind CSS
- TypeScript
- Vite

## Requisitos previos

- Node.js (versión 16 o superior)
- npm o pnpm

## Instalación

Clona este repositorio y luego instala las dependencias:

```bash
cd my-svelte-app
npm install
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Esto iniciará un servidor de desarrollo en `http://localhost:5173/`

## Construcción para producción

Para generar una versión de producción:

```bash
npm run build
```

Esto generará una versión optimizada en el directorio `dist/`

## Verificación de tipos

Para verificar los tipos de TypeScript:

```bash
npm run check
```

## Estructura del proyecto

- `src/` - Código fuente de la aplicación
  - `assets/` - Archivos estáticos como imágenes
  - `lib/` - Componentes reutilizables
  - `App.svelte` - Componente principal
  - `main.ts` - Punto de entrada
  - `app.css` - Estilos globales con Tailwind

## Personalización

Para personalizar la configuración de Tailwind, edita el archivo `tailwind.config.js`.

## IDE Recomendado

- [VS Code](https://code.visualstudio.com/) + [Svelte Extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
