import { Game } from '@/domain/entities/Game';
import { IGameRepository } from '@/domain/interfaces/IGameRepository';
import { GameNotFoundError } from '@/infrastructure/errors/PersistenceError';

/**
 * InMemory Game Repository
 * 
 * Implementation for testing without LocalStorage dependency.
 * Stores games in memory only (lost on refresh).
 * 
 * Use cases:
 * - Unit testing
 * - Development without browser
 * - Server-side rendering
 */
export class InMemoryGameRepository implements IGameRepository {
  private games: Map<string, Game> = new Map();
  private currentGameId: string | null = null;
  private nextId = 1;

  async save(game: Game): Promise<void> {
    let gameId = this.currentGameId;
    
    if (!gameId) {
      gameId = `game-${this.nextId++}`;
      this.currentGameId = gameId;
    }

    this.games.set(gameId, game.clone());
  }

  async findById(id: string): Promise<Game | null> {
    const game = this.games.get(id);
    return game ? game.clone() : null;
  }

  async findAll(): Promise<Game[]> {
    return Array.from(this.games.values()).map(game => game.clone());
  }

  async delete(id: string): Promise<void> {
    if (!this.games.has(id)) {
      throw new GameNotFoundError(id);
    }

    this.games.delete(id);

    if (this.currentGameId === id) {
      this.currentGameId = null;
    }
  }

  async getCurrentGame(): Promise<Game | null> {
    if (!this.currentGameId) {
      return null;
    }

    return this.findById(this.currentGameId);
  }

  async setCurrentGame(game: Game): Promise<void> {
    let gameId = this.currentGameId;
    
    if (!gameId) {
      gameId = `game-${this.nextId++}`;
      this.currentGameId = gameId;
    }

    this.games.set(gameId, game.clone());
  }

  /**
   * Clear all games (for testing)
   */
  clear(): void {
    this.games.clear();
    this.currentGameId = null;
  }

  /**
   * Get repository stats
   */
  getStats() {
    return {
      totalGames: this.games.size,
      currentGameId: this.currentGameId
    };
  }
}