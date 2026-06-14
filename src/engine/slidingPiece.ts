import type { Board } from './board';
import { ChessPiece } from './chessPiece';
import { Position } from './types';
import { isOnBoard } from './utils';

/** Base class for pieces that move in straight lines until blocked: rook, bishop, queen. */
export abstract class SlidingPiece extends ChessPiece {
  protected getSlidingMoves(board: Board, directions: ReadonlyArray<[number, number]>): Position[] {
    const moves: Position[] = [];

    for (const [df, dr] of directions) {
      let target: Position = { file: this.position.file + df, rank: this.position.rank + dr };

      while (isOnBoard(target)) {
        const occupant = board.getPiece(target);
        if (!occupant) {
          moves.push(target);
        } else {
          if (occupant.color !== this.color) moves.push(target);
          break;
        }
        target = { file: target.file + df, rank: target.rank + dr };
      }
    }

    return moves;
  }
}
