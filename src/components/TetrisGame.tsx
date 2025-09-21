'use client';

import { useState, useEffect, useCallback } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Tetris piece shapes
const PIECES = [
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

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

interface GameState {
  board: number[][];
  currentPiece: Piece;
  nextPiece: Piece;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
}

export default function TetrisGame() {
  const createNewPiece = useCallback((): Piece => {
    const pieceIndex = Math.floor(Math.random() * PIECES.length);
    const template = PIECES[pieceIndex];
    return {
      shape: template.shape,
      color: template.color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(template.shape[0].length / 2),
      y: 0
    };
  }, []);

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialPiece = createNewPiece();
    return {
      board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
      currentPiece: initialPiece,
      nextPiece: createNewPiece(),
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      isPaused: false
    };
  });

  const checkCollision = useCallback((piece: Piece, board: number[][], offsetX = 0, offsetY = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX;
          const newY = piece.y + y + offsetY;

          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const clearLines = useCallback((board: number[][]): { newBoard: number[][]; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    return { newBoard, linesCleared };
  }, []);

  const placePiece = useCallback((piece: Piece, board: number[][]): number[][] => {
    const newBoard = board.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && piece.y + y >= 0) {
          newBoard[piece.y + y][piece.x + x] = 1;
        }
      });
    });
    return newBoard;
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down' | 'rotate') => {
    if (gameState.gameOver || gameState.isPaused) return;

    setGameState(prevState => {
      const { currentPiece, board, nextPiece } = prevState;
      let newPiece = { ...currentPiece };

      switch (direction) {
        case 'left':
          if (!checkCollision(currentPiece, board, -1, 0)) {
            newPiece.x -= 1;
          }
          break;
        case 'right':
          if (!checkCollision(currentPiece, board, 1, 0)) {
            newPiece.x += 1;
          }
          break;
        case 'down':
          if (!checkCollision(currentPiece, board, 0, 1)) {
            newPiece.y += 1;
          } else {
            // Place piece and create new one
            const newBoard = placePiece(currentPiece, board);
            const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

            const newScore = prevState.score + (linesCleared * 100 * prevState.level) + 10;
            const newLines = prevState.lines + linesCleared;
            const newLevel = Math.floor(newLines / 10) + 1;

            const newCurrentPiece = nextPiece;
            const newNextPiece = createNewPiece();

            // Check game over
            if (checkCollision(newCurrentPiece, clearedBoard)) {
              return { ...prevState, gameOver: true };
            }

            return {
              ...prevState,
              board: clearedBoard,
              currentPiece: newCurrentPiece,
              nextPiece: newNextPiece,
              score: newScore,
              lines: newLines,
              level: newLevel
            };
          }
          break;
        case 'rotate':
          const rotated = rotatePiece(currentPiece);
          if (!checkCollision(rotated, board)) {
            newPiece = rotated;
          }
          break;
      }

      return { ...prevState, currentPiece: newPiece };
    });
  }, [gameState.gameOver, gameState.isPaused, checkCollision, rotatePiece, placePiece, clearLines, createNewPiece]);

  const hardDrop = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    while (!checkCollision(gameState.currentPiece, gameState.board, 0, 1)) {
      movePiece('down');
    }
    movePiece('down');
  }, [gameState.gameOver, gameState.isPaused, gameState.currentPiece, gameState.board, checkCollision, movePiece]);

  const resetGame = useCallback(() => {
    const initialPiece = createNewPiece();
    setGameState({
      board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
      currentPiece: initialPiece,
      nextPiece: createNewPiece(),
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      isPaused: false
    });
  }, [createNewPiece]);

  const togglePause = useCallback(() => {
    if (!gameState.gameOver) {
      setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    }
  }, [gameState.gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          movePiece('rotate');
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePause();
          break;
        case 'r':
        case 'R':
          if (gameState.gameOver) {
            e.preventDefault();
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, hardDrop, togglePause, resetGame, gameState.gameOver]);

  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const interval = setInterval(() => {
      movePiece('down');
    }, Math.max(100, 1000 - (gameState.level - 1) * 100));

    return () => clearInterval(interval);
  }, [gameState.level, gameState.gameOver, gameState.isPaused, movePiece]);

  const renderBoard = () => {
    const boardWithPiece = gameState.board.map(row => [...row]);

    // Add current piece to board for rendering
    gameState.currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && gameState.currentPiece.y + y >= 0) {
          const boardY = gameState.currentPiece.y + y;
          const boardX = gameState.currentPiece.x + x;
          if (boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            boardWithPiece[boardY][boardX] = 2; // 2 for active piece
          }
        }
      });
    });

    return boardWithPiece.map((row, rowIndex) => (
      <div key={rowIndex} className="game-row">
        {row.map((cell, colIndex) => {
          let cellClass = 'game-cell';
          if (cell === 1) {
            cellClass += ' cell-placed'; // Placed pieces
          } else if (cell === 2) {
            cellClass += ` ${gameState.currentPiece.color}`; // Active piece
          } else {
            cellClass += ' cell-empty'; // Empty
          }

          return (
            <div key={colIndex} className={cellClass} />
          );
        })}
      </div>
    ));
  };

  const renderNextPiece = () => {
    const { nextPiece } = gameState;
    return (
      <div className="next-piece-panel">
        <div className="next-piece-title">Next:</div>
        {nextPiece.shape.map((row, y) => (
          <div key={y} className="next-piece-row">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`next-piece-cell ${
                  cell ? nextPiece.color : 'next-cell-empty'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="game-container">
      <div className="game-title">Tetris</div>

      <div className="game-layout">
        {/* Game Board */}
        <div className="game-board-container">
          <div className="game-board">
            {renderBoard()}
          </div>

          {/* Controls */}
          <div className="controls">
            <div>Arrow keys: Move/Rotate</div>
            <div>Space: Hard drop</div>
            <div>P: Pause</div>
            {gameState.gameOver && <div>R: Restart</div>}
          </div>

          {/* Game status */}
          {gameState.gameOver && (
            <div className="game-status game-over">
              Game Over!
            </div>
          )}
          {gameState.isPaused && !gameState.gameOver && (
            <div className="game-status game-paused">
              Paused
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="score-panel">
            <div className="score-title">Score: {gameState.score}</div>
            <div className="score-item">Lines: {gameState.lines}</div>
            <div className="score-item">Level: {gameState.level}</div>
          </div>

          {renderNextPiece()}

          <div className="button-group">
            <button
              onClick={togglePause}
              disabled={gameState.gameOver}
              className="game-button button-pause"
            >
              {gameState.isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={resetGame}
              className="game-button button-reset"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}