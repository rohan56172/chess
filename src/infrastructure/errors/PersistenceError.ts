/**
 * Base Persistence Error
 */
export class PersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PersistenceError';
  }
}

/**
 * Error when storage is not available
 */
export class StorageNotAvailableError extends PersistenceError {
  constructor() {
    super('LocalStorage is not available in this environment');
    this.name = 'StorageNotAvailableError';
  }
}

/**
 * Error when serialization fails
 */
export class SerializationError extends PersistenceError {
  constructor(message: string) {
    super(`Serialization failed: ${message}`);
    this.name = 'SerializationError';
  }
}

/**
 * Error when deserialization fails
 */
export class DeserializationError extends PersistenceError {
  constructor(message: string) {
    super(`Deserialization failed: ${message}`);
    this.name = 'DeserializationError';
  }
}

/**
 * Error when game not found
 */
export class GameNotFoundError extends PersistenceError {
  constructor(gameId: string) {
    super(`Game with ID ${gameId} not found`);
    this.name = 'GameNotFoundError';
  }
}