import { Position } from './Position';
import { PieceType } from './PieceType';
import { PieceColor } from './PieceColor';

/**
 * Move Value Object
 * 
 * Represents a chess move with all necessary information
 */
export class Move {
  readonly from: Position;
  readonly to: Position;
  readonly piece: PieceType;
  readonly capturedPiece?: PieceType;
  readonly capturedPieceColor?: PieceColor;
  readonly isCastling: boolean;
  readonly isEnPassant: boolean;
  readonly isPromotion: boolean;
  readonly promotionPiece?: PieceType;
  readonly castlingSide?: 'kingside' | 'queenside';
  readonly rookMove?: { from: Position; to: Position };

  private constructor(
    from: Position,
    to: Position,
    piece: PieceType,
    capturedPiece?: PieceType,
    capturedPieceColor?: PieceColor,
    isCastling: boolean = false,
    isEnPassant: boolean = false,
    isPromotion: boolean = false,
    promotionPiece?: PieceType,
    castlingSide?: 'kingside' | 'queenside',
    rookMove?: { from: Position; to: Position }
  ) {
    this.from = from;
    this.to = to;
    this.piece = piece;
    this.capturedPiece = capturedPiece;
    this.capturedPieceColor = capturedPieceColor;
    this.isCastling = isCastling;
    this.isEnPassant = isEnPassant;
    this.isPromotion = isPromotion;
    this.promotionPiece = promotionPiece;
    this.castlingSide = castlingSide;
    this.rookMove = rookMove;
  }

  /**
   * Create a standard move
   */
  static standard(from: Position, to: Position, piece: PieceType): Move {
    return new Move(from, to, piece);
  }

  /**
   * Create a capture move
   */
  static capture(
    from: Position,
    to: Position,
    piece: PieceType,
    capturedPiece: PieceType,
    capturedPieceColor: PieceColor
  ): Move {
    return new Move(from, to, piece, capturedPiece, capturedPieceColor);
  }

  /**
   * NEW: Create a castling move
   */
  static castling(
    kingFrom: Position,
    kingTo: Position,
    rookFrom: Position,
    rookTo: Position,
    side: 'kingside' | 'queenside'
  ): Move {
    return new Move(
      kingFrom,
      kingTo,
      PieceType.King,
      undefined,
      undefined,
      true,
      false,
      false,
      undefined,
      side,
      { from: rookFrom, to: rookTo }
    );
  }

  /**
   * Create an en passant move
   */
  static enPassant(
    from: Position,
    to: Position,
    capturedPieceColor: PieceColor
  ): Move {
    return new Move(
      from,
      to,
      PieceType.Pawn,
      PieceType.Pawn,
      capturedPieceColor,
      false,
      true
    );
  }

  /**
   *  NEW: Create a promotion move
   */
  static promotion(
    from: Position,
    to: Position,
    promotionPiece: PieceType,
    capturedPiece?: PieceType,
    capturedPieceColor?: PieceColor
  ): Move {
    return new Move(
      from,
      to,
      PieceType.Pawn,
      capturedPiece,
      capturedPieceColor,
      false,
      false,
      true,
      promotionPiece
    );
  }

  isCapture(): boolean {
    return this.capturedPiece !== undefined;
  }

  /**
   * Convert move to algebraic notation (e.g., "Nf3", "e4", "O-O")
   */
  toAlgebraicNotation(): string {
    //  Castling notation
    if (this.isCastling) {
      return this.castlingSide === 'kingside' ? 'O-O' : 'O-O-O';
    }

    let notation = '';

    //  Piece notation 
    if (this.piece !== PieceType.Pawn) {
      notation += this.piece.toUpperCase();
    }

    //  Starting square 
    if (this.piece === PieceType.Pawn && this.isCapture()) {
      notation += this.from.toNotation()[0]; 
    }

    //  Capture notation
    if (this.isCapture()) {
      notation += 'x';
    }

    //  Destination square
    notation += this.to.toNotation();

    //  Promotion notation
    if (this.isPromotion && this.promotionPiece) {
      notation += '=' + this.promotionPiece.toUpperCase();
    }

    //  En passant notation
    if (this.isEnPassant) {
      notation += ' e.p.';
    }

    return notation;
  }

  clone(): Move {
    return new Move(
      this.from.clone(),
      this.to.clone(),
      this.piece,
      this.capturedPiece,
      this.capturedPieceColor,
      this.isCastling,
      this.isEnPassant,
      this.isPromotion,
      this.promotionPiece,
      this.castlingSide,
      this.rookMove ? {
        from: this.rookMove.from.clone(),
        to: this.rookMove.to.clone()
      } : undefined
    );
  }

  equals(other: Move): boolean {
    return (
      this.from.equals(other.from) &&
      this.to.equals(other.to) &&
      this.piece === other.piece &&
      this.capturedPiece === other.capturedPiece &&
      this.isCastling === other.isCastling &&
      this.isEnPassant === other.isEnPassant &&
      this.isPromotion === other.isPromotion &&
      this.promotionPiece === other.promotionPiece
    );
  }

  toString(): string {
    return this.toAlgebraicNotation();
  }
}
