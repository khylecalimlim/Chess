import { useState } from 'react';
import type { DragEvent } from 'react';
import './ChessBoard.css';

type PieceLetter = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
type PieceCode = `w${PieceLetter}` | `b${PieceLetter}`;
type BoardState = (PieceCode | null)[][]; // [rank 0-7][file 0-7], rank 0 = rank 1 (white's back rank)

interface Square {
  rank: number;
  file: number;
}

const PIECE_GLYPHS: Record<PieceCode, string> = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

const BACK_RANK: PieceLetter[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];

function createInitialBoard(): BoardState {
  const board: BoardState = Array.from({ length: 8 }, () => Array(8).fill(null));

  for (let file = 0; file < 8; file++) {
    board[0][file] = `w${BACK_RANK[file]}` as PieceCode;
    board[1][file] = 'wP';
    board[6][file] = 'bP';
    board[7][file] = `b${BACK_RANK[file]}` as PieceCode;
  }

  return board;
}

// Rendered top-to-bottom as rank 8 → rank 1, so white starts at the bottom of the board.
const DISPLAY_RANKS = [7, 6, 5, 4, 3, 2, 1, 0];
const FILES = [0, 1, 2, 3, 4, 5, 6, 7];

export function ChessBoard() {
  const [board, setBoard] = useState<BoardState>(createInitialBoard);
  const [selected, setSelected] = useState<Square | null>(null);

  function movePiece(from: Square, to: Square) {
    if (from.rank === to.rank && from.file === to.file) return;

    setBoard((prev) => {
      const next = prev.map((row) => row.slice());
      next[to.rank][to.file] = next[from.rank][from.file];
      next[from.rank][from.file] = null;
      return next;
    });
  }

  function handleSquareClick(rank: number, file: number) {
    if (selected) {
      movePiece(selected, { rank, file });
      setSelected(null);
      return;
    }

    if (board[rank][file]) {
      setSelected({ rank, file });
    }
  }

  function handleDragStart(e: DragEvent, rank: number, file: number) {
    e.dataTransfer.setData('application/json', JSON.stringify({ rank, file }));
  }

  function handleDrop(e: DragEvent, rank: number, file: number) {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    const from: Square = JSON.parse(data);
    movePiece(from, { rank, file });
    setSelected(null);
  }

  return (
    <div className="chess-board">
      {DISPLAY_RANKS.map((rank) => (
        <div className="board-row" key={rank}>
          {FILES.map((file) => {
            const piece = board[rank][file];
            const isDarkSquare = (rank + file) % 2 === 0;
            const isSelected = selected?.rank === rank && selected?.file === file;

            return (
              <div
                key={file}
                className={[
                  'square',
                  isDarkSquare ? 'dark' : 'light',
                  isSelected ? 'selected' : '',
                ].join(' ').trim()}
                onClick={() => handleSquareClick(rank, file)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, rank, file)}
              >
                {piece && (
                  <span
                    className={`piece ${piece.startsWith('w') ? 'piece-white' : 'piece-black'}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, rank, file)}
                  >
                    {PIECE_GLYPHS[piece]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
