import { Position } from '@/domain/value-objects/Position';
import { IGameRepository } from '@/domain/interfaces/IGameRepository';
import { GameStateDTO, PieceDTO } from '@/core/dtos/GameState';
import { Game } from '@/domain/entities/Game';
import { toMoveDTO } from '@/core/dtos/MoveDTO';
import { PieceType } from '@/domain/value-objects/PieceType'; 

/**
 * Make Move Use Case
 * 
 * Executes a chess move and updates game state
 */
export class MakeMoveUseCase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(request: MakeMoveRequest): Promise<MakeMoveResponse> {
    const game = await this.gameRepository.getCurrentGame();
    
    if (!game) {
      return {
        success: false,
        error: 'No active game found'
      };
    }

    let fromPos: Position;
    let toPos: Position;
    
    try {
      fromPos = Position.fromNotation(request.from);
      toPos = Position.fromNotation(request.to);
    } catch (error) {
      return {
        success: false,
        error: `Invalid position notation: ${error}`
      };
    }

    let promotionPieceType: PieceType | undefined = undefined;
    if (request.promotionPiece) {
      promotionPieceType = request.promotionPiece as PieceType;
    }

    const success = game.makeMove(fromPos, toPos, promotionPieceType);
    
    if (!success) {
      return {
        success: false,
        error: 'Invalid move'
      };
    }

    await this.gameRepository.setCurrentGame(game);
    await this.gameRepository.save(game);

    return {
      success: true,
      gameState: this.convertToDTO(game)
    };
  }

  private convertToDTO(game: Game): GameStateDTO {
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
}

export interface MakeMoveRequest {
  from: string; // e.g., "e2"
  to: string;   // e.g., "e4"
  promotionPiece?: string; 
}

export interface MakeMoveResponse {
  success: boolean;
  error?: string;
  gameState?: GameStateDTO;
}