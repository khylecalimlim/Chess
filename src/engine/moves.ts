import { Board } from './board';
import { Color, Position } from './types';

const KNIGHT_OFFSETS: ReadonlyArray<[number, number]> = [
  [1, 2], [2, 1], [2, -1], [1, -2],
  [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];

function isOnBoard(position: Position): boolean {
  return position.file >= 0 && position.file <= 7 && position.rank >= 0 && position.rank <= 7;
}

export function getKnightMoves(board: Board, position: Position, color: Color): Position[] {
  const moves: Position[] = [];

  for (const [df, dr] of KNIGHT_OFFSETS) {
    const target: Position = { file: position.file + df, rank: position.rank + dr };
    if (!isOnBoard(target)) continue;

    const occupant = board.getPiece(target);
    if (!occupant || occupant.color !== color) {
      moves.push(target);
    }
  }

  return moves;
}
