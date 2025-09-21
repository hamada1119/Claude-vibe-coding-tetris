import { GameState } from '@/types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/constants/tetris';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard = ({ gameState }: GameBoardProps) => {
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

  return (
    <div className="game-board-container">
      <div className="game-board">
        {renderBoard()}
      </div>
    </div>
  );
};