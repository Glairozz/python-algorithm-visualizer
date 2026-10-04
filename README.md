# Algorithm Visualizer

An interactive, educational algorithm visualization tool. Step through sorting and searching algorithms with synchronized pseudocode, per-step explanations, and live complexity information — in a strict monochrome, developer-tool aesthetic.

**Live site:** https://glairozz.github.io/python-algorithm-visualizer/

## Features

- **Sorting:** Bubble, Selection, Insertion, Merge, Quick, Heap
- **Searching:** Linear, Binary
- Step-by-step playback: play / pause / next / previous / reset / seek via progress bar
- Speed control: 0.25×, 0.5×, 1×, 2×, 4×
- Synchronized pseudocode with the current line highlighted
- Plain-language explanations for every operation ("why", not just "what")
- Pointer annotations (`i`, `j`, `pivot`, `low`, `mid`, `high`) on the bars
- Grayscale state language: white = idle, hatched = comparing, solid black = swap/found, gray = sorted, dashed = eliminated
- Keyboard shortcuts: `Space` play/pause · `←`/`→` step · `R` reset · `G` new array
- Accessible: keyboard navigation, ARIA labels, visible focus states, `prefers-reduced-motion` support, no color-only meaning
- Fully responsive from mobile to desktop

## Tech stack

- **React 19 + TypeScript (strict) + Vite**
- Plain CSS design system (no UI framework)
- **Vitest** for engine and UI smoke tests
- UI-independent algorithm engine in `app/src/engine` and `app/src/algorithms`

## Development

```bash
cd app
npm install
npm run dev        # local dev server
npm test           # test suite (Vitest)
npm run build      # typecheck + production build to app/dist
npm run preview    # preview the production build
```

## Landing page & routing

`/` (and `/python-algorithm-visualizer/`) renders the landing page. `/visualizer`
renders the existing visualizer (deep-link an algorithm with
`/visualizer?algo=quick-sort`). The visualizer is lazy-loaded so the landing
page never spins up app logic. GitHub Pages deep links work via a `404.html`
fallback that restores the requested URL.

## Deployment

GitHub Pages is served at https://glairozz.github.io/python-algorithm-visualizer/.

Two equivalent paths:

1. **GitHub Actions** (recommended): `.github/workflows/deploy.yml` installs, tests, builds, and deploys `app/dist` on every push. Set the repo's Pages source to **GitHub Actions**.
2. **Branch deploy (legacy-compatible):** the production build is committed at the repo root (`index.html` + `assets/`), so the existing *Deploy from branch* Pages setting serves the same app. After changing the app, refresh it with:

```bash
cd app && npm run build && cp -r dist/* ..
```

## Project structure

```
app/
├── index.html              # Vite entry
├── vite.config.ts          # base: /python-algorithm-visualizer/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── algorithms/         # algorithm definitions + recorded steps
    │   ├── index.ts        # registry
    │   ├── recorder.ts     # step recording helper
    │   ├── sorting/
    │   └── searching/
    ├── engine/
    │   ├── types.ts        # Step / Frame / AlgorithmDefinition
    │   └── playback.ts     # pure playback state machine
    ├── hooks/
    │   ├── useVisualizer.ts
    │   └── useKeyboardShortcuts.ts
    ├── components/
    │   ├── layout/         # Header, Sidebar, StatusBar
    │   ├── controls/       # ControlBar
    │   ├── visualization/  # VisualizationCanvas, ArrayVisualizer
    │   ├── algorithm/      # info, step explanation, pseudocode, complexity
    │   └── common/
    └── styles/globals.css  # monochrome design system
legacy/                     # original Python/Flask implementation (archived)
```

## Adding an algorithm

1. Create `app/src/algorithms/<category>/myAlgorithm.ts` exporting an `AlgorithmDefinition`.
2. Implement `generate(input, target?)` using `Recorder` to emit `Step`s with frame snapshots, pointers, `codeLine`, and a plain-English explanation.
3. Register it in `app/src/algorithms/index.ts`.

The visualization, controls, pseudocode panel, and progress UI pick it up automatically.

## Testing

```bash
cd app && npm test
```

Covers algorithm correctness across edge cases (empty, single element, sorted, reverse-sorted, duplicates, negatives, larger inputs), step-generation invariants, the playback state machine, and a jsdom smoke test that mounts the full app and steps through it.

## Legacy

The original Python 3 / Flask implementation is archived under `legacy/` and no longer drives the deployed site.
