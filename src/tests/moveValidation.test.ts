import { describe, expect, it } from 'vitest';
import { Board } from '../engine/board';
import { GameStatus, getGameStatus, getLegalMoves, isInCheck } from '../engine/moveValidation';
import { King } from '../engine/pieces/king';
import { Knight } from '../engine/pieces/knight';
import { Pawn } from '../engine/pieces/pawn';
import { Queen } from '../engine/pieces/queen';
import { Rook } from '../engine/pieces/rook';
import { Color, PieceType } from '../engine/types';

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

describe('getGameStatus', () => {
  it('is ongoing in the starting position', () => {
    const board = new Board();

    expect(getGameStatus(board, Color.White)).toBe(GameStatus.Ongoing);
  });

  it('detects checkmate (back-rank mate, king boxed in by its own pawns)', () => {
    const board = new Board(true);
    board.setPiece({ file: 0, rank: 0 }, new King(Color.White, { file: 0, rank: 0 }));
    board.setPiece({ file: 4, rank: 7 }, new Rook(Color.White, { file: 4, rank: 7 }));
    board.setPiece({ file: 6, rank: 7 }, new King(Color.Black, { file: 6, rank: 7 }));
    board.setPiece({ file: 5, rank: 6 }, new Pawn(Color.Black, { file: 5, rank: 6 }));
    board.setPiece({ file: 6, rank: 6 }, new Pawn(Color.Black, { file: 6, rank: 6 }));
    board.setPiece({ file: 7, rank: 6 }, new Pawn(Color.Black, { file: 7, rank: 6 }));

    expect(getGameStatus(board, Color.Black)).toBe(GameStatus.Checkmate);
  });

  it('detects stalemate (king has no safe square and is not in check)', () => {
    const board = new Board(true);
    board.setPiece({ file: 7, rank: 7 }, new King(Color.White, { file: 7, rank: 7 }));
    board.setPiece({ file: 6, rank: 5 }, new Queen(Color.Black, { file: 6, rank: 5 }));

    expect(isInCheck(board, Color.White)).toBe(false);
    expect(getGameStatus(board, Color.White)).toBe(GameStatus.Stalemate);
  });
});

describe('castling', () => {
  function setupCastlingBoard(): { board: Board; king: King } {
    const board = new Board(true);
    const king = new King(Color.White, { file: 4, rank: 0 });
    board.setPiece(king.position, king);
    board.setPiece({ file: 0, rank: 0 }, new Rook(Color.White, { file: 0, rank: 0 }));
    board.setPiece({ file: 7, rank: 0 }, new Rook(Color.White, { file: 7, rank: 0 }));
    return { board, king };
  }

  it('allows both kingside and queenside castling when nothing has moved and the path is clear', () => {
    const { board, king } = setupCastlingBoard();

    const moves = getLegalMoves(board, king);
    expect(moves).toContainEqual({ file: 6, rank: 0 });
    expect(moves).toContainEqual({ file: 2, rank: 0 });
  });

  it('is blocked when a piece stands between king and rook', () => {
    const { board, king } = setupCastlingBoard();
    board.setPiece({ file: 5, rank: 0 }, new Knight(Color.White, { file: 5, rank: 0 }));

    const moves = getLegalMoves(board, king);
    expect(moves).not.toContainEqual({ file: 6, rank: 0 });
    expect(moves).toContainEqual({ file: 2, rank: 0 });
  });

  it('is blocked once the king has already moved', () => {
    const { board, king } = setupCastlingBoard();
    king.hasMoved = true;

    const moves = getLegalMoves(board, king);
    expect(moves).not.toContainEqual({ file: 6, rank: 0 });
    expect(moves).not.toContainEqual({ file: 2, rank: 0 });
  });

  it('is blocked once the relevant rook has already moved', () => {
    const { board, king } = setupCastlingBoard();
    (board.getPiece({ file: 7, rank: 0 }) as Rook).hasMoved = true;

    const moves = getLegalMoves(board, king);
    expect(moves).not.toContainEqual({ file: 6, rank: 0 });
    expect(moves).toContainEqual({ file: 2, rank: 0 });
  });

  it('is blocked while the king is in check', () => {
    const { board, king } = setupCastlingBoard();
    board.setPiece({ file: 4, rank: 7 }, new Rook(Color.Black, { file: 4, rank: 7 }));

    expect(getLegalMoves(board, king)).not.toContainEqual({ file: 6, rank: 0 });
  });

  it('is blocked when the king would pass through an attacked square', () => {
    const { board, king } = setupCastlingBoard();
    // Black rook attacks f1 (file 5) — a square the king must cross en route to g1.
    board.setPiece({ file: 5, rank: 7 }, new Rook(Color.Black, { file: 5, rank: 7 }));

    const moves = getLegalMoves(board, king);
    expect(moves).not.toContainEqual({ file: 6, rank: 0 });
    expect(moves).toContainEqual({ file: 2, rank: 0 });
  });

  it('moves the rook alongside the king when the castling move is executed', () => {
    const { board, king } = setupCastlingBoard();

    board.movePiece(king.position, { file: 6, rank: 0 });

    expect(board.getPiece({ file: 6, rank: 0 })).toBe(king);
    expect(board.getPiece({ file: 5, rank: 0 })?.type).toBe(PieceType.Rook);
    expect(board.getPiece({ file: 7, rank: 0 })).toBeNull();
  });
});
