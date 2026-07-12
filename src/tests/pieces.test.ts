import { describe, expect, it } from 'vitest';
import { Board } from '../engine/board';
import { Pawn } from '../engine/pieces/pawn';
import { Rook } from '../engine/pieces/rook';
import { Color } from '../engine/types';

describe('Pawn', () => {
  it('can move one or two squares forward from its starting rank', () => {
    const board = new Board();
    const pawn = board.getPiece({ file: 0, rank: 1 }) as Pawn;

    const moves = pawn.getMoves(board);

    expect(moves).toEqual(
      expect.arrayContaining([{ file: 0, rank: 2 }, { file: 0, rank: 3 }]),
    );
  });

  it('cannot move two squares once off its starting rank', () => {
    const board = new Board();
    board.movePiece({ file: 0, rank: 1 }, { file: 0, rank: 2 });
    const pawn = board.getPiece({ file: 0, rank: 2 }) as Pawn;

    const moves = pawn.getMoves(board);

    expect(moves).toEqual([{ file: 0, rank: 3 }]);
  });

  it('is blocked by a piece directly ahead', () => {
    const board = new Board();
    const pawn = new Pawn(Color.White, { file: 0, rank: 1 });
    board.setPiece({ file: 0, rank: 1 }, pawn);
    board.setPiece({ file: 0, rank: 2 }, new Pawn(Color.Black, { file: 0, rank: 2 }));

    expect(pawn.getMoves(board)).toEqual([]);
  });

  it('can capture diagonally but not move diagonally without a capture', () => {
    const board = new Board();
    const pawn = new Pawn(Color.White, { file: 4, rank: 4 });
    board.setPiece({ file: 4, rank: 4 }, pawn);
    board.setPiece({ file: 5, rank: 5 }, new Pawn(Color.Black, { file: 5, rank: 5 }));

    const moves = pawn.getMoves(board);

    expect(moves).toEqual(
      expect.arrayContaining([{ file: 4, rank: 5 }, { file: 5, rank: 5 }]),
    );
    expect(moves).not.toEqual(expect.arrayContaining([{ file: 3, rank: 5 }]));
  });

  it('can capture en passant right after an enemy pawn double-steps beside it', () => {
    const board = new Board(true);
    const pawn = new Pawn(Color.White, { file: 4, rank: 4 });
    board.setPiece(pawn.position, pawn);
    board.setPiece({ file: 5, rank: 6 }, new Pawn(Color.Black, { file: 5, rank: 6 }));

    board.movePiece({ file: 5, rank: 6 }, { file: 5, rank: 4 });

    expect(pawn.getMoves(board)).toContainEqual({ file: 5, rank: 5 });
  });

  it('cannot capture en passant once a move has passed', () => {
    const board = new Board(true);
    const pawn = new Pawn(Color.White, { file: 4, rank: 4 });
    board.setPiece(pawn.position, pawn);
    board.setPiece({ file: 5, rank: 6 }, new Pawn(Color.Black, { file: 5, rank: 6 }));
    board.setPiece({ file: 0, rank: 6 }, new Pawn(Color.Black, { file: 0, rank: 6 }));

    board.movePiece({ file: 5, rank: 6 }, { file: 5, rank: 4 });
    board.movePiece({ file: 0, rank: 6 }, { file: 0, rank: 5 }); // unrelated move clears the window

    expect(pawn.getMoves(board)).not.toContainEqual({ file: 5, rank: 5 });
  });

  it('removes the captured pawn when an en passant capture is executed', () => {
    const board = new Board(true);
    const pawn = new Pawn(Color.White, { file: 4, rank: 4 });
    board.setPiece(pawn.position, pawn);
    board.setPiece({ file: 5, rank: 6 }, new Pawn(Color.Black, { file: 5, rank: 6 }));
    board.movePiece({ file: 5, rank: 6 }, { file: 5, rank: 4 });

    board.movePiece(pawn.position, { file: 5, rank: 5 });

    expect(board.getPiece({ file: 5, rank: 5 })).toBe(pawn);
    expect(board.getPiece({ file: 5, rank: 4 })).toBeNull();
  });
});

describe('Rook', () => {
  it('slides along open files and ranks until blocked', () => {
    const board = new Board();
    const rook = new Rook(Color.White, { file: 0, rank: 3 });
    board.setPiece({ file: 0, rank: 3 }, rook);

    const moves = rook.getMoves(board);

    expect(moves).toEqual(
      expect.arrayContaining([
        { file: 1, rank: 3 }, { file: 7, rank: 3 },
        { file: 0, rank: 2 }, { file: 0, rank: 4 },
      ]),
    );
  });

  it('can capture an enemy piece but not move past it', () => {
    const board = new Board();
    const rook = new Rook(Color.White, { file: 0, rank: 0 });
    board.setPiece({ file: 0, rank: 0 }, rook);
    board.setPiece({ file: 0, rank: 1 }, null); // clear the starting pawn out of the way
    board.setPiece({ file: 0, rank: 3 }, new Rook(Color.Black, { file: 0, rank: 3 }));

    const moves = rook.getMoves(board);

    expect(moves).toEqual(
      expect.arrayContaining([{ file: 0, rank: 1 }, { file: 0, rank: 2 }, { file: 0, rank: 3 }]),
    );
    expect(moves).not.toEqual(expect.arrayContaining([{ file: 0, rank: 4 }]));
  });
});
