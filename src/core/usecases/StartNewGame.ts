import { Game } from '@/domain/entities/Game';
import { IGameRepository } from '@/domain/interfaces/IGameRepository';
import { GameStateDTO, PieceDTO } from '@/core/dtos/GameState';
import { toMoveDTO } from '@/core/dtos/MoveDTO';
import { Position } from '@/domain/value-objects/Position';

/**
 * Start New Game Use Case
 * 
 * Creates a new chess game with initial setup
 */
export class StartNewGameUseCase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(): Promise<GameStateDTO> {
    const game = Game.createNewGame();
 
    await this.gameRepository.setCurrentGame(game);
    await this.gameRepository.save(game);
    
    return this.gameToDTO(game);
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

    const capturedPieces = {
      white: game.getMoveHistory()
        .filter(m => m.isCapture() && m.capturedPiece)
        .map(m => m.capturedPiece!),
      black: [] as string[]
    };
    
    return {
      board: boardDTO,
      currentTurn: game.getCurrentTurn() as 'white' | 'black',
      status: game.getStatus(),
      moveHistory: game.getMoveHistory().map(toMoveDTO),
      lastMove: game.getLastMove() ? toMoveDTO(game.getLastMove()!) : null,
      legalMoves: {},
      halfMoveClock: game.getHalfMoveClock(),
      fullMoveNumber: game.getFullMoveNumber(),
      capturedPieces,
      fen: game.toFEN(),
      timestamp: new Date().toISOString()
    };
  }
}