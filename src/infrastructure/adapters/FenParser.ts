import { Board } from '@/domain/entities/Board';
import { Position } from '@/domain/value-objects/Position';
import { PieceType } from '@/domain/value-objects/PieceType';
import { PieceColor } from '@/domain/value-objects/PieceColor';
import { Piece } from '@/domain/entities/Piece';
import { King } from '@/domain/entities/pieces/King';
import { Queen } from '@/domain/entities/pieces/Queen';
import { Rook } from '@/domain/entities/pieces/Rook';
import { Bishop } from '@/domain/entities/pieces/Bishop';
import { Knight } from '@/domain/entities/pieces/Knight';
import { Pawn } from '@/domain/entities/pieces/Pawn';

/**
 * FEN Parser Adapter
 * 
 * Parses FEN (Forsyth-Edwards Notation) string to Board entity.
 * 
 * FEN Format:
 * "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
 * 
 * Parts:
 * 1. Piece placement (rank 8 to rank 1)
 * 2. Active color (w or b)
 * 3. Castling availability (KQkq or -)
 * 4. En passant target square (e.g., e3 or -)
 * 5. Halfmove clock
 * 6. Fullmove number
 */
export class FENParser {
  /**
   * Parse FEN string to Board
   */
  static parse(fen: string): Board {
    const parts = fen.trim().split(' ');
    
    if (parts.length < 1) {
      throw new Error('Invalid FEN: missing board position');
    }

    const boardPart = parts[0];
    return this.parseBoardPosition(boardPart);
  }

  /**
   * Parse complete FEN with game state
   */
  static parseWithState(fen: string): FENGameState {
    const parts = fen.trim().split(' ');
    
    if (parts.length !== 6) {
      throw new Error(`Invalid FEN: expected 6 parts, got ${parts.length}`);
    }

    const [boardPart, activeColor, castling, enPassant, halfmove, fullmove] = parts;

    return {
      board: this.parseBoardPosition(boardPart),
      activeColor: this.parseActiveColor(activeColor),
      castlingRights: this.parseCastlingRights(castling),
      enPassantSquare: this.parseEnPassantSquare(enPassant),
      halfmoveClock: parseInt(halfmove, 10),
      fullmoveNumber: parseInt(fullmove, 10)
    };
  }

  /**
   * Parse board position from FEN
   */
  private static parseBoardPosition(boardPart: string): Board {
    const board = Board.createEmpty();
    const ranks = boardPart.split('/');

    if (ranks.length !== 8) {
      throw new Error(`Invalid FEN: expected 8 ranks, got ${ranks.length}`);
    }

    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      const rank = ranks[rankIndex];
      const row = 7 - rankIndex;
      
      let col = 0;

      for (const char of rank) {
        if (char >= '1' && char <= '8') {
          col += parseInt(char, 10);
        } else {
          const piece = this.parsePiece(char, new Position(col, row));
          board.placePiece(piece, new Position(col, row));
          col++;
        }
      }

      if (col !== 8) {
        throw new Error(`Invalid FEN: rank ${rankIndex + 1} has ${col} squares instead of 8`);
      }
    }

    return board;
  }

  /**
   * Parse piece from FEN character
   */
  private static parsePiece(char: string, position: Position): Piece {
    const isWhite = char === char.toUpperCase();
    const color = isWhite ? PieceColor.White : PieceColor.Black;
    const type = this.getPieceType(char.toLowerCase());

    switch (type) {
      case PieceType.King:
        return new King(color, position);
      case PieceType.Queen:
        return new Queen(color, position);
      case PieceType.Rook:
        return new Rook(color, position);
      case PieceType.Bishop:
        return new Bishop(color, position);
      case PieceType.Knight:
        return new Knight(color, position);
      case PieceType.Pawn:
        return new Pawn(color, position);
      default:
        throw new Error(`Unknown piece character: ${char}`);
    }
  }

  /**
   * Get piece type from FEN character
   */
  private static getPieceType(char: string): PieceType {
    const typeMap: Record<string, PieceType> = {
      'k': PieceType.King,
      'q': PieceType.Queen,
      'r': PieceType.Rook,
      'b': PieceType.Bishop,
      'n': PieceType.Knight,
      'p': PieceType.Pawn
    };

    const type = typeMap[char];
    if (!type) {
      throw new Error(`Invalid piece character: ${char}`);
    }

    return type;
  }

  /**
   * Parse active color
   */
  private static parseActiveColor(colorPart: string): PieceColor {
    if (colorPart === 'w') return PieceColor.White;
    if (colorPart === 'b') return PieceColor.Black;
    throw new Error(`Invalid active color: ${colorPart}`);
  }

  /**
   * Parse castling rights
   */
  private static parseCastlingRights(castlingPart: string): CastlingRights {
    if (castlingPart === '-') {
      return {
        whiteKingside: false,
        whiteQueenside: false,
        blackKingside: false,
        blackQueenside: false
      };
    }

    return {
      whiteKingside: castlingPart.includes('K'),
      whiteQueenside: castlingPart.includes('Q'),
      blackKingside: castlingPart.includes('k'),
      blackQueenside: castlingPart.includes('q')
    };
  }

  /**
   * Parse en passant square
   */
  private static parseEnPassantSquare(enPassantPart: string): Position | null {
    if (enPassantPart === '-') {
      return null;
    }

    try {
      return Position.fromNotation(enPassantPart);
    } catch {
      throw new Error(`Invalid en passant square: ${enPassantPart}`);
    }
  }

  /**
   * Validate FEN string
   */
  static isValidFEN(fen: string): boolean {
    try {
      this.parseWithState(fen);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * FEN Game State
 */
export interface FENGameState {
  board: Board;
  activeColor: PieceColor;
  castlingRights: CastlingRights;
  enPassantSquare: Position | null;
  halfmoveClock: number;
  fullmoveNumber: number;
}

/**
 * Castling Rights
 */
export interface CastlingRights {
  whiteKingside: boolean;
  whiteQueenside: boolean;
  blackKingside: boolean;
  blackQueenside: boolean;
}