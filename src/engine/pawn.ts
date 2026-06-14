import type { Board } from './board';
import { ChessPiece } from './chessPiece';
import { Color, PieceType, Position } from './types';
import { isOnBoard } from './utils';

export class Pawn extends ChessPiece {
  constructor(color: Color, position: Position) {
    super(PieceType.Pawn, color, position);
  }

  // TODO: en passant, promotion
  getMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const direction = this.color === Color.White ? 1 : -1;
    const startingRank = this.color === Color.White ? 1 : 6;

    const oneStep: Position = { file: this.position.file, rank: this.position.rank + direction };
    if (isOnBoard(oneStep) && !board.getPiece(oneStep)) {
      moves.push(oneStep);

      const twoStep: Position = { file: this.position.file, rank: this.position.rank + direction * 2 };
      if (this.position.rank === startingRank && !board.getPiece(twoStep)) {
        moves.push(twoStep);
      }
    }

    for (const df of [-1, 1]) {
      const target: Position = { file: this.position.file + df, rank: this.position.rank + direction };
      if (!isOnBoard(target)) continue;

      const occupant = board.getPiece(target);
      if (occupant && occupant.color !== this.color) {
        moves.push(target);
      }
    }

    return moves;
  }
}
