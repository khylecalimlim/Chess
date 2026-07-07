import { Color, Position } from './types';

export function isOnBoard(position: Position): boolean {
  return position.file >= 0 && position.file <= 7 && position.rank >= 0 && position.rank <= 7;
}

export function oppositeColor(color: Color): Color {
  return color === Color.White ? Color.Black : Color.White;
}
