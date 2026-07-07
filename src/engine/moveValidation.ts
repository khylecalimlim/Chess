import { Board } from './board';
import { ChessPiece } from './pieces/chessPiece';
import { Color, Position } from './types';
import { oppositeColor } from './utils';

/** True if `color`'s king is currently attacked by any enemy piece. */
export function isInCheck(board: Board, color: Color): boolean {
  const king = board.findKing(color);
  const enemyColor = oppositeColor(color);

  return board.getAllPieces(enemyColor).some((piece) =>
    piece.getMoves(board).some((move) => move.file === king.position.file && move.rank === king.position.rank),
  );
}

/**
 * `piece.getMoves()` ignores check — this narrows that down to moves that don't
 * leave the mover's own king in check, by simulating each one on a cloned board.
 */
export function getLegalMoves(board: Board, piece: ChessPiece): Position[] {
  return piece.getMoves(board).filter((move) => {
    const simulation = board.clone();
    simulation.movePiece(piece.position, move);
    return !isInCheck(simulation, piece.color);
  });
}
