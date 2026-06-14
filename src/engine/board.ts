import { Bishop } from './pieces/bishop';
import { ChessPiece } from './pieces/chessPiece';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Queen } from './pieces/queen';
import { Color, Position } from './types';

type PieceConstructor = new (color: Color, position: Position) => ChessPiece;

// TODO: back rank should be Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
// once Rook is implemented - the two Rook slots are left empty (null) for now.
const BACK_RANK_ORDER: (PieceConstructor | null)[] = [null, Knight, Bishop, Queen, King, Bishop, Knight, null];

export class Board {
  private grid: (ChessPiece | null)[][];

  constructor() {
    this.grid = Array.from({ length: 8 }, () => Array<ChessPiece | null>(8).fill(null));
    this.setupStartingPosition();
  }

  private setupStartingPosition(): void {
    for (let file = 0; file < 8; file++) {
      // TODO: place Pawns on rank 1 (white) and rank 6 (black) once Pawn is implemented

      const PieceClass = BACK_RANK_ORDER[file];
      if (PieceClass) {
        this.setPiece({ file, rank: 0 }, new PieceClass(Color.White, { file, rank: 0 }));
        this.setPiece({ file, rank: 7 }, new PieceClass(Color.Black, { file, rank: 7 }));
      }
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
