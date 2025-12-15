import { Game } from '@/domain/entities/Game';
import { Move } from '@/domain/value-objects/Move';
import { PieceType } from '@/domain/value-objects/PieceType';

/**
 * PGN Serializer Adapter
 * 
 * Serializes Game entity to PGN notation.
 */
export class PGNSerializer {
  /**
   * Serialize game to PGN string
   */
  static serialize(game: Game, headers?: PGNHeaders): string {
    const headerString = this.serializeHeaders(headers);
    const movesString = this.serializeMoves(game);

    return `${headerString}\n\n${movesString}`;
  }

  /**
   * Serialize PGN headers
   */
  private static serializeHeaders(headers?: PGNHeaders): string {
    const defaultHeaders: PGNHeaders = {
      Event: headers?.Event || '?',
      Site: headers?.Site || '?',
      Date: headers?.Date || new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      Round: headers?.Round || '?',
      White: headers?.White || '?',
      Black: headers?.Black || '?',
      Result: headers?.Result || '*'
    };

    const finalHeaders = { ...defaultHeaders, ...headers };

    return Object.entries(finalHeaders)
      .map(([key, value]) => `[${key} "${value}"]`)
      .join('\n');
  }

  /**
   * Serialize moves to PGN format
   */
  private static serializeMoves(game: Game): string {
    const moves = game.getMoveHistory();
    let pgn = '';
    let moveNumber = 1;

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (i % 2 === 0) {
        pgn += `${moveNumber}. `;
      }
      pgn += this.moveToAlgebraic(move) + ' ';

      if (i % 2 === 1) {
        moveNumber++;
        if (moveNumber % 5 === 0) {
          pgn += '\n';
        }
      }
    }

    const result = this.getGameResult(game);
    pgn += result;

    return pgn.trim();
  }

  /**
   * Convert Move to algebraic notation
   */
  private static moveToAlgebraic(move: Move): string {
    let notation = '';
    if (move.isCastling) {
      const isKingside = move.to.col > move.from.col;
      return isKingside ? 'O-O' : 'O-O-O';
    }

    if (move.piece !== PieceType.Pawn || move.isCapture()) {
      if (move.piece !== PieceType.Pawn) {
        notation += this.getPieceSymbol(move.piece);
      }

      if (move.piece === PieceType.Pawn && move.isCapture()) {
        notation += move.from.toNotation()[0];
      }
    }

    if (move.isCapture()) {
      notation += 'x';
    }

    notation += move.to.toNotation();

    if (move.isPromotion && move.promotionPiece) {
      notation += '=' + this.getPieceSymbol(move.promotionPiece);
    }

    // TODO: Add check/checkmate symbols (+/#)

    return notation;
  }

  /**
   * Get piece symbol for PGN
   */
  private static getPieceSymbol(piece: PieceType): string {
    const symbolMap: Record<PieceType, string> = {
      [PieceType.King]: 'K',
      [PieceType.Queen]: 'Q',
      [PieceType.Rook]: 'R',
      [PieceType.Bishop]: 'B',
      [PieceType.Knight]: 'N',
      [PieceType.Pawn]: ''
    };

    return symbolMap[piece];
  }

  /**
   * Get game result
   */
  private static getGameResult(game: Game): string {
    const status = game.getStatus();

    if (status === 'checkmate') {
      const winner = game.getCurrentTurn() === 'white' ? '0-1' : '1-0';
      return winner;
    }

    if (status.includes('draw') || status === 'stalemate') {
      return '1/2-1/2';
    }

    return '*';
  }
}

/**
 * PGN Headers
 */
export interface PGNHeaders {
  Event?: string;
  Site?: string;
  Date?: string;
  Round?: string;
  White?: string;
  Black?: string;
  Result?: string;
  [key: string]: string | undefined;
}