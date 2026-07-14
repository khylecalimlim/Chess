import { Board } from './board';
import { ChessPiece } from './pieces/chessPiece';
import { GameStatus, getGameStatus, getLegalMoves } from './moveValidation';
import { Color, Position } from './types';
import { oppositeColor } from './utils';

export class Game {
  readonly board: Board;
  turn: Color = Color.White;
  readonly capturedPieces: ChessPiece[] = [];

  constructor(board: Board = new Board()) {
    this.board = board;
  }

  get status(): GameStatus {
    return getGameStatus(this.board, this.turn);
  }

  /**
   * Attempts to move whatever's on `from` to `to`. Returns false and leaves
   * the game untouched if there's no piece there, it isn't the mover's turn,
   * the move isn't legal, or the game has already ended.
   */
  makeMove(from: Position, to: Position): boolean {
    if (this.status !== GameStatus.Ongoing) return false;

    const piece = this.board.getPiece(from);
    if (!piece || piece.color !== this.turn) return false;

    const isLegal = getLegalMoves(this.board, piece).some((move) => move.file === to.file && move.rank === to.rank);
    if (!isLegal) return false;

    const captured = this.board.movePiece(from, to);
    if (captured) this.capturedPieces.push(captured);
    this.turn = oppositeColor(this.turn);

    return true;
  }
}
