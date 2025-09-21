import { useState, useCallback } from 'react';
import { Piece, GameState, Direction } from '@/types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT, PIECES } from '@/constants/tetris';

export const useTetrisGame = () => {
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

  const movePiece = useCallback((direction: Direction) => {
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

  return {
    gameState,
    movePiece,
    hardDrop,
    resetGame,
    togglePause
  };
};