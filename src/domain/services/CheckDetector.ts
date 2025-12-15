import { Board } from '@/domain/entities/Board';
import { Position } from '@/domain/value-objects/Position';
import { PieceColor, getOppositeColor } from '@/domain/value-objects/PieceColor';
import { Piece } from '@/domain/entities/Piece';

/**
 * CheckDetector Domain Service
 * 
 * Responsible for detecting if a king is under attack (in check).
 * This is a domain service because:
 * - Logic involves multiple entities (Board, King, attacking pieces)
 * - Doesn't belong to a single entity
 * - Represents a domain concept (checking)
 */

export class CheckDetector {
  /**
   * Check if the king of specified color is in check
   * 
   * @param board - Current board state
   * @param kingColor - Color of the king to check
   * @returns true if king is in check, false otherwise
   */
  static isKingInCheck(board: Board, kingColor: PieceColor): boolean {
    const kingPosition = board.getKingPosition(kingColor);
    const opponentColor = getOppositeColor(kingColor);

    return this.isPositionUnderAttack(board, kingPosition, opponentColor);
  }

  /**
   * Check if a specific position is under attack by pieces of specified color
   * 
   * @param board - Current board state
   * @param position - Position to check
   * @param attackerColor - Color of attacking pieces
   * @returns true if position is under attack
   */
  static isPositionUnderAttack(
    board: Board,
    position: Position,
    attackerColor: PieceColor
  ): boolean {
    const attackingPieces = board.getPiecesByColor(attackerColor);
    for (const piece of attackingPieces) {
      const possibleMoves = piece.getPossibleMoves(board.getGrid());
      if (possibleMoves.some(move => move.equals(position))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get all positions that are under attack by specified color
   * Useful for visualizing attacked squares
   * 
   * @param board - Current board state
   * @param attackerColor - Color of attacking pieces
   * @returns Array of positions under attack
   */
  static getAttackedPositions(
    board: Board,
    attackerColor: PieceColor
  ): Position[] {
    const attackedPositions: Position[] = [];
    const attackingPieces = board.getPiecesByColor(attackerColor);

    for (const piece of attackingPieces) {
      const possibleMoves = piece.getPossibleMoves(board.getGrid());
      for (const move of possibleMoves) {
        if (!attackedPositions.some(pos => pos.equals(move))) {
          attackedPositions.push(move);
        }
      }
    }

    return attackedPositions;
  }

  /**
   * Get all pieces that are currently attacking a position
   * 
   * @param board - Current board state
   * @param position - Position being attacked
   * @param attackerColor - Color of attacking pieces
   * @returns Array of pieces attacking the position
   */
  static getAttackingPieces(
    board: Board,
    position: Position,
    attackerColor: PieceColor
  ): Piece[] {
    const attackingPieces: Piece[] = [];
    const pieces = board.getPiecesByColor(attackerColor);

    for (const piece of pieces) {
      const possibleMoves = piece.getPossibleMoves(board.getGrid());
      
      if (possibleMoves.some(move => move.equals(position))) {
        attackingPieces.push(piece);
      }
    }

    return attackingPieces;
  }

  /**
   * @param board - Current board state
   * @param from - Source position
   * @param to - Target position
   * @param kingColor - Color of the king to protect
   * @returns true if move would expose king to check
   */
  static wouldExposeKingToCheck(
    board: Board,
    from: Position,
    to: Position,
    kingColor: PieceColor
  ): boolean {
    const clonedBoard = board.clone();
    clonedBoard.movePiece(from, to);
    return this.isKingInCheck(clonedBoard, kingColor);
  }

  /**
   * @param board - Current board state
   * @param position - Position to check
   * @param attackerColor - Color of attacking pieces
   * @returns Number of pieces attacking the position
   */
  static getAttackCount(
    board: Board,
    position: Position,
    attackerColor: PieceColor
  ): number {
    return this.getAttackingPieces(board, position, attackerColor).length;
  }
}