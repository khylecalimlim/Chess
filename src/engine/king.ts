import type { Board } from './board';
import { ChessPiece } from './chessPiece';
import { Color, PieceType, Position } from './types';
import { isOnBoard } from './utils';

const KING_OFFSETS: ReadonlyArray<[number, number]> = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

export class King extends ChessPiece {
  constructor(color: Color, position: Position) {
    super(PieceType.King, color, position);
  }

  // TODO: castling
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
