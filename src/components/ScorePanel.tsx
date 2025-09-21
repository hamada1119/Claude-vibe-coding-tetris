import { GameState } from '@/types/tetris';

interface ScorePanelProps {
  gameState: GameState;
}

export const ScorePanel = ({ gameState }: ScorePanelProps) => {
  return (
    <div className="score-panel">
      <div className="score-title">Score: {gameState.score}</div>
      <div className="score-item">Lines: {gameState.lines}</div>
      <div className="score-item">Level: {gameState.level}</div>
    </div>
  );
};