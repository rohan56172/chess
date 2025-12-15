import { IGameRepository } from '@/domain/interfaces/IGameRepository';
import { LocalStorageGameRepository } from './LocalStorageGameRepository';
import { InMemoryGameRepository } from './InMemoryGameRepository';

/**
 * Game Repository Factory
 * 
 * Creates appropriate repository based on environment
 */
export class GameRepositoryFactory {
  /**
   * Create repository based on environment
   */
  static create(): IGameRepository {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return new LocalStorageGameRepository();
      } catch (error) {
        console.warn('LocalStorage not available, falling back to InMemory:', error);
        return new InMemoryGameRepository();
      }
    }

    return new InMemoryGameRepository();
  }

  /**
   * Create InMemory repository (for testing)
   */
  static createInMemory(): InMemoryGameRepository {
    return new InMemoryGameRepository();
  }

  /**
   * Create LocalStorage repository (for production)
   */
  static createLocalStorage(): LocalStorageGameRepository {
    return new LocalStorageGameRepository();
  }
}