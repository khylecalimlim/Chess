import type { Board } from '../board';
import { Color, PieceType, Position } from '../types';

export abstract class ChessPiece {
  constructor(
    public readonly type: PieceType,
    public readonly color: Color,
    public position: Position,
  ) {}

  /** Returns the squares this piece could move to, ignoring check rules. */
  abstract getMoves(board: Board): Position[];

  toString(): string {
    return `${this.color} ${this.type} at (${this.position.file}, ${this.position.rank})`;
  }
}
