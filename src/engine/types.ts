export enum Color {
  White = 'white',
  Black = 'black',
}

export enum PieceType {
  Pawn = 'pawn',
  Knight = 'knight',
  Bishop = 'bishop',
  Rook = 'rook',
  Queen = 'queen',
  King = 'king',
}

// Position on the board: file 0-7 (a-h), rank 0-7 (1-8)
export interface Position {
  file: number;
  rank: number;
}
