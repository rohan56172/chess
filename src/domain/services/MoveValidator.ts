import { Board } from '@/domain/entities/Board';
import { Position } from '@/domain/value-objects/Position';
import { PieceColor } from '@/domain/value-objects/PieceColor';
import { CheckDetector } from './CheckDetector';

/**
 * MoveValidator Domain Service
 * 
 * Validates if a move is legal according to chess rules.
 * Checks:
 * - Basic piece movement rules (handled by piece classes)
 * - King safety (cannot move into check)
 * - Pinned pieces (cannot expose king to check)
 * - Special moves (castling, en passant) - TODO
 */

export class MoveValidator {
  /**
   * Validate if a move is legal
   * 
   * @param board - Current board state
   * @param from - Source position
   * @param to - Target position
   * @param playerColor - Color of player making the move
   * @returns ValidationResult with isValid and error message
   */
  static validateMove(
    board: Board,
    from: Position,
    to: Position,
    playerColor: PieceColor
  ): MoveValidationResult {

    const piece = board.getPieceAt(from);
    if (!piece) {
      return {
        isValid: false,
        error: `No piece at position ${from.toNotation()}`
      };
    }

    if (piece.color !== playerColor) {
      return {
        isValid: false,
        error: `Piece at ${from.toNotation()} belongs to opponent`
      };
    }

    if (from.equals(to)) {
      return {
        isValid: false,
        error: 'Source and target positions are the same'
      };
    }

    if (!piece.canMoveTo(to, board.getGrid())) {
      return {
        isValid: false,
        error: `Illegal move for ${piece.type} from ${from.toNotation()} to ${to.toNotation()}`
      };
    }

    const targetPiece = board.getPieceAt(to);
    if (targetPiece && targetPiece.color === playerColor) {
      return {
        isValid: false,
        error: `Cannot capture your own piece at ${to.toNotation()}`
      };
    }

    if (CheckDetector.wouldExposeKingToCheck(board, from, to, playerColor)) {
      return {
        isValid: false,
        error: 'Move would expose king to check'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * @param board - Current board state
   * @param position - Position of the piece
   * @returns Array of legal positions
   */
  static getLegalMoves(board: Board, position: Position): Position[] {
    const piece = board.getPieceAt(position);
    if (!piece) {
      return [];
    }

    const possibleMoves = piece.getPossibleMoves(board.getGrid());

    const legalMoves = possibleMoves.filter(move => {
      return !CheckDetector.wouldExposeKingToCheck(
        board,
        position,
        move,
        piece.color
      );
    });

    return legalMoves;
  }

  /**
   * Check if player has any legal moves
   * Used for detecting stalemate
   * 
   * @param board - Current board state
   * @param playerColor - Color of player to check
   * @returns true if player has at least one legal move
   */
  static hasLegalMoves(board: Board, playerColor: PieceColor): boolean {
    const pieces = board.getPiecesByColor(playerColor);

    for (const piece of pieces) {
      const legalMoves = this.getLegalMoves(board, piece.getPosition());
      if (legalMoves.length > 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get total count of legal moves for a player
   * Useful for move generation and evaluation
   * 
   * @param board - Current board state
   * @param playerColor - Color of player
   * @returns Total number of legal moves
   */
  static getLegalMoveCount(board: Board, playerColor: PieceColor): number {
    const pieces = board.getPiecesByColor(playerColor);
    let totalMoves = 0;

    for (const piece of pieces) {
      const legalMoves = this.getLegalMoves(board, piece.getPosition());
      totalMoves += legalMoves.length;
    }

    return totalMoves;
  }

  /**
   * Validate if a position is safe for the king to move to
   * Used for king movement validation
   * 
   * @param board - Current board state
   * @param position - Position to check
   * @param kingColor - Color of the king
   * @returns true if position is safe (not under attack)
   */
  static isPositionSafeForKing(
    board: Board,
    position: Position,
    kingColor: PieceColor
  ): boolean {

    const tempBoard = board.clone();
    const kingPosition = board.getKingPosition(kingColor);
    tempBoard.movePiece(kingPosition, position);

    return !CheckDetector.isKingInCheck(tempBoard, kingColor);
  }
}

export interface MoveValidationResult {
  isValid: boolean;
  error: string | null;
}