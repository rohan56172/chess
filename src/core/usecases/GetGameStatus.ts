import { IGameRepository } from '@/domain/interfaces/IGameRepository';
import { GameSummaryDTO } from '@/core/dtos/GameState';

/**
 * Get Game State Use Case
 * 
 * Returns current game state
 */
export class GetGameStateUseCase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(): Promise<GetGameStateResponse> {
    const game = await this.gameRepository.getCurrentGame();
    
    if (!game) {
      return {
        success: false,
        error: 'No active game found'
      };
    }

    const stats = game.getStatistics();

    const summary: GameSummaryDTO = {
      status: game.getStatus(),
      currentTurn: game.getCurrentTurn() as 'white' | 'black',
      moveCount: stats.totalMoves,
      capturedPiecesCount: {
        white: 16 - stats.whitePiecesCount,
        black: 16 - stats.blackPiecesCount
      },
      timestamp: new Date().toISOString()
    };

    return {
      success: true,
      summary
    };
  }
}

export interface GetGameStateResponse {
  success: boolean;
  error?: string;
  summary?: GameSummaryDTO;
}