import { Position } from './types';

export function isOnBoard(position: Position): boolean {
  return position.file >= 0 && position.file <= 7 && position.rank >= 0 && position.rank <= 7;
}
