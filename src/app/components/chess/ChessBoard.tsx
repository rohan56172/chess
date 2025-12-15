import { Square } from './Square';
import { useGame } from '@/app/context/GameContext';
import { PieceDTO } from '@/core/dtos/GameState';
import { useState, useEffect } from 'react';

export function ChessBoard() {
  const { 
    gameState, 
    selectedSquare, 
    legalMoves, 
    castlingMoves,
    selectSquare 
  } = useGame();
  
  const [pieceSize, setPieceSize] = useState(75);

  useEffect(() => {
    const updatePieceSize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setPieceSize(38);
      } else if (width < 768) {
        setPieceSize(42);
      } else if (width < 1024) {
        setPieceSize(50);
      } else if (width < 1280) {
        setPieceSize(56);
      } else if (width < 1440) {
        setPieceSize(65);
      } else if (width < 1920) {
        setPieceSize(75);
      } else {
        setPieceSize(85);
      }
    };

    updatePieceSize();
    window.addEventListener('resize', updatePieceSize);
    return () => window.removeEventListener('resize', updatePieceSize);
  }, []);

  if (!gameState) return null;

  const isSquareLegalMove = (col: number, row: number): boolean => {
    return legalMoves.some(move => move.col === col && move.row === row);
  };

  const isSquareCastlingMove = (col: number, row: number): boolean => {
    return castlingMoves.some(move => move.col === col && move.row === row);
  };

  const isLastMoveSquare = (col: number, row: number): boolean => {
    if (!gameState.lastMove) return false;
    return (
      (gameState.lastMove.from.col === col && gameState.lastMove.from.row === row) ||
      (gameState.lastMove.to.col === col && gameState.lastMove.to.row === row)
    );
  };

  const isPieceClickable = (piece: PieceDTO | null): boolean => {
    if (!piece) return false;
    return piece.color === gameState.currentTurn;
  };

  const handleSquareClick = (
    notation: string, 
    piece: PieceDTO | null, 
    isLegalMove: boolean
  ) => {
    if (!selectedSquare) {
      if (!piece || !isPieceClickable(piece)) {
        return;
      }
      selectSquare(notation);
      return;
    }

    if (selectedSquare) {
      if (isLegalMove) {
        selectSquare(notation);
        return;
      }

      if (piece && isPieceClickable(piece)) {
        selectSquare(notation);
        return;
      }

      selectSquare(notation);
      return;
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #2d2422 0%, #1a1614 100%)',
      padding: 'var(--board-padding, 16px)',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
      width: '100%',
      maxWidth: 'var(--board-max-size, 850px)',
      aspectRatio: '1 / 1',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        width: '100%',
        height: '100%',
        aspectRatio: '1 / 1',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.2)'
      }}>
        {Array.from({ length: 8 }, (_, rowIndex) => {
          const row = 7 - rowIndex;
          return Array.from({ length: 8 }, (_, col) => {
            const piece = gameState.board[row]?.[col];
            const notation = String.fromCharCode(97 + col) + (row + 1);
            const isLight = (row + col) % 2 !== 0;
            const isSelected = selectedSquare === notation;
            const isLegalMove = isSquareLegalMove(col, row);
            const isCastlingMove = isSquareCastlingMove(col, row);
            const isLastMove = isLastMoveSquare(col, row);

            return (
              <Square
                key={`${col}-${row}`}
                piece={piece}
                position={{ col, row, notation }}
                isLight={isLight}
                isSelected={isSelected}
                isLegalMove={isLegalMove}
                isCastlingMove={isCastlingMove} 
                isLastMove={isLastMove}
                pieceSize={pieceSize}
                onClick={() => handleSquareClick(notation, piece, isLegalMove)}
              />
            );
          });
        })}
      </div>
    </div>
  );
}