import { Board } from '@/domain/entities/Board';
import { PieceColor } from '@/domain/value-objects/PieceColor';
import { CheckDetector } from './CheckDetector';
import { MoveValidator } from './MoveValidator';
import { GameStatus } from '@/domain/value-objects/GameStatus';

/**
 * CheckmateDetector Domain Service
 * 
 * Detects game-ending conditions:
 * - Checkmate: King in check with no legal moves
 * - Stalemate: Not in check but no legal moves
 * - Draw by insufficient material
 */

export class CheckmateDetector {
  /**
   * Detect current game status for a player
   */
  static detectGameStatus(board: Board, playerColor: PieceColor): GameStatus {
    const isInCheck = CheckDetector.isKingInCheck(board, playerColor);
    const hasLegalMoves = MoveValidator.hasLegalMoves(board, playerColor);
    if (isInCheck && !hasLegalMoves) {
      return GameStatus.Checkmate;
    }

    if (!isInCheck && !hasLegalMoves) {
      return GameStatus.Stalemate;
    }

    if (isInCheck && hasLegalMoves) {
      return GameStatus.Check;
    }

    return GameStatus.Playing;
  }

  /**
   * Check if current position is checkmate
   */
  static isCheckmate(board: Board, playerColor: PieceColor): boolean {
    return this.detectGameStatus(board, playerColor) === GameStatus.Checkmate;
  }

  /**
   * Check if current position is stalemate
   */
  static isStalemate(board: Board, playerColor: PieceColor): boolean {
    return this.detectGameStatus(board, playerColor) === GameStatus.Stalemate;
  }

  /**
   * Check for draw by insufficient material
   * 
   * Insufficient material scenarios:
   * - King vs King
   * - King + Bishop vs King
   * - King + Knight vs King
   * - King + Bishop vs King + Bishop (same color bishops)
   */
  static isInsufficientMaterial(board: Board): boolean {
    const allPieces = board.getAllPieces();

    if (allPieces.length === 2) {
      return true;
    }

    if (allPieces.length === 3) {
      const hasOnlyKingsAndMinor = allPieces.every(piece => {
        return (
          piece.type === 'king' ||
          piece.type === 'bishop' ||
          piece.type === 'knight'
        );
      });
      return hasOnlyKingsAndMinor;
    }

    if (allPieces.length === 4) {
      const bishops = allPieces.filter(p => p.type === 'bishop');
      const kings = allPieces.filter(p => p.type === 'king');

      if (bishops.length === 2 && kings.length === 2) {
        const bishop1Pos = bishops[0].getPosition();
        const bishop2Pos = bishops[1].getPosition();
        const bishop1Color = (bishop1Pos.row + bishop1Pos.col) % 2;
        const bishop2Color = (bishop2Pos.row + bishop2Pos.col) % 2;
        
        return bishop1Color === bishop2Color;
      }
    }

    return false;
  }

  // ✅ OPTION A: Remove entire function (not needed for MVP)
  // TODO: Implement mate detection in future (Phase 3 - Chess Engine)
  // This will require:
  // - Minimax algorithm
  // - Position evaluation
  // - Alpha-beta pruning
}