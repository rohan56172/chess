import { Game } from '@/domain/entities/Game';
import { SerializationError } from '@/infrastructure/errors/PersistenceError';

/**
 * Serialized game state for storage
 */
export interface SerializedGame {
  id: string;
  fen: string;
  currentTurn: string;
  status: string;
  moveHistory: string[];
  halfMoveClock: number;
  fullMoveNumber: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Game Serializer
 * 
 * Converts Game entity to JSON-serializable format
 */
export class GameSerializer {
  /**
   * Serialize game to plain object
   */
  static serialize(game: Game, gameId?: string): SerializedGame {
    try {
      const state = game.exportState();
      
      return {
        id: gameId || `game-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        fen: state.board, // FEN notation
        currentTurn: state.currentTurn,
        status: state.status,
        moveHistory: state.moveHistory,
        halfMoveClock: state.halfMoveClock,
        fullMoveNumber: state.fullMoveNumber,
        createdAt: state.timestamp,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new SerializationError(`Failed to serialize game: ${error}`);
    }
  }

  /**
   * Serialize game to JSON string
   */
  static serializeToJSON(game: Game, gameId?: string): string {
    try {
      const serialized = this.serialize(game, gameId);
      return JSON.stringify(serialized);
    } catch (error) {
      throw new SerializationError(`Failed to serialize game to JSON: ${error}`);
    }
  }

  /**
   * Serialize multiple games to JSON
   */
  static serializeMany(games: Map<string, Game>): string {
    try {
      const serializedGames: Record<string, SerializedGame> = {};
      
      games.forEach((game, id) => {
        serializedGames[id] = this.serialize(game, id);
      });

      return JSON.stringify(serializedGames);
    } catch (error) {
      throw new SerializationError(`Failed to serialize multiple games: ${error}`);
    }
  }
}