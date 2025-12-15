import { Game } from '@/domain/entities/Game';
import { IGameRepository } from '@/domain/interfaces/IGameRepository';
import { GameStateDTO, PieceDTO } from '@/core/dtos/GameState';
import { Position } from '@/domain/value-objects/Position';
import { toMoveDTO } from '@/core/dtos/MoveDTO';

/**
 * Load Game Use Case
 * 
 * Loads a saved game by ID or loads current active game
 */
export class LoadGameUseCase {
  constructor(private gameRepository: IGameRepository) {}

  /**
   * Load game by ID
   */
  async executeById(gameId: string): Promise<LoadGameResponse> {
    const game = await this.gameRepository.findById(gameId);
    
    if (!game) {
      return {
        success: false,
        error: `Game with ID ${gameId} not found`
      };
    }

    // Set as current game
    await this.gameRepository.setCurrentGame(game);

    return {
      success: true,
      game: this.gameToDTO(game),
      message: 'Game loaded successfully'
    };
  }

  /**
   * Load current active game
   */
  async executeCurrent(): Promise<LoadGameResponse> {
    const game = await this.gameRepository.getCurrentGame();
    
    if (!game) {
      return {
        success: false,
        error: 'No active game found'
      };
    }

    return {
      success: true,
      game: this.gameToDTO(game),
      message: 'Current game loaded'
    };
  }

  /**
   * Load all saved games (for game list/history)
   */
  async executeAll(): Promise<LoadAllGamesResponse> {
    const games = await this.gameRepository.findAll();

    return {
      success: true,
      games: games.map(g => this.gameToSummaryDTO(g)),
      count: games.length
    };
  }

  private gameToDTO(game: Game): GameStateDTO {
    const board = game.getBoard();
    const boardDTO: (PieceDTO | null)[][] = [];
    
    for (let row = 0; row < 8; row++) {
      boardDTO[row] = [];
      for (let col = 0; col < 8; col++) {
        const position = new Position(col, row);
        const piece = board.getPieceAt(position);
        
        if (piece) {
          boardDTO[row][col] = {
            type: piece.type,
            color: piece.color,
            position: {
              col: piece.getPosition().col,
              row: piece.getPosition().row,
              notation: piece.getPosition().toNotation()
            },
            hasMoved: piece.hasMoved()
          };
        } else {
          boardDTO[row][col] = null;
        }
      }
    }

    const moveHistory = game.getMoveHistory().map(toMoveDTO);
    const lastMove = game.getLastMove();
    
    const capturedPieces = {
      white: [] as string[],
      black: [] as string[]
    };

    game.getMoveHistory().forEach(move => {
      if (move.isCapture() && move.capturedPiece && move.capturedPieceColor) {
        if (move.capturedPieceColor === 'white') {
          capturedPieces.white.push(move.capturedPiece);
        } else {
          capturedPieces.black.push(move.capturedPiece);
        }
      }
    });

    return {
      board: boardDTO,
      currentTurn: game.getCurrentTurn() as 'white' | 'black',
      status: game.getStatus(),
      moveHistory,
      lastMove: lastMove ? toMoveDTO(lastMove) : null,
      legalMoves: {},
      halfMoveClock: game.getHalfMoveClock(),
      fullMoveNumber: game.getFullMoveNumber(),
      capturedPieces,
      fen: game.toFEN(),
      timestamp: new Date().toISOString()
    };
  }

  private gameToSummaryDTO(game: Game) {
    const stats = game.getStatistics();
    return {
      id: 'game-' + Date.now(),
      status: game.getStatus(),
      currentTurn: game.getCurrentTurn(),
      moveCount: stats.totalMoves,
      timestamp: new Date().toISOString()
    };
  }
}

export interface LoadGameResponse {
  success: boolean;
  error?: string;
  message?: string;
  game?: GameStateDTO;
}

export interface LoadAllGamesResponse {
  success: boolean;
  games: Array<{
    id: string;
    status: string;
    currentTurn: string;
    moveCount: number;
    timestamp: string;
  }>;
  count: number;
}