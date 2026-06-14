import { Color, PieceType, Position } from './types';

export class ChessPiece {
  constructor(
    public readonly type: PieceType,
    public readonly color: Color,
    public position: Position,
  ) {}

  toString(): string {
    return `${this.color} ${this.type} at (${this.position.file}, ${this.position.rank})`;
  }
}
