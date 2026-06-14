import { Bishop } from './bishop';
import { ChessPiece } from './chessPiece';
import { King } from './king';
import { Knight } from './knight';
import { Pawn } from './pawn';
import { Queen } from './queen';
import { Rook } from './rook';
import { Color, Position } from './types';

type PieceConstructor = new (color: Color, position: Position) => ChessPiece;

const BACK_RANK_ORDER: PieceConstructor[] = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

export class Board {
  private grid: (ChessPiece | null)[][];

  constructor() {
    this.grid = Array.from({ length: 8 }, () => Array<ChessPiece | null>(8).fill(null));
    this.setupStartingPosition();
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
}
