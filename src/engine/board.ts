import { ChessPiece } from './chessPiece';
import { Color, PieceType, Position } from './types';

const BACK_RANK_ORDER: PieceType[] = [
  PieceType.Rook,
  PieceType.Knight,
  PieceType.Bishop,
  PieceType.Queen,
  PieceType.King,
  PieceType.Bishop,
  PieceType.Knight,
  PieceType.Rook,
];

export class Board {
  private grid: (ChessPiece | null)[][];

  constructor() {
    this.grid = Array.from({ length: 8 }, () => Array<ChessPiece | null>(8).fill(null));
    this.setupStartingPosition();
  }

  private setupStartingPosition(): void {
    for (let file = 0; file < 8; file++) {
      this.setPiece({ file, rank: 1 }, new ChessPiece(PieceType.Pawn, Color.White, { file, rank: 1 }));
      this.setPiece({ file, rank: 6 }, new ChessPiece(PieceType.Pawn, Color.Black, { file, rank: 6 }));

      this.setPiece({ file, rank: 0 }, new ChessPiece(BACK_RANK_ORDER[file], Color.White, { file, rank: 0 }));
      this.setPiece({ file, rank: 7 }, new ChessPiece(BACK_RANK_ORDER[file], Color.Black, { file, rank: 7 }));
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
