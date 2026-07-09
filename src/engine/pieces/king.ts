import type { Board } from '../board';
import { ChessPiece } from './chessPiece';
import { Color, PieceType, Position } from '../types';
import { isOnBoard } from '../utils';

const KING_OFFSETS: ReadonlyArray<[number, number]> = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

export class King extends ChessPiece {
  constructor(color: Color, position: Position) {
    super(PieceType.King, color, position);
  }

  // Castling isn't generated here: unlike every other move, it depends on
  // check state (can't castle out of, through, or into check), which this
  // method deliberately ignores (see ChessPiece.getMoves). It's added on top
  // in moveValidation.ts's getLegalMoves instead.
  getMoves(board: Board): Position[] {
    const moves: Position[] = [];

    for (const [df, dr] of KING_OFFSETS) {
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
