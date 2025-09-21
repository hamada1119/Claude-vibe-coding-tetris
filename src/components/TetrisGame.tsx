'use client';

import { useTetrisGame } from '@/hooks/useTetrisGame';
import { useTetrisControls } from '@/hooks/useTetrisControls';
import { useTetrisGameLoop } from '@/hooks/useTetrisGameLoop';
import { GameBoard } from '@/components/GameBoard';
import { NextPiecePreview } from '@/components/NextPiecePreview';
import { ScorePanel } from '@/components/ScorePanel';
import { GameControls } from '@/components/GameControls';

export default function TetrisGame() {
  const { gameState, movePiece, hardDrop, resetGame, togglePause } = useTetrisGame();

  useTetrisControls({
    movePiece,
    hardDrop,
    togglePause,
    resetGame,
    gameOver: gameState.gameOver
  });

  useTetrisGameLoop({
    level: gameState.level,
    gameOver: gameState.gameOver,
    isPaused: gameState.isPaused,
    movePiece
  });

  return (
    <div className="game-container">
      <div className="game-title">Tetris</div>

      <div className="game-layout">
        {/* Game Board */}
        <div className="game-board-container">
          <GameBoard gameState={gameState} />
          <GameControls
            gameState={gameState}
            togglePause={togglePause}
            resetGame={resetGame}
          />
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <ScorePanel gameState={gameState} />
          <NextPiecePreview nextPiece={gameState.nextPiece} />
        </div>
      </div>
    </div>
  );
}