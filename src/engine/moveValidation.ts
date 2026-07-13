import { Board } from './board';
import { ChessPiece } from './pieces/chessPiece';
import { King } from './pieces/king';
import { Color, PieceType, Position } from './types';
import { oppositeColor } from './utils';

export enum GameStatus {
  Ongoing = 'ongoing',
  Checkmate = 'checkmate',
  Stalemate = 'stalemate',
  Draw = 'draw',
}

/** True if `square` is currently attacked by any of `attackedColor`'s enemies. */
function isSquareAttacked(board: Board, square: Position, attackedColor: Color): boolean {
  const enemyColor = oppositeColor(attackedColor);

  return board.getAllPieces(enemyColor).some((piece) =>
    piece.getMoves(board).some((move) => move.file === square.file && move.rank === square.rank),
  );
}

/** True if `color`'s king is currently attacked by any enemy piece. */
export function isInCheck(board: Board, color: Color): boolean {
  return isSquareAttacked(board, board.findKing(color).position, color);
}

const CASTLE_SIDES: ReadonlyArray<{ rookFile: number; direction: 1 | -1 }> = [
  { rookFile: 7, direction: 1 }, // kingside
  { rookFile: 0, direction: -1 }, // queenside
];

/**
 * Castling moves for `king`: neither king nor rook has moved, the squares
 * between them are empty, and the king isn't currently in, doesn't pass
 * through, and doesn't land in check. All of that is check-dependent, which
 * is why it lives here instead of in King.getMoves (see that method's note).
 */
function getCastlingMoves(board: Board, king: King): Position[] {
  if (king.hasMoved || isInCheck(board, king.color)) return [];

  const { file, rank } = king.position;
  const moves: Position[] = [];

  for (const { rookFile, direction } of CASTLE_SIDES) {
    const rook = board.getPiece({ file: rookFile, rank });
    if (!rook || rook.type !== PieceType.Rook || rook.color !== king.color || rook.hasMoved) continue;

    const between: number[] = [];
    for (let f = Math.min(file, rookFile) + 1; f < Math.max(file, rookFile); f++) between.push(f);
    if (!between.every((f) => !board.getPiece({ file: f, rank }))) continue;

    const kingPath = [file + direction, file + 2 * direction];
    if (!kingPath.every((f) => !isSquareAttacked(board, { file: f, rank }, king.color))) continue;

    moves.push({ file: file + 2 * direction, rank });
  }

  return moves;
}

/**
 * `piece.getMoves()` ignores check — this narrows that down to moves that don't
 * leave the mover's own king in check, by simulating each one on a cloned board.
 */
export function getLegalMoves(board: Board, piece: ChessPiece): Position[] {
  const candidates = piece.getMoves(board);
  if (piece.type === PieceType.King) candidates.push(...getCastlingMoves(board, piece as King));

  return candidates.filter((move) => {
    const simulation = board.clone();
    simulation.movePiece(piece.position, move);
    return !isInCheck(simulation, piece.color);
  });
}

function squareColor(position: Position): 'light' | 'dark' {
  return (position.file + position.rank) % 2 === 0 ? 'dark' : 'light';
}

/**
 * True if neither side has enough material left to ever force checkmate:
 * bare kings, king + one minor piece vs. bare king, or king + bishop vs.
 * king + bishop where both bishops sit on the same-colored squares (so they
 * can never contest each other). Any pawn, rook, or queen on the board — or
 * two knights, which retain a helpmate-only chance — means this is false.
 */
export function isInsufficientMaterial(board: Board): boolean {
  const nonKings = board.getAllPieces().filter((piece) => piece.type !== PieceType.King);

  if (nonKings.length === 0) return true;
  if (nonKings.length === 1) {
    return nonKings[0].type === PieceType.Bishop || nonKings[0].type === PieceType.Knight;
  }
  if (nonKings.length === 2 && nonKings.every((piece) => piece.type === PieceType.Bishop)) {
    const [first, second] = nonKings;
    return first.color !== second.color && squareColor(first.position) === squareColor(second.position);
  }

  return false;
}

/** Checkmate/stalemate for the side to move: no legal moves, with or without check. */
export function getGameStatus(board: Board, color: Color): GameStatus {
  if (isInsufficientMaterial(board)) return GameStatus.Draw;

  const hasLegalMove = board.getAllPieces(color).some((piece) => getLegalMoves(board, piece).length > 0);
  if (hasLegalMove) return GameStatus.Ongoing;

  return isInCheck(board, color) ? GameStatus.Checkmate : GameStatus.Stalemate;
}
