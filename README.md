# Ryan Hirst

A basic React portfolio using Vite, Tailwind CSS, and shadcn/ui (Radix primitives).

## Development

Use Node.js 22.12 or newer (`nvm use` selects Node 22), then:

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host.

## Performance

Audit `http://localhost:4173` after `npm run build` and `npm run preview`.
The development server includes React refresh tooling and unminified dependency
modules, so its JavaScript warnings do not represent the deployed bundle.
Production JavaScript and CSS are minified by Vite automatically.

Both portraits use WebP at 120, 240, and 360 pixels. The browser selects one image
for the active theme and screen density, rendered at 120 CSS pixels. Images stay
outside the JavaScript bundle and load eagerly because the portrait is above the
fold. The four IBM Plex Serif faces use WOFF2 with full glyph coverage and
`font-display: swap`; regular and bold italic are preloaded from the HTML.

Original portraits and TTF fonts remain as conversion sources. After replacing
one of these sources, regenerate the committed optimized assets with:

```sh
npm run optimize:assets
npm run build
```

Asset sizes measured before and after optimization (decimal kB):

| Asset | Before | After |
| --- | ---: | ---: |
| Light portrait | 1,305.34 | 5.35 / 19.45 / 39.01 (1× / 2× / 3×) |
| Dark portrait | 150.02 | 3.89 / 11.45 / 21.03 (1× / 2× / 3×) |
| Four font faces combined | 652.51 | 207.26 |
| JavaScript, minified | 265.04 | 265.36 |
| JavaScript, gzipped | 83.63 | 83.78 |
| CSS, minified | 29.90 | 29.91 |

The JavaScript payload is essentially unchanged: tree shaking already retained
only the three used Lucide icons. Radix imports now target its Slot package;
unused primitives and the unreferenced Shiki components are absent from the
production bundle.

On November 22, 2026, three Lighthouse 12.8.2 mobile runs per build, using the same Vite
preview server configuration and dark theme, produced these median results:

| Metric | Before | After |
| --- | ---: | ---: |
| Performance score | 67 | 94 |
| Largest Contentful Paint | 5.71 s | 2.86 s |
| First Contentful Paint | 4.81 s | 1.95 s |
| Cumulative Layout Shift | 0.009 | 0 |
| Total transferred | 894.96 kB | 310.93 kB |

These are local measurements, not a guarantee of deployed performance. To
compare future changes, use Lighthouse's mobile defaults, audit the production
preview three times, and compare medians under the same theme and conditions.
Browser checks also covered both themes at 1×/2×/3× density, one initial portrait
request, reused font preloads, keyboard navigation, theme persistence, and
unavailable local storage.

Image format, responsive sizing, and minification audits pass. Lighthouse still
flags unused JavaScript (about 38 KiB within the application/React bundle) and
the critical request chain; visible content remains eagerly rendered rather
than adding lazy-loading requests for this small page.

## Structure

- `src/App.jsx`: profile, theme controls, and footer.
- `src/components/PortfolioContent.jsx`: existing portfolio content.
- `src/components/ui/`: locally owned shadcn/ui components.
- `src/styles/index.css`: Tailwind, theme tokens, and custom profile styling.
- `src/data/siteData.js`: name and contact links.
- `src/images/`: local profile images.
- `src/fonts/IBM_Plex_Serif/`: locally served default font and its license.

Dark mode starts from the saved preference or system preference. Both the photo
and the theme button toggle it; the choice persists when storage is available.

Add more shadcn components with `npx shadcn@latest add <component>`.
The `@/` alias points to `src/` in both Vite and the editor.

## Multi-state buttons

`MultiStateButton` wraps the shadcn `Button` with Motion (`motion/react`).
The caller owns the state and any async work:

```jsx
import { MultiStateButton } from '@/components/ui/multi-state-button'

<MultiStateButton
  state={status}
  states={{
    idle: { content: 'Save changes' },
    saving: { content: 'Saving…', busy: true },
    saved: {
      content: 'Saved!',
      className: 'bg-success text-success-foreground hover:bg-success',
    },
    error: { content: 'Try again', variant: 'destructive' },
  }}
  onClick={saveChanges}
/>
```

Each state accepts `content` (text and/or decorative icons), `className`,
`contentClassName`, `style`, `variant`, `size`, `disabled`, and `busy`.
State styles override the shared button props. Missing states fall back to
`children` and the shared styles. `busy` disables the button and sets `aria-busy`.
The component renders a native button and forwards its ref and event handlers;
it does not support `asChild` composition.

Content is measured with `ResizeObserver`, including font and dynamic content
changes. Motion animates its width and height without stretching the text;
keyed content fades and slides between states. Colors, padding, and corner
radius use CSS transitions, supporting both Tailwind classes and inline styles.
Customize the size spring with `transition`, the content fade in seconds with
`contentDuration`, and CSS timing with classes such as `duration-300`.
Reduced-motion preferences disable these transitions. Use an external
`role="status"` message to announce async results, as the email-copy example does.
