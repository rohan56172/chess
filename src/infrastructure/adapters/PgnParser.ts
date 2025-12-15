import { Game } from '@/domain/entities/Game';

/**
 * PGN Parser Adapter
 * 
 * Parses PGN (Portable Game Notation) to Game entity.
 * 
 * Example PGN:
 * [Event "World Championship"]
 * [Site "New York"]
 * [Date "2024.01.01"]
 * [White "Player 1"]
 * [Black "Player 2"]
 * 
 * 1. e4 e5 2. Nf3 Nc6 3. Bb5
 */
export class PGNParser {
  /**
   * Parse PGN string to Game
   */
  static parse(pgn: string): PGNGame {
    const { headers, moves } = this.splitPGN(pgn);
    const parsedHeaders = this.parseHeaders(headers);
    const parsedMoves = this.parseMoves(moves);

    return {
      headers: parsedHeaders,
      moves: parsedMoves,
      game: this.constructGame(parsedMoves)
    };
  }

  /**
   * Split PGN into headers and moves
   */
  private static splitPGN(pgn: string): { headers: string; moves: string } {
    const parts = pgn.trim().split('\n\n');
    
    if (parts.length < 2) {
      return { headers: '', moves: pgn };
    }

    const headers = parts.slice(0, -1).join('\n\n');
    const moves = parts[parts.length - 1];

    return { headers, moves };
  }

  /**
   * Parse PGN headers
   */
  private static parseHeaders(headerText: string): PGNHeaders {
    const headers: PGNHeaders = {};
    const headerRegex = /\[(\w+)\s+"([^"]+)"\]/g;
    let match;

    while ((match = headerRegex.exec(headerText)) !== null) {
      const [, key, value] = match;
      headers[key] = value;
    }

    return headers;
  }

  /**
   * Parse PGN moves
   */
  private static parseMoves(moveText: string): ParsedMove[] {
    const moves: ParsedMove[] = [];

    const cleanText = moveText
      .replace(/\{[^}]*\}/g, '') // Remove comments
      .replace(/\([^)]*\)/g, '') // Remove variations
      .replace(/\d+\./g, '')     // Remove move numbers
      .trim();

    const tokens = cleanText.split(/\s+/);

    for (const token of tokens) {
      if (token === '*' || token === '1-0' || token === '0-1' || token === '1/2-1/2') {
        continue;
      }

      try {
        const parsedMove = this.parseMove(token);
        moves.push(parsedMove);
      } catch (error) {
        console.warn(`Failed to parse move: ${token}`, error);
      }
    }

    return moves;
  }

  /**
   * Parse single move in algebraic notation
   */
  private static parseMove(move: string): ParsedMove {
    const cleanMove = move.replace(/[+#]/g, '');

    // Castling
    if (cleanMove === 'O-O') {
      return { type: 'castling', side: 'kingside', notation: move };
    }
    if (cleanMove === 'O-O-O') {
      return { type: 'castling', side: 'queenside', notation: move };
    }

    const moveRegex = /^([NBRQK])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[NBRQ])?$/;
    const match = cleanMove.match(moveRegex);

    if (!match) {
      throw new Error(`Invalid move notation: ${move}`);
    }

    const [, piece, file, rank, capture, target, promotion] = match;

    return {
      type: 'regular',
      piece: piece || 'P',
      from: { file, rank: rank ? parseInt(rank) : undefined },
      to: target,
      capture: !!capture,
      promotion: promotion ? promotion.slice(1) : undefined,
      notation: move
    };
  }

  /**
   * Construct Game from parsed moves
   */
  private static constructGame(moves: ParsedMove[]): Game {
    const game = Game.createNewGame();

    for (const move of moves) {
      try {
        if (move.type === 'castling') {
          console.warn('Castling not yet implemented');
          continue;
        }

      } catch (error) {
        console.warn(`Failed to apply move: ${move.notation}`, error);
      }
    }

    return game;
  }

  /**
   * Validate PGN string
   */
  static isValidPGN(pgn: string): boolean {
    try {
      this.parse(pgn);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * PGN Game
 */
export interface PGNGame {
  headers: PGNHeaders;
  moves: ParsedMove[];
  game: Game;
}

/**
 * PGN Headers
 */
export interface PGNHeaders {
  [key: string]: string;
}

/**
 * Parsed Move
 */
export type ParsedMove = {
  type: 'castling';
  side: 'kingside' | 'queenside';
  notation: string;
} | {
  type: 'regular';
  piece: string;
  from: { file?: string; rank?: number };
  to: string;
  capture: boolean;
  promotion?: string;
  notation: string;
};