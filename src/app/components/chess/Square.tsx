import { Piece } from './PieceComponent';
import { PieceDTO } from '@/core/dtos/GameState';

interface SquareProps {
  piece: PieceDTO | null;
  position: { col: number; row: number; notation: string };
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isCastlingMove?: boolean;
  isLastMove: boolean;
  pieceSize?: number;
  onClick: () => void;
}

export function Square({
  piece,
  position,
  isLight,
  isSelected,
  isLegalMove,
  isCastlingMove = false,
  isLastMove,
  pieceSize = 75,
  onClick,
}: SquareProps) {
  const squareClasses = [
    'square',
    isLight ? 'square--light' : 'square--dark',
    isSelected && 'square--selected',
    isLastMove && (isLight ? 'square--last-move-light' : 'square--last-move-dark'),
  ].filter(Boolean).join(' ');

  const coordinateFontSize = Math.max(8, Math.round(pieceSize * 0.15));

  return (
    <div 
      className={squareClasses} 
      onClick={onClick}
      style={{
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Piece */}
      {piece && (
        <Piece type={piece.type} color={piece.color} size={pieceSize} />
      )}

      {/* Legal move indicators */}
      {isLegalMove && !piece && <div className="legal-move-indicator" />}
      {isLegalMove && piece && <div className="legal-move-capture" />}

      {/* Castling indicator */}
      {isCastlingMove && !piece && <div className="legal-move-indicator" />}

      {/* Coordinates */}
      {position.row === 0 && (
        <div 
          className={`coordinate coordinate--col ${isLight ? 'coordinate--light' : 'coordinate--dark'}`}
          style={{ fontSize: `${coordinateFontSize}px` }}
        >
          {String.fromCharCode(97 + position.col)}
        </div>
      )}
      {position.col === 0 && (
        <div 
          className={`coordinate coordinate--row ${isLight ? 'coordinate--light' : 'coordinate--dark'}`}
          style={{ fontSize: `${coordinateFontSize}px` }}
        >
          {position.row + 1}
        </div>
      )}
    </div>
  );
}