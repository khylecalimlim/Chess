# Chess Project Roadmap

A step-by-step plan for building a chess game with pieces/board/rules logic, a web UI embeddable on a personal website, local two-player play, and a future AI opponent.

## Suggested Stack

- **Core game logic**: TypeScript (runs in browser and Node, easy to unit test, strong typing for piece/move models)
- **UI**: React + TypeScript, with plain CSS or Tailwind for styling
- **Build tool**: Vite (fast dev server, easy to embed output as a widget on another site)
- **Testing**: Vitest or Jest
- **AI engine (later)**: Start with a custom minimax/alpha-beta engine in TypeScript; optionally integrate Stockfish (compiled to WASM) for a stronger bot
- **Deployment**: Static build hosted alongside/embedded in personal website (e.g., as an iframe or a mounted React component)

---

## Step 1: Project Setup
- [ ] Initialize a TypeScript project with Vite (`npm create vite@latest` using the `react-ts` template)
- [ ] Set up linting/formatting (ESLint + Prettier)
- [ ] Set up testing framework (Vitest)
- [ ] Set up basic folder structure: `src/engine`, `src/ui`, `src/ai`, `src/tests`

## Step 2: Core Data Model
- [ ] Define `Color` enum (White/Black)
- [ ] Define `PieceType` enum (Pawn, Knight, Bishop, Rook, Queen, King)
- [ ] Create a `Piece` class/interface with type, color, and position
- [ ] Create a `Board` class representing an 8x8 grid (array-based or bitboard)
- [ ] Create a `Square`/`Position` type (file/rank or coordinates)

## Step 3: Piece Movement Rules
- [ ] Implement legal move generation per piece type:
  - [x] Pawn (including double move, captures, en passant)
  - [ ] Knight
  - [ ] Bishop
  - [ ] Rook
  - [ ] Queen
  - [x] King (including castling)
- [x] Implement check detection (is the king under attack?)
- [x] Filter moves that would leave own king in check
- [x] Implement special rules: castling, en passant, pawn promotion
- [ ] Implement game-end conditions: checkmate, stalemate, draw (50-move rule, threefold repetition, insufficient material)

## Step 4: Game State Management
- [ ] Create a `Game`/`GameState` class to track:
  - [ ] Board state
  - [ ] Whose turn it is
  - [ ] Move history (for undo, repetition checks, PGN export)
  - [ ] Captured pieces
- [ ] Implement move execution (apply a move, update state, switch turns)
- [ ] Implement move history/undo functionality
- [ ] Write unit tests for move generation and edge cases (castling, en passant, promotion, check/checkmate scenarios)

## Step 5: UI - Board & Pieces
- [ ] Build a React component for the chessboard grid (8x8)
- [ ] Render piece images/icons (SVG chess sets are widely available and free to use)
- [ ] Highlight selected piece and its legal moves on click
- [ ] Implement drag-and-drop or click-to-move piece movement
- [ ] Display captured pieces and move history in a sidebar
- [ ] Add basic styling (board colors, coordinates, responsive layout)

## Step 6: Local Two-Player Mode
- [ ] Implement a "local play" mode where two users share one screen/device
- [ ] Add turn indicator UI
- [ ] Handle pawn promotion choice (UI prompt to pick Queen/Rook/Bishop/Knight)
- [ ] Show check/checkmate/stalemate/draw messages
- [ ] Add "New Game" / "Resign" / "Undo" controls

## Step 7: Embeddable Widget for Personal Website
- [ ] Configure Vite build to output a standalone bundle (library mode or static site)
- [ ] Decide embed method: iframe vs. mounting a web component/React component directly
- [ ] Add responsive sizing so it fits within the website's layout
- [ ] Deploy build artifacts (e.g., GitHub Pages, Vercel, Netlify) and link/embed from personal site

## Step 8: AI Opponent (v1 - Custom Engine)
- [ ] Implement a basic evaluation function (material count, piece-square tables)
- [ ] Implement minimax algorithm with alpha-beta pruning
- [ ] Add configurable search depth (difficulty levels)
- [ ] Add "Play vs Computer" mode with color selection (play as White/Black)
- [ ] Add a thinking indicator/animation while AI computes its move

## Step 9: AI Opponent (v2 - Stronger Engine, Optional)
- [ ] Integrate Stockfish via WASM (`stockfish.js`) for stronger play
- [ ] Add difficulty settings mapped to Stockfish skill levels/depth
- [ ] Compare/benchmark custom engine vs. Stockfish-backed mode

## Step 10: Polish & Extras
- [ ] Add move sound effects and animations
- [ ] Add PGN export/import for saved games
- [ ] Add timer/clock support for timed games
- [ ] Add light/dark themes and alternate board/piece styles
- [ ] Add basic accessibility support (keyboard navigation, ARIA labels)
- [ ] Write a README with setup instructions, architecture overview, and embed instructions
