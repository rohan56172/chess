import { IGameRepository } from '@/domain/interfaces/IGameRepository';

/**
 * Resign Game Use Case
 * 
 * Current player resigns the game
 */
export class ResignGameUseCase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(): Promise<ResignGameResponse> {
    const game = await this.gameRepository.getCurrentGame();
    
    if (!game) {
      return {
        success: false,
        error: 'No active game found'
      };
    }

    if (game.isGameOver()) {
      return {
        success: false,
        error: 'Game is already over'
      };
    }

    game.resign();

    await this.gameRepository.setCurrentGame(game);
    await this.gameRepository.save(game);

    return {
      success: true,
      message: `${game.getCurrentTurn()} resigned. Game over.`
    };
  }
}

export interface ResignGameResponse {
  success: boolean;
  error?: string;
  message?: string;
}