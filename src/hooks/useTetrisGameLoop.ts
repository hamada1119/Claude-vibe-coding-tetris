import { useEffect } from 'react';
import { Direction } from '@/types/tetris';

interface UseTetrisGameLoopProps {
  level: number;
  gameOver: boolean;
  isPaused: boolean;
  movePiece: (direction: Direction) => void;
}

export const useTetrisGameLoop = ({
  level,
  gameOver,
  isPaused,
  movePiece
}: UseTetrisGameLoopProps) => {
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      movePiece('down');
    }, Math.max(100, 1000 - (level - 1) * 100));

    return () => clearInterval(interval);
  }, [level, gameOver, isPaused, movePiece]);
};