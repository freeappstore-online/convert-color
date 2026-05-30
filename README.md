# Color Converter

A free, instant color format converter — part of [FreeAppStore](https://freeappstore.online).

**Live app:** [convert-to-color.freeappstore.online](https://convert-to-color.freeappstore.online)

## Features

- Accepts any CSS color input: HEX, `rgb()`, `hsl()`, named colors, and more
- Converts to **10 formats** simultaneously:
  - HEX, RGB, HSL, HSV, CMYK, HWB, LCH, LAB, XYZ, CSS Color Name
- Live color preview with animated spinning border
- Click any output card to copy the value to clipboard
- Native color picker synced with the text input
- PWA — installable, works offline
- Dark mode support
- Free, no tracking, MIT licensed

## Development

```bash
pnpm install
pnpm dev
```

## Build & Deploy

```bash
pnpm build          # type-check + Vite production build → web/dist/
git push origin main  # auto-deploys to R2 via GitHub Actions
```

## Checks

```bash
fas check        # compliance audit (brand, manifest, PWA, bundle size, …)
fas screencheck  # visual layout check across 12 reference viewports
```

## Tech

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4
- [`culori`](https://culorijs.org) for color space conversions
- [`@freeappstore/sdk`](https://freeappstore.online) for shell, auth, and storage
- PWA via `vite-plugin-pwa` (Workbox, auto-update service worker)

## License

MIT
