# Syntopic Studio

Syntopic Studio is the visual AI engineering environment for PCOS (Personal Cognitive Operating System).

## Stack
- React 18
- TypeScript
- Vite
- React Flow / XYFlow
- Zustand
- Tailwind CSS

## Features
- Infinite graph canvas
- Drag-and-drop node library
- Custom node inspector
- Bottom runtime console
- Keyboard shortcuts
- GitHub Pages deployment

## Getting started
```bash
npm ci
npm run dev
```

## Build
```bash
npm run typecheck
npm run build
```

## GitHub Pages deployment
This repository is configured for GitHub Pages under:

`/syntopic-studio/`

The site is deployed via GitHub Actions.

## Repository structure
```text
src/
  app/
    ErrorBoundary.tsx
    editor/
      GraphEditor.tsx
      GraphCanvas.tsx
      LeftExplorer.tsx
      RightInspector.tsx
      TopToolbar.tsx
      BottomConsole.tsx
      editor-store.ts
      node-presets.ts
      graph-utils.ts
      editor-types.ts
      nodes.tsx
      edges.tsx
  shared/
    ui/
      SegmentedTabs.tsx
  styles/
.github/
  workflows/
  ISSUE_TEMPLATE/
```

## Development notes
- The editor uses a feature-oriented module structure.
- The workflow graph is typed and state-managed with Zustand.
- Graph logic, runtime display, and inspector UI are separated into dedicated modules.

## Contributing
Read [CONTRIBUTING.md](./CONTRIBUTING.md).
