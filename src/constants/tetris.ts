export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const PIECES = [
  {
    shape: [
      [1, 1, 1, 1]
    ],
    color: 'cell-cyan'
  }, // I-piece
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'cell-yellow'
  }, // O-piece
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'cell-purple'
  }, // T-piece
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 'cell-green'
  }, // S-piece
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 'cell-red'
  }, // Z-piece
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 'cell-orange'
  }, // J-piece
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 'cell-blue'
  } // L-piece
];