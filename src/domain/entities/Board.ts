import { Piece } from './Piece';
import { Position } from '../value-objects/Position';
import { PieceColor } from '../value-objects/PieceColor';
import { PieceType } from '../value-objects/PieceType';
import { King } from './pieces/King';
import { Queen } from './pieces/Queen';
import { Rook } from './pieces/Rook';
import { Bishop } from './pieces/Bishop';
import { Knight } from './pieces/Knight';
import { Pawn } from './pieces/Pawn';
import { BOARD_SIZE, INITIAL_BOARD_SETUP, INITIAL_KING_POSITIONS } from '@/shared/constants/board.constants';

/**
 * Board Entity
 * 
 * Represents the chess board and manages:
 * - Piece positions
 * - Board state
 * - King tracking
 * - Board operations (move, place, remove)
 */
export class Board {
  private grid: (Piece | null)[][];
  private whiteKingPosition: Position;
  private blackKingPosition: Position;

  private constructor(
    grid: (Piece | null)[][],
    whiteKingPos: Position,
    blackKingPos: Position
  ) {
    this.grid = grid;
    this.whiteKingPosition = whiteKingPos;
    this.blackKingPosition = blackKingPos;
  }

  static createInitialSetup(): Board {
    const grid: (Piece | null)[][] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      grid[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const setupPiece = INITIAL_BOARD_SETUP[row][col];
        
        if (setupPiece === null) {
          grid[row][col] = null;
        } else {
          const position = new Position(col, row);
          grid[row][col] = Board.createPiece(
            setupPiece.type,
            setupPiece.color,
            position
          );
        }
      }
    }

    const whiteKingPos = new Position(
      INITIAL_KING_POSITIONS[PieceColor.White].col,
      INITIAL_KING_POSITIONS[PieceColor.White].row
    );
    const blackKingPos = new Position(
      INITIAL_KING_POSITIONS[PieceColor.Black].col,
      INITIAL_KING_POSITIONS[PieceColor.Black].row
    );

    return new Board(grid, whiteKingPos, blackKingPos);
  }

  static createEmpty(): Board {
    const grid: (Piece | null)[][] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      grid[row] = new Array(BOARD_SIZE).fill(null);
    }

    const whiteKingPos = new Position(4, 0);
    const blackKingPos = new Position(4, 7);

    return new Board(grid, whiteKingPos, blackKingPos);
  }

  /**
   * ✅ PRIVATE: Create piece (used internally)
   */
  private static createPiece(
    type: PieceType,
    color: PieceColor,
    position: Position
  ): Piece {
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
        throw new Error(`Unknown piece type: ${type}`);
    }
  }

  /**
   * ✅ NEW: PUBLIC method to create piece (for promotion)
   */
  createPieceOfType(
    type: PieceType,
    color: PieceColor,
    position: Position
  ): Piece {
    return Board.createPiece(type, color, position);
  }

  getPieceAt(position: Position): Piece | null {
    if (!position.isValid()) {
      return null;
    }
    return this.grid[position.row][position.col];
  }

  private setPieceAt(position: Position, piece: Piece | null): void {
    if (!position.isValid()) {
      throw new Error(`Invalid position: ${position.toString()}`);
    }
    this.grid[position.row][position.col] = piece;
  }

  movePiece(from: Position, to: Position): Piece | null {
    const piece = this.getPieceAt(from);
    
    if (!piece) {
      throw new Error(`No piece at position ${from.toNotation()}`);
    }

    const capturedPiece = this.getPieceAt(to);

    this.setPieceAt(from, null);
    piece.setPosition(to);
    this.setPieceAt(to, piece);

    if (piece.type === PieceType.King) {
      if (piece.color === PieceColor.White) {
        this.whiteKingPosition = to;
      } else {
        this.blackKingPosition = to;
      }
    }

    return capturedPiece;
  }

  getKingPosition(color: PieceColor): Position {
    return color === PieceColor.White 
      ? this.whiteKingPosition 
      : this.blackKingPosition;
  }

  getPiecesByColor(color: PieceColor): Piece[] {
    const pieces: Piece[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.grid[row][col];
        if (piece && piece.color === color) {
          pieces.push(piece);
        }
      }
    }
    
    return pieces;
  }

  getAllPieces(): Piece[] {
    const pieces: Piece[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.grid[row][col];
        if (piece) {
          pieces.push(piece);
        }
      }
    }
    
    return pieces;
  }

  isEmpty(position: Position): boolean {
    return this.getPieceAt(position) === null;
  }

  isOpponentPiece(position: Position, color: PieceColor): boolean {
    const piece = this.getPieceAt(position);
    return piece !== null && piece.color !== color;
  }

  getGrid(): (Piece | null)[][] {
    return this.grid;
  }

  clone(): Board {
    const clonedGrid: (Piece | null)[][] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      clonedGrid[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.grid[row][col];
        clonedGrid[row][col] = piece ? piece.clone() : null;
      }
    }

    return new Board(
      clonedGrid,
      this.whiteKingPosition.clone(),
      this.blackKingPosition.clone()
    );
  }

  reset(): void {
    const freshBoard = Board.createInitialSetup();
    this.grid = freshBoard.grid;
    this.whiteKingPosition = freshBoard.whiteKingPosition;
    this.blackKingPosition = freshBoard.blackKingPosition;
  }

  placePiece(piece: Piece, position: Position): void {
    if (!position.isValid()) {
      throw new Error(`Invalid position: ${position.toString()}`);
    }

    this.setPieceAt(position, piece);

    if (piece.type === PieceType.King) {
      if (piece.color === PieceColor.White) {
        this.whiteKingPosition = position;
      } else {
        this.blackKingPosition = position;
      }
    }
  }

  removePiece(position: Position): Piece | null {
    const piece = this.getPieceAt(position);
    if (piece) {
      this.setPieceAt(position, null);
    }
    return piece;
  }

  countPieces(type: PieceType, color: PieceColor): number {
    let count = 0;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.grid[row][col];
        if (piece && piece.type === type && piece.color === color) {
          count++;
        }
      }
    }
    
    return count;
  }

  toFEN(): string {
    let fen = '';
    
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      let emptyCount = 0;
      
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.grid[row][col];
        
        if (piece === null) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += emptyCount.toString();
            emptyCount = 0;
          }
          fen += this.getPieceChar(piece);
        }
      }
      
      if (emptyCount > 0) {
        fen += emptyCount.toString();
      }
      
      if (row > 0) {
        fen += '/';
      }
    }
    
    return fen;
  }

  private getPieceChar(piece: Piece): string {
    const charMap: { [key: string]: string } = {
      'pawn': 'p',
      'knight': 'n',
      'bishop': 'b',
      'rook': 'r',
      'queen': 'q',
      'king': 'k'
    };
    
    const char = charMap[piece.type];
    return piece.color === PieceColor.White ? char.toUpperCase() : char;
  }

  toString(): string {
    let result = '  a b c d e f g h\n';
    
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      result += `${row + 1} `;
      
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.grid[row][col];
        
        if (piece) {
          const symbol = this.getPieceChar(piece);
          result += symbol + ' ';
        } else {
          result += '. ';
        }
      }
      
      result += `${row + 1}\n`;
    }
    
    result += '  a b c d e f g h';
    return result;
  }
}