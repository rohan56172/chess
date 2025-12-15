import { PositionDTO } from './PositionDTO';

export interface MoveDTO {
  from: PositionDTO;
  to: PositionDTO;
  piece: string; 
  capturedPiece?: string;
  isCapture: boolean;
  isCastling: boolean;
  isEnPassant: boolean;
  isPromotion: boolean;
  promotionPiece?: string;
  notation: string;
}

export function toMoveDTO(move: {
  from: { col: number; row: number; toNotation: () => string };
  to: { col: number; row: number; toNotation: () => string };
  piece: string;
  capturedPiece?: string;
  isCastling: boolean;
  isEnPassant: boolean;
  isPromotion: boolean;
  promotionPiece?: string;
  isCapture: () => boolean;
  toAlgebraicNotation: () => string;
}): MoveDTO {
  return {
    from: {
      col: move.from.col,
      row: move.from.row,
      notation: move.from.toNotation()
    },
    to: {
      col: move.to.col,
      row: move.to.row,
      notation: move.to.toNotation()
    },
    piece: move.piece,
    capturedPiece: move.capturedPiece,
    isCapture: move.isCapture(),
    isCastling: move.isCastling,
    isEnPassant: move.isEnPassant,
    isPromotion: move.isPromotion,
    promotionPiece: move.promotionPiece,
    notation: move.toAlgebraicNotation()
  };
}

export function isValidMoveDTO(dto: unknown): dto is MoveDTO {
  if (typeof dto !== 'object' || dto === null) {
    return false;
  }
  
  const move = dto as MoveDTO;
  return (
    typeof move.from === 'object' &&
    typeof move.to === 'object' &&
    typeof move.piece === 'string' &&
    typeof move.isCapture === 'boolean' &&
    typeof move.notation === 'string'
  );
}