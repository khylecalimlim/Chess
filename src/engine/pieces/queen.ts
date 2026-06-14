import type { Board } from '../board';
import { Color, PieceType, Position } from '../types';
import { SlidingPiece } from './slidingPiece';

const QUEEN_DIRECTIONS: ReadonlyArray<[number, number]> = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

export class Queen extends SlidingPiece {
  constructor(color: Color, position: Position) {
    super(PieceType.Queen, color, position);
  }

  getMoves(board: Board): Position[] {
    return this.getSlidingMoves(board, QUEEN_DIRECTIONS);
  }
}
