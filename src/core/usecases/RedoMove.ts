import { IGameRepository } from '@/domain/interfaces/IGameRepository';

/**
 * Redo Move Use Case
 * 
 * Redoes the last undone move
 */
export class RedoMoveUseCase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(): Promise<RedoMoveResponse> {
    const game = await this.gameRepository.getCurrentGame();
    
    if (!game) {
      return {
        success: false,
        error: 'No active game found'
      };
    }

    const success = game.redoLastMove();

    if (!success) {
      return {
        success: false,
        error: 'No moves to redo'
      };
    }
    
    await this.gameRepository.setCurrentGame(game);
    await this.gameRepository.save(game);

    return {
      success: true,
      message: 'Move redone successfully'
    };
  }
}

export interface RedoMoveResponse {
  success: boolean;
  error?: string;
  message?: string;
}