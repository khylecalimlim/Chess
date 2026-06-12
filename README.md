# Chess

A chess game with custom piece/board/rules logic, a React UI meant to be embedded on a personal website, local two-player play, and a future AI opponent.

See [ROADMAP.md](./ROADMAP.md) for the full step-by-step plan.

## Stack

- React + TypeScript, built with Vite
- Vitest for unit testing
- ESLint + Prettier for linting/formatting

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run test     # run unit tests
npm run lint     # lint the project
npm run build    # production build
```

## Project Structure

- `src/engine` — board/piece/rules game logic
- `src/ui` — React UI components
- `src/ai` — computer opponent
- `src/tests` — unit tests
