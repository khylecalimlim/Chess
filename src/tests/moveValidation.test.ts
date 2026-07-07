import { describe, expect, it } from 'vitest';
import { Board } from '../engine/board';
import { getLegalMoves, isInCheck } from '../engine/moveValidation';
import { King } from '../engine/pieces/king';
import { Knight } from '../engine/pieces/knight';
import { Rook } from '../engine/pieces/rook';
import { Color } from '../engine/types';

describe('isInCheck', () => {
  it('is false for both colors in the starting position', () => {
    const board = new Board();

    expect(isInCheck(board, Color.White)).toBe(false);
    expect(isInCheck(board, Color.Black)).toBe(false);
  });

  it('is true when an enemy rook attacks the king along an open file', () => {
    const board = new Board(true);
    board.setPiece({ file: 4, rank: 0 }, new King(Color.White, { file: 4, rank: 0 }));
    board.setPiece({ file: 4, rank: 7 }, new Rook(Color.Black, { file: 4, rank: 7 }));

    expect(isInCheck(board, Color.White)).toBe(true);
  });

  it('is false when a piece blocks the attacking line', () => {
    const board = new Board(true);
    board.setPiece({ file: 4, rank: 0 }, new King(Color.White, { file: 4, rank: 0 }));
    board.setPiece({ file: 4, rank: 3 }, new Knight(Color.White, { file: 4, rank: 3 }));
    board.setPiece({ file: 4, rank: 7 }, new Rook(Color.Black, { file: 4, rank: 7 }));

    expect(isInCheck(board, Color.White)).toBe(false);
  });
});

describe('getLegalMoves', () => {
  it('excludes moves that would expose the king to check (a pinned piece)', () => {
    const board = new Board(true);
    const king = new King(Color.White, { file: 4, rank: 0 });
    const knight = new Knight(Color.White, { file: 4, rank: 3 });
    board.setPiece(king.position, king);
    board.setPiece(knight.position, knight);
    board.setPiece({ file: 4, rank: 7 }, new Rook(Color.Black, { file: 4, rank: 7 }));

    // The knight shields the king from the rook, so every knight move (all of
    // which leave file 4) would expose the king — none should be legal.
    expect(getLegalMoves(board, knight)).toEqual([]);
  });

  it('still allows moves that keep the king safe', () => {
    const board = new Board(true);
    const king = new King(Color.White, { file: 0, rank: 0 });
    const knight = new Knight(Color.White, { file: 4, rank: 3 });
    board.setPiece(king.position, king);
    board.setPiece(knight.position, knight);
    board.setPiece({ file: 4, rank: 7 }, new Rook(Color.Black, { file: 4, rank: 7 }));

    // King isn't on the file the rook attacks, so the knight isn't pinned
    // and every pseudo-legal move remains legal.
    expect(getLegalMoves(board, knight).length).toBeGreaterThan(0);
  });
});
