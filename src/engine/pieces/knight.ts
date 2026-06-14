import type { Board } from '../board';
import { ChessPiece } from './chessPiece';
import { Color, PieceType, Position } from '../types';
import { isOnBoard } from '../utils';

const KNIGHT_OFFSETS: ReadonlyArray<[number, number]> = [
  [1, 2], [2, 1], [2, -1], [1, -2],
  [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];

export class Knight extends ChessPiece {
  constructor(color: Color, position: Position) {
    super(PieceType.Knight, color, position);
  }

  getMoves(board: Board): Position[] {
    const moves: Position[] = [];

    for (const [df, dr] of KNIGHT_OFFSETS) {
      const target: Position = { file: this.position.file + df, rank: this.position.rank + dr };
      if (!isOnBoard(target)) continue;

      const occupant = board.getPiece(target);
      if (!occupant || occupant.color !== this.color) {
        moves.push(target);
      }
    }

    return moves;
  }
}
