import { GameState } from '@/types/tetris';

interface GameControlsProps {
  gameState: GameState;
  togglePause: () => void;
  resetGame: () => void;
}

export const GameControls = ({ gameState, togglePause, resetGame }: GameControlsProps) => {
  return (
    <>
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

      {/* Control buttons */}
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
    </>
  );
};