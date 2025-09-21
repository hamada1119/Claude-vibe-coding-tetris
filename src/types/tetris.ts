export interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

export interface GameState {
  board: number[][];
  currentPiece: Piece;
  nextPiece: Piece;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
}

export type Direction = 'left' | 'right' | 'down' | 'rotate';