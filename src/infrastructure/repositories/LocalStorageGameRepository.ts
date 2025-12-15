import { Game } from '@/domain/entities/Game';
import { IGameRepository } from '@/domain/interfaces/IGameRepository';
import { GameSerializer } from '@/infrastructure/serialization/GameSerializer';
import { GameDeserializer } from '@/infrastructure/serialization/GameDeserializer';
import {
  PersistenceError,
  StorageNotAvailableError,
  GameNotFoundError
} from '@/infrastructure/errors/PersistenceError';

/**
 * LocalStorage Game Repository
 * 
 * Implements IGameRepository using browser's LocalStorage.
 * This is an adapter that connects domain layer to browser storage.
 * 
 */
export class LocalStorageGameRepository implements IGameRepository {
  private static readonly STORAGE_KEY = 'chess_games';
  private static readonly CURRENT_GAME_KEY = 'chess_current_game';

  private gamesCache: Map<string, Game> | null = null;
  private currentGameId: string | null = null;

  constructor() {
    this.ensureStorageAvailable();
    this.initializeCache();
  }

  /**
   * Check if LocalStorage is available
   */
  private ensureStorageAvailable(): void {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch {
      throw new StorageNotAvailableError();
    }
  }

  /**
   * Initialize cache from storage
   */
  private initializeCache(): void {
    try {
      const storedGames = localStorage.getItem(LocalStorageGameRepository.STORAGE_KEY);
      
      if (storedGames) {
        this.gamesCache = GameDeserializer.deserializeMany(storedGames);
      } else {
        this.gamesCache = new Map();
      }

      this.currentGameId = localStorage.getItem(LocalStorageGameRepository.CURRENT_GAME_KEY);
    } catch (error) {
      console.error('Failed to initialize cache:', error);
      this.gamesCache = new Map();
      this.currentGameId = null;
    }
  }

  /**
   * Save games cache to storage
   */
  private persistCache(): void {
    try {
      if (!this.gamesCache) {
        throw new PersistenceError('Cache not initialized');
      }

      const serialized = GameSerializer.serializeMany(this.gamesCache);
      localStorage.setItem(LocalStorageGameRepository.STORAGE_KEY, serialized);
    } catch (error) {
      throw new PersistenceError(`Failed to persist cache: ${error}`);
    }
  }

  /**
   * Save game
   */
  async save(game: Game): Promise<void> {
    try {
      if (!this.gamesCache) {
        this.initializeCache();
      }

      let gameId = this.currentGameId;
      if (!gameId) {
        gameId = `game-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      }

      this.gamesCache!.set(gameId, game);
      this.persistCache();

      console.log(`Game ${gameId} saved successfully`);
    } catch (error) {
      throw new PersistenceError(`Failed to save game: ${error}`);
    }
  }

  /**
   * Find game by ID
   */
  async findById(id: string): Promise<Game | null> {
    try {
      if (!this.gamesCache) {
        this.initializeCache();
      }

      return this.gamesCache!.get(id) || null;
    } catch (error) {
      throw new PersistenceError(`Failed to find game: ${error}`);
    }
  }

  /**
   * Get all saved games
   */
  async findAll(): Promise<Game[]> {
    try {
      if (!this.gamesCache) {
        this.initializeCache();
      }

      return Array.from(this.gamesCache!.values());
    } catch (error) {
      throw new PersistenceError(`Failed to find all games: ${error}`);
    }
  }

  /**
   * Delete game
   */
  async delete(id: string): Promise<void> {
    try {
      if (!this.gamesCache) {
        this.initializeCache();
      }

      if (!this.gamesCache!.has(id)) {
        throw new GameNotFoundError(id);
      }

      this.gamesCache!.delete(id);

      if (this.currentGameId === id) {
        this.currentGameId = null;
        localStorage.removeItem(LocalStorageGameRepository.CURRENT_GAME_KEY);
      }

      this.persistCache();

      console.log(`Game ${id} deleted successfully`);
    } catch (error) {
      if (error instanceof GameNotFoundError) {
        throw error;
      }
      throw new PersistenceError(`Failed to delete game: ${error}`);
    }
  }

  /**
   * Get current active game
   */
  async getCurrentGame(): Promise<Game | null> {
    try {
      if (!this.currentGameId) {
        return null;
      }

      return this.findById(this.currentGameId);
    } catch (error) {
      throw new PersistenceError(`Failed to get current game: ${error}`);
    }
  }

  /**
   * Set game as current active game
   */
  async setCurrentGame(game: Game): Promise<void> {
    try {
      let gameId = this.currentGameId;
      if (!gameId) {
        gameId = `game-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        this.currentGameId = gameId;
      }
      await this.save(game);

      localStorage.setItem(LocalStorageGameRepository.CURRENT_GAME_KEY, gameId);
      this.currentGameId = gameId;

      console.log(`Game ${gameId} set as current`);
    } catch (error) {
      throw new PersistenceError(`Failed to set current game: ${error}`);
    }
  }

  /**
   * Clear all games (useful for testing/reset)
   */
  async clearAll(): Promise<void> {
    try {
      localStorage.removeItem(LocalStorageGameRepository.STORAGE_KEY);
      localStorage.removeItem(LocalStorageGameRepository.CURRENT_GAME_KEY);
      this.gamesCache = new Map();
      this.currentGameId = null;
      
      console.log('All games cleared');
    } catch (error) {
      throw new PersistenceError(`Failed to clear all games: ${error}`);
    }
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<StorageStats> {
    try {
      const games = await this.findAll();
      const storageData = localStorage.getItem(LocalStorageGameRepository.STORAGE_KEY);
      const storageSize = storageData ? new Blob([storageData]).size : 0;

      return {
        totalGames: games.length,
        currentGameId: this.currentGameId,
        storageSize,
        storageSizeKB: Math.round(storageSize / 1024)
      };
    } catch (error) {
      throw new PersistenceError(`Failed to get stats: ${error}`);
    }
  }
}

/**
 * Storage statistics
 */
export interface StorageStats {
  totalGames: number;
  currentGameId: string | null;
  storageSize: number;
  storageSizeKB: number;
}