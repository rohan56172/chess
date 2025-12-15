import { Board } from '../entities/Board';
import { Position } from '../value-objects/Position';
import { PieceColor } from '../value-objects/PieceColor';
import { PieceType } from '../value-objects/PieceType';
import { CheckDetector } from './CheckDetector';

/**
 * Castling Service
 * 
 * Handles castling validation according to FIDE rules:
 * 1. King and rook haven't moved
 * 2. No pieces between king and rook
 * 3. King is not in check
 * 4. King doesn't move through check
 * 5. King doesn't end in check
 */
export class CastlingService {
  /**
   * Check if castling is possible
   */
  static canCastle(
    board: Board,
    color: PieceColor,
    side: 'kingside' | 'queenside'
  ): boolean {
    const kingPosition = board.getKingPosition(color);
    const king = board.getPieceAt(kingPosition);

    if (!king || king.hasMoved()) {
      return false;
    }

    if (CheckDetector.isKingInCheck(board, color)) {
      return false;
    }

    const row = color === PieceColor.White ? 0 : 7;
    const rookCol = side === 'kingside' ? 7 : 0;
    const rookPosition = new Position(rookCol, row);
    const rook = board.getPieceAt(rookPosition);

    if (!rook || rook.type !== PieceType.Rook || rook.hasMoved()) {
      return false;
    }

    const pathPositions = this.getPathPositions(kingPosition, rookPosition);
    for (const pos of pathPositions) {
      if (!board.isEmpty(pos)) {
        return false;
      }
    }

    const kingPath = this.getKingPath(color, side);
    const opponentColor = color === PieceColor.White ? PieceColor.Black : PieceColor.White;

    for (const pos of kingPath) {
      const tempBoard = board.clone();
      tempBoard.removePiece(kingPosition);
      const tempKing = king.clone();
      tempKing.setPosition(pos);
      tempBoard.placePiece(tempKing, pos);

      if (CheckDetector.isPositionUnderAttack(tempBoard, pos, opponentColor)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get positions between king and rook (excluding king and rook)
   */
  private static getPathPositions(from: Position, to: Position): Position[] {
    const positions: Position[] = [];
    const minCol = Math.min(from.col, to.col);
    const maxCol = Math.max(from.col, to.col);

    for (let col = minCol + 1; col < maxCol; col++) {
      positions.push(new Position(col, from.row));
    }

    return positions;
  }

  /**
   * Get king's path during castling
   */
  private static getKingPath(
    color: PieceColor,
    side: 'kingside' | 'queenside'
  ): Position[] {
    const row = color === PieceColor.White ? 0 : 7;
    const kingStartCol = 4;

    if (side === 'kingside') {
      return [
        new Position(kingStartCol, row),     // e1 (start)
        new Position(kingStartCol + 1, row), // f1 (through)
        new Position(kingStartCol + 2, row)  // g1 (end)
      ];
    } else {
      return [
        new Position(kingStartCol, row),     // e1 (start)
        new Position(kingStartCol - 1, row), // d1 (through)
        new Position(kingStartCol - 2, row)  // c1 (end)
      ];
    }
  }

  /**
   * Get rook destination for castling
   */
  static getRookDestination(
    color: PieceColor,
    side: 'kingside' | 'queenside'
  ): Position {
    const row = color === PieceColor.White ? 0 : 7;

    if (side === 'kingside') {
      return new Position(5, row); // f1 or f8
    } else {
      return new Position(3, row); // d1 or d8
    }
  }

  /**
   * Get king destination for castling
   */
  static getKingDestination(
    color: PieceColor,
    side: 'kingside' | 'queenside'
  ): Position {
    const row = color === PieceColor.White ? 0 : 7;

    if (side === 'kingside') {
      return new Position(6, row); // g1 or g8
    } else {
      return new Position(2, row); // c1 or c8
    }
  }

  /**
   * Detect if a move is a castling attempt
   */
  static isCastlingMove(from: Position, to: Position): boolean {
    // King moves 2 squares horizontally
    const colDiff = Math.abs(to.col - from.col);
    const rowDiff = Math.abs(to.row - from.row);

    return colDiff === 2 && rowDiff === 0;
  }

  /**
   * Get castling side from move
   */
  static getCastlingSide(from: Position, to: Position): 'kingside' | 'queenside' {
    return to.col > from.col ? 'kingside' : 'queenside';
  }
}