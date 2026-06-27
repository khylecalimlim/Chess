import type { Board } from '../board';
import { Color, PieceType, Position } from '../types';
import { SlidingPiece } from './slidingPiece';

const ROOK_DIRECTIONS: ReadonlyArray<[number, number]> = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
];

export class Rook extends SlidingPiece {
  constructor(color: Color, position: Position) {
    super(PieceType.Rook, color, position);
  }

  getMoves(board: Board): Position[] {
    return this.getSlidingMoves(board, ROOK_DIRECTIONS);
  }
}
