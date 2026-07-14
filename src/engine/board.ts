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

/** The far rank each color's pawns promote on. */
const PROMOTION_RANK: Record<Color, number> = {
  [Color.White]: 7,
  [Color.Black]: 0,
};

export class Board {
  private grid: (ChessPiece | null)[][];

  /** The square a pawn just skipped over via a two-square advance, if any — the
   *  only square an en passant capture can land on this turn. Reset every move. */
  enPassantTarget: Position | null = null;

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

  /**
   * Handles castling, en passant, and promotion as side effects: a king moving
   * two files also relocates its rook, a pawn landing on the current en
   * passant target square also removes the pawn it's capturing (which isn't
   * on the destination square, but beside its origin square), and a pawn
   * reaching the far rank is replaced with a Queen. (Auto-queening for now —
   * choosing the promotion piece is a Step 6 UI concern, not an engine one.)
   * Returns whichever piece this move captured, if any — callers that track
   * captured pieces need this since an en passant capture isn't on `to`.
   */
  movePiece(from: Position, to: Position): ChessPiece | null {
    const piece = this.getPiece(from);
    const isEnPassantCapture =
      piece?.type === PieceType.Pawn &&
      from.file !== to.file &&
      !this.getPiece(to) &&
      this.enPassantTarget?.file === to.file &&
      this.enPassantTarget?.rank === to.rank;
    const captured = isEnPassantCapture ? this.getPiece({ file: to.file, rank: from.rank }) : this.getPiece(to);

    this.setPiece(from, null);
    this.setPiece(to, piece);
    if (!piece) return null;
    piece.hasMoved = true;

    if (isEnPassantCapture) this.setPiece({ file: to.file, rank: from.rank }, null);

    if (piece.type === PieceType.Pawn && to.rank === PROMOTION_RANK[piece.color]) {
      this.setPiece(to, new Queen(piece.color, to));
    }

    if (piece.type === PieceType.King && Math.abs(to.file - from.file) === 2) {
      const direction = to.file > from.file ? 1 : -1;
      const rookFrom: Position = { file: direction === 1 ? 7 : 0, rank: from.rank };
      const rookTo: Position = { file: to.file - direction, rank: from.rank };
      this.movePiece(rookFrom, rookTo);
    }

    this.enPassantTarget =
      piece.type === PieceType.Pawn && Math.abs(to.rank - from.rank) === 2
        ? { file: from.file, rank: (from.rank + to.rank) / 2 }
        : null;

    return captured;
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
    copy.enPassantTarget = this.enPassantTarget ? { ...this.enPassantTarget } : null;
    return copy;
  }

  private clonePiece(piece: ChessPiece): ChessPiece {
    const Ctor = piece.constructor as PieceConstructor;
    const copy = new Ctor(piece.color, { ...piece.position });
    copy.hasMoved = piece.hasMoved;
    return copy;
  }
}
