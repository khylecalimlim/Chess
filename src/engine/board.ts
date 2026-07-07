import { Bishop } from './pieces/bishop';
import { ChessPiece } from './pieces/chessPiece';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';
import { Color, PieceType, Position } from './types';

type PieceConstructor = new (color: Color, position: Position) => ChessPiece;

const BACK_RANK_ORDER: PieceConstructor[] = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

export class Board {
  private grid: (ChessPiece | null)[][];

  /** Pass `skipSetup` to get an empty board (used by tests and by `clone`). */
  constructor(skipSetup = false) {
    this.grid = Array.from({ length: 8 }, () => Array<ChessPiece | null>(8).fill(null));
    if (!skipSetup) this.setupStartingPosition();
  }

  private setupStartingPosition(): void {
    for (let file = 0; file < 8; file++) {
      this.setPiece({ file, rank: 1 }, new Pawn(Color.White, { file, rank: 1 }));
      this.setPiece({ file, rank: 6 }, new Pawn(Color.Black, { file, rank: 6 }));

      const PieceClass = BACK_RANK_ORDER[file];
      this.setPiece({ file, rank: 0 }, new PieceClass(Color.White, { file, rank: 0 }));
      this.setPiece({ file, rank: 7 }, new PieceClass(Color.Black, { file, rank: 7 }));
    }
  }

  getPiece(position: Position): ChessPiece | null {
    return this.grid[position.rank][position.file];
  }

  setPiece(position: Position, piece: ChessPiece | null): void {
    this.grid[position.rank][position.file] = piece;
    if (piece) piece.position = position;
  }

  movePiece(from: Position, to: Position): void {
    const piece = this.getPiece(from);
    this.setPiece(from, null);
    this.setPiece(to, piece);
  }

  getAllPieces(color?: Color): ChessPiece[] {
    const pieces: ChessPiece[] = [];
    for (const row of this.grid) {
      for (const piece of row) {
        if (piece && (!color || piece.color === color)) pieces.push(piece);
      }
    }
    return pieces;
  }

  findKing(color: Color): King {
    const king = this.getAllPieces(color).find((piece) => piece.type === PieceType.King);
    if (!king) throw new Error(`No ${color} king on the board`);
    return king as King;
  }

  /** Deep copy — cloned pieces are new instances, so mutating the clone never affects the original. */
  clone(): Board {
    const copy = new Board(true);
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = this.grid[rank][file];
        copy.grid[rank][file] = piece ? this.clonePiece(piece) : null;
      }
    }
    return copy;
  }

  private clonePiece(piece: ChessPiece): ChessPiece {
    const Ctor = piece.constructor as PieceConstructor;
    return new Ctor(piece.color, { ...piece.position });
  }
}
