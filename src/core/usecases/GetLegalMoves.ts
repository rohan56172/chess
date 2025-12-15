import { Position } from '@/domain/value-objects/Position';
import { IGameRepository } from '@/domain/interfaces/IGameRepository';
import { PositionDTO, toPositionDTO } from '@/core/dtos/PositionDTO';

/**
 * Get Legal Moves Use Case
 * 
 * Returns all legal moves for a piece at given position
 */
export class GetLegalMovesUseCase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(request: GetLegalMovesRequest): Promise<GetLegalMovesResponse> {
    const game = await this.gameRepository.getCurrentGame();
    
    if (!game) {
      return {
        success: false,
        error: 'No active game found',
        legalMoves: []
      };
    }

    let position: Position;
    try {
      position = Position.fromNotation(request.position);
    } catch (error) {
      return {
        success: false,
        error: `Invalid position: ${error}`,
        legalMoves: []
      };
    }

    const legalMoves = game.getLegalMovesForPiece(position);

    return {
      success: true,
      legalMoves: legalMoves.map(toPositionDTO),
      count: legalMoves.length
    };
  }
}

export interface GetLegalMovesRequest {
  position: string; // e.g., "e2"
}

export interface GetLegalMovesResponse {
  success: boolean;
  error?: string;
  legalMoves: PositionDTO[];
  count?: number;
}