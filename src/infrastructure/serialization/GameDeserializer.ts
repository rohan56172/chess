import { Game } from '@/domain/entities/Game';
import { Move } from '@/domain/value-objects/Move';
import { Position } from '@/domain/value-objects/Position';
import { PieceColor } from '@/domain/value-objects/PieceColor';
import { PieceType } from '@/domain/value-objects/PieceType';
import { GameStatus } from '@/domain/value-objects/GameStatus';
import { DeserializationError } from '@/infrastructure/errors/PersistenceError';
import { SerializedGame } from './GameSerializer';
import { FENParser } from '@/infrastructure/adapters/FenParser'

/**
 * Game Deserializer
 * 
 * Reconstructs Game entity from serialized data
 */
export class GameDeserializer {
  /**
   * Deserialize game from plain object
   */
  static deserialize(data: SerializedGame): Game {
    try {
      const board = FENParser.parse(data.fen);
      const moveHistory = this.parseMoveHistory(data.moveHistory);

      return Game.fromState(
        board,
        data.currentTurn as PieceColor,
        data.status as GameStatus,
        moveHistory,
        data.halfMoveClock,
        data.fullMoveNumber
      );
    } catch (error) {
      throw new DeserializationError(`Failed to deserialize game: ${error}`);
    }
  }

  /**
   * Deserialize game from JSON string
   */
  static deserializeFromJSON(json: string): Game {
    try {
      const data = JSON.parse(json) as SerializedGame;
      return this.deserialize(data);
    } catch (error) {
      throw new DeserializationError(`Failed to deserialize game from JSON: ${error}`);
    }
  }

  /**
   * Deserialize multiple games from JSON
   */
  static deserializeMany(json: string): Map<string, Game> {
    try {
      const data = JSON.parse(json) as Record<string, SerializedGame>;
      const games = new Map<string, Game>();

      Object.entries(data).forEach(([id, serializedGame]) => {
        games.set(id, this.deserialize(serializedGame));
      });

      return games;
    } catch (error) {
      throw new DeserializationError(`Failed to deserialize multiple games: ${error}`);
    }
  }

  /**
   * Parse move history from algebraic notation
   */
  private static parseMoveHistory(moveNotations: string[]): Move[] {
    const moves: Move[] = [];
    
    for (const notation of moveNotations) {
      try {
        if (notation.length >= 4) {
          const from = Position.fromNotation(notation.slice(0, 2));
          const to = Position.fromNotation(notation.slice(2, 4));
          
          // TODO: Implement full move parser from algebraic notation
          const move = Move.standard(from, to, PieceType.Pawn);
          moves.push(move);
        }
      } catch (error) {
        console.warn(`Failed to parse move notation: ${notation}`, error);
      }
    }
    
    return moves;
  }
}