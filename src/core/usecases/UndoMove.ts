import { IGameRepository } from '@/domain/interfaces/IGameRepository';

/**
 * Undo Move Use Case
 * 
 * Undoes the last move
 */
export class UndoMoveUseCase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(): Promise<UndoMoveResponse> {
    const game = await this.gameRepository.getCurrentGame();
    
    if (!game) {
      return {
        success: false,
        error: 'No active game found'
      };
    }

    const success = game.undoLastMove();

    if (!success) {
      return {
        success: false,
        error: 'No moves to undo'
      };
    }
    
    await this.gameRepository.setCurrentGame(game);
    await this.gameRepository.save(game);

    return {
      success: true,
      message: 'Move undone successfully'
    };
  }
}

export interface UndoMoveResponse {
  success: boolean;
  error?: string;
  message?: string;
}