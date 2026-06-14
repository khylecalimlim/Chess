import type { Board } from '../board';
import { Color, PieceType, Position } from '../types';
import { SlidingPiece } from './slidingPiece';

const BISHOP_DIRECTIONS: ReadonlyArray<[number, number]> = [
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

export class Bishop extends SlidingPiece {
  constructor(color: Color, position: Position) {
    super(PieceType.Bishop, color, position);
  }

  getMoves(board: Board): Position[] {
    return this.getSlidingMoves(board, BISHOP_DIRECTIONS);
  }
}
