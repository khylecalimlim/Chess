import { describe, expect, it } from 'vitest';
import { Board } from '../engine/board';
import { Game } from '../engine/game';
import { GameStatus } from '../engine/moveValidation';
import { King } from '../engine/pieces/king';
import { Pawn } from '../engine/pieces/pawn';
import { Rook } from '../engine/pieces/rook';
import { Color, PieceType } from '../engine/types';

describe('Game', () => {
  it('starts with White to move, ongoing status, and no captures', () => {
    const game = new Game();

    expect(game.turn).toBe(Color.White);
    expect(game.status).toBe(GameStatus.Ongoing);
    expect(game.capturedPieces).toEqual([]);
  });

  it('executes a legal move and switches turns', () => {
    const game = new Game();

    const moved = game.makeMove({ file: 4, rank: 1 }, { file: 4, rank: 3 });

    expect(moved).toBe(true);
    expect(game.board.getPiece({ file: 4, rank: 3 })?.type).toBe(PieceType.Pawn);
    expect(game.turn).toBe(Color.Black);
  });

  it('rejects an illegal move and leaves the game untouched', () => {
    const game = new Game();

    const moved = game.makeMove({ file: 4, rank: 1 }, { file: 4, rank: 4 });

    expect(moved).toBe(false);
    expect(game.board.getPiece({ file: 4, rank: 1 })?.type).toBe(PieceType.Pawn);
    expect(game.turn).toBe(Color.White);
  });

  it("rejects moving a piece that isn't the current turn's color", () => {
    const game = new Game();

    const moved = game.makeMove({ file: 4, rank: 6 }, { file: 4, rank: 4 });

    expect(moved).toBe(false);
    expect(game.turn).toBe(Color.White);
  });

  it('records a captured piece on an ordinary capture', () => {
    const board = new Board(true);
    board.setPiece({ file: 0, rank: 0 }, new King(Color.White, { file: 0, rank: 0 }));
    board.setPiece({ file: 7, rank: 7 }, new King(Color.Black, { file: 7, rank: 7 }));
    board.setPiece({ file: 3, rank: 3 }, new Rook(Color.White, { file: 3, rank: 3 }));
    board.setPiece({ file: 3, rank: 6 }, new Rook(Color.Black, { file: 3, rank: 6 }));
    const game = new Game(board);

    game.makeMove({ file: 3, rank: 3 }, { file: 3, rank: 6 });

    expect(game.capturedPieces).toHaveLength(1);
    expect(game.capturedPieces[0].type).toBe(PieceType.Rook);
    expect(game.capturedPieces[0].color).toBe(Color.Black);
  });

  it('records the captured pawn on an en passant capture', () => {
    const board = new Board(true);
    board.setPiece({ file: 0, rank: 0 }, new King(Color.White, { file: 0, rank: 0 }));
    board.setPiece({ file: 7, rank: 7 }, new King(Color.Black, { file: 7, rank: 7 }));
    board.setPiece({ file: 4, rank: 4 }, new Pawn(Color.White, { file: 4, rank: 4 }));
    board.setPiece({ file: 5, rank: 6 }, new Pawn(Color.Black, { file: 5, rank: 6 }));
    board.movePiece({ file: 5, rank: 6 }, { file: 5, rank: 4 }); // sets the en passant target
    const game = new Game(board);

    game.makeMove({ file: 4, rank: 4 }, { file: 5, rank: 5 }); // en passant capture

    expect(game.capturedPieces).toHaveLength(1);
    expect(game.capturedPieces[0].type).toBe(PieceType.Pawn);
    expect(game.capturedPieces[0].color).toBe(Color.Black);
    expect(game.board.getPiece({ file: 5, rank: 4 })).toBeNull();
  });

  it('refuses further moves once the game has ended', () => {
    const board = new Board(true);
    board.setPiece({ file: 0, rank: 0 }, new King(Color.White, { file: 0, rank: 0 }));
    board.setPiece({ file: 4, rank: 7 }, new Rook(Color.White, { file: 4, rank: 7 }));
    board.setPiece({ file: 6, rank: 7 }, new King(Color.Black, { file: 6, rank: 7 }));
    board.setPiece({ file: 5, rank: 6 }, new Pawn(Color.Black, { file: 5, rank: 6 }));
    board.setPiece({ file: 6, rank: 6 }, new Pawn(Color.Black, { file: 6, rank: 6 }));
    board.setPiece({ file: 7, rank: 6 }, new Pawn(Color.Black, { file: 7, rank: 6 }));
    const game = new Game(board);
    game.turn = Color.Black;

    expect(game.status).toBe(GameStatus.Checkmate);
    expect(game.makeMove({ file: 6, rank: 7 }, { file: 7, rank: 7 })).toBe(false);
  });
});
