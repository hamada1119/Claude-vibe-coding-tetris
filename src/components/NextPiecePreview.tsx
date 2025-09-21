import { Piece } from '@/types/tetris';

interface NextPiecePreviewProps {
  nextPiece: Piece;
}

export const NextPiecePreview = ({ nextPiece }: NextPiecePreviewProps) => {
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