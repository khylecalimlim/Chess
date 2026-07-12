import type { Board } from '../board';
import { ChessPiece } from './chessPiece';
import { Color, PieceType, Position } from '../types';
import { isOnBoard } from '../utils';

const STARTING_RANK: Record<Color, number> = {
  [Color.White]: 1,
  [Color.Black]: 6,
};

const FORWARD: Record<Color, number> = {
  [Color.White]: 1,
  [Color.Black]: -1,
};

export class Pawn extends ChessPiece {
  constructor(color: Color, position: Position) {
    super(PieceType.Pawn, color, position);
  }

  getMoves(board: Board): Position[] {
    const moves: Position[] = [];
    const dir = FORWARD[this.color];

    const oneStep: Position = { file: this.position.file, rank: this.position.rank + dir };
    if (isOnBoard(oneStep) && !board.getPiece(oneStep)) {
      moves.push(oneStep);

      const twoStep: Position = { file: this.position.file, rank: this.position.rank + dir * 2 };
      if (this.position.rank === STARTING_RANK[this.color] && !board.getPiece(twoStep)) {
        moves.push(twoStep);
      }
    }

    for (const df of [-1, 1]) {
      const target: Position = { file: this.position.file + df, rank: this.position.rank + dir };
      if (!isOnBoard(target)) continue;

      const occupant = board.getPiece(target);
      if (occupant && occupant.color !== this.color) {
        moves.push(target);
      } else if (!occupant && board.enPassantTarget?.file === target.file && board.enPassantTarget?.rank === target.rank) {
        moves.push(target);
      }
    }

    return moves;
  }
}
