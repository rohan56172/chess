import { Game } from '@/domain/entities/Game';

/**
 * Game Repository Interface (Port)
 * 
 * Defines contract for game persistence.
 * Implementation will be in Infrastructure layer.
 * 
 * This follows:
 * - Dependency Inversion Principle (depend on abstraction)
 * - Hexagonal Architecture (port)
 */
export interface IGameRepository {
  /**
   * Save game state
   */
  save(game: Game): Promise<void>;
  
  /**
   * Load game by ID
   */
  findById(id: string): Promise<Game | null>;
  
  /**
   * Get all saved games
   */
  findAll(): Promise<Game[]>;
  
  /**
   * Delete game
   */
  delete(id: string): Promise<void>;
  
  /**
   * Get current active game
   */
  getCurrentGame(): Promise<Game | null>;
  
  /**
   * Set game as current active game
   */
  setCurrentGame(game: Game): Promise<void>;
}