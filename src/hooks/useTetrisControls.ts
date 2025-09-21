import { useEffect } from 'react';
import { Direction } from '@/types/tetris';

interface UseTetrisControlsProps {
  movePiece: (direction: Direction) => void;
  hardDrop: () => void;
  togglePause: () => void;
  resetGame: () => void;
  gameOver: boolean;
}

export const useTetrisControls = ({
  movePiece,
  hardDrop,
  togglePause,
  resetGame,
  gameOver
}: UseTetrisControlsProps) => {
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
          if (gameOver) {
            e.preventDefault();
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, hardDrop, togglePause, resetGame, gameOver]);
};