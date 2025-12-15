'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { GameStateDTO, PieceDTO } from '@/core/dtos/GameState';
import { toMoveDTO } from '@/core/dtos/MoveDTO';
import { StartNewGameUseCase } from '@/core/usecases/StartNewGame';
import { MakeMoveUseCase } from '@/core/usecases/MakeMove';
import { UndoMoveUseCase } from '@/core/usecases/UndoMove';
import { RedoMoveUseCase } from '@/core/usecases/RedoMove';
import { ResignGameUseCase } from '@/core/usecases/ResignGame';
import { GetLegalMovesUseCase } from '@/core/usecases/GetLegalMoves';
import { GameRepositoryFactory } from '@/infrastructure/repositories/GameRepositoryFactory';
import { PositionDTO } from '@/core/dtos/PositionDTO';
import { Game } from '@/domain/entities/Game';
import { Position } from '@/domain/value-objects/Position';
import { PieceType } from '@/domain/value-objects/PieceType';
import { CastlingService } from '@/domain/services/CastlingService';

interface GameContextType {
  gameState: GameStateDTO | null;
  isLoading: boolean;
  error: string | null;
  selectedSquare: string | null;
  legalMoves: PositionDTO[];
  pendingPromotion: { from: string; to: string } | null;
  showInvalidTurnNotification: boolean;
  castlingMoves: PositionDTO[];
  
  startNewGame: () => Promise<void>;
  makeMove: (from: string, to: string, promotionPiece?: PieceType) => Promise<void>;
  undoMove: () => Promise<void>;
  redoMove: () => Promise<void>;
  resignGame: () => Promise<void>;
  selectSquare: (notation: string) => Promise<void>;
  clearSelection: () => void;
  cancelPromotion: () => void;
  hideInvalidTurnNotification: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameStateDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<PositionDTO[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);
  const [showInvalidTurnNotification, setShowInvalidTurnNotification] = useState(false);
  const [castlingMoves, setCastlingMoves] = useState<PositionDTO[]>([]);
  const repository = useMemo(() => GameRepositoryFactory.create(), []);
  const useCases = useMemo(() => ({
    startNewGame: new StartNewGameUseCase(repository),
    makeMove: new MakeMoveUseCase(repository),
    undoMove: new UndoMoveUseCase(repository),
    redoMove: new RedoMoveUseCase(repository),
    resignGame: new ResignGameUseCase(repository),
    getLegalMoves: new GetLegalMovesUseCase(repository),
  }), [repository]);

  const clearSelection = useCallback(() => {
    setSelectedSquare(null);
    setLegalMoves([]);
    setCastlingMoves([]);
  }, []);

  const hideInvalidTurnNotification = useCallback(() => {
    setShowInvalidTurnNotification(false);
  }, []);

  const convertGameToDTO = useCallback((game: Game): GameStateDTO => {
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

    const moveHistory = game.getMoveHistory().map(move => toMoveDTO(move));
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
  }, []);

  const startNewGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newGameState = await useCases.startNewGame.execute();
      setGameState(newGameState);
      setSelectedSquare(null);
      setLegalMoves([]);
      setCastlingMoves([]);
      setPendingPromotion(null);
      setShowInvalidTurnNotification(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start new game');
    } finally {
      setIsLoading(false);
    }
  }, [useCases.startNewGame]);

  const makeMove = useCallback(async (from: string, to: string, promotionPiece?: PieceType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const game = await repository.getCurrentGame();
      if (!game) {
        setError('No active game');
        return;
      }

      const fromPos = Position.fromNotation(from);
      const toPos = Position.fromNotation(to);
      const piece = game.getBoard().getPieceAt(fromPos);

      if (piece && piece.type === PieceType.Pawn && !promotionPiece) {
        const promotionRank = piece.color === 'white' ? 7 : 0;
        if (toPos.row === promotionRank) {
          setPendingPromotion({ from, to });
          setIsLoading(false);
          return;
        }
      }

      const response = await useCases.makeMove.execute({ from, to, promotionPiece });
      
      if (response.success && response.gameState) {
        setGameState(response.gameState);
        setSelectedSquare(null);
        setLegalMoves([]);
        setCastlingMoves([]);
        setPendingPromotion(null);
        setShowInvalidTurnNotification(false);
      } else {
        setError(response.error || 'Move failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make move');
    } finally {
      setIsLoading(false);
    }
  }, [useCases.makeMove, repository]);

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
    clearSelection();
  }, [clearSelection]);

  const undoMove = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await useCases.undoMove.execute();
      
      if (response.success) {
        const game = await repository.getCurrentGame();
        if (game) {
          setGameState(convertGameToDTO(game));
        }
        clearSelection();
      } else {
        setError(response.error || 'Undo failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to undo move');
    } finally {
      setIsLoading(false);
    }
  }, [useCases.undoMove, repository, convertGameToDTO, clearSelection]);

  const redoMove = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await useCases.redoMove.execute();
      
      if (response.success) {
        const game = await repository.getCurrentGame();
        if (game) {
          setGameState(convertGameToDTO(game));
        }
        clearSelection();
      } else {
        setError(response.error || 'Redo failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redo move');
    } finally {
      setIsLoading(false);
    }
  }, [useCases.redoMove, repository, convertGameToDTO, clearSelection]);

  const resignGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await useCases.resignGame.execute();
      
      if (response.success) {
        await startNewGame();
      } else {
        setError(response.error || 'Resign failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resign');
    } finally {
      setIsLoading(false);
    }
  }, [useCases.resignGame, startNewGame]);

  const selectSquare = useCallback(async (notation: string) => {
    if (!gameState) return;

    if (selectedSquare === notation) {
      setSelectedSquare(null);
      setLegalMoves([]);
      setCastlingMoves([]);
      return;
    }

    if (selectedSquare) {
      await makeMove(selectedSquare, notation);
      return;
    }

    const position = Position.fromNotation(notation);
    const game = await repository.getCurrentGame();
    if (game) {
      const piece = game.getBoard().getPieceAt(position);
      
      if (piece && piece.color !== gameState.currentTurn) {
        setShowInvalidTurnNotification(true);
        return;
      }
    }

    setSelectedSquare(notation);
    
    try {
      const response = await useCases.getLegalMoves.execute({ position: notation });
      
      if (response.success) {
        setLegalMoves(response.legalMoves);
        
        // Get castling moves if piece is King
        const game = await repository.getCurrentGame();
        if (game) {
          const piece = game.getBoard().getPieceAt(Position.fromNotation(notation));
          
          if (piece && piece.type === PieceType.King) {
            const castlingPositions: PositionDTO[] = [];
            const kingRow = piece.color === 'white' ? 0 : 7;
            
            // Check kingside castling
            if (CastlingService.canCastle(game.getBoard(), piece.color, 'kingside')) {
              castlingPositions.push({
                col: 6,
                row: kingRow,
                notation: String.fromCharCode(97 + 6) + (kingRow + 1)
              });
            }
            
            // Check queenside castling
            if (CastlingService.canCastle(game.getBoard(), piece.color, 'queenside')) {
              castlingPositions.push({
                col: 2,
                row: kingRow,
                notation: String.fromCharCode(97 + 2) + (kingRow + 1)
              });
            }
            
            setCastlingMoves(castlingPositions);
          } else {
            setCastlingMoves([]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to get legal moves:', err);
    }
  }, [gameState, selectedSquare, makeMove, useCases.getLegalMoves, repository]);

  const value: GameContextType = {
    gameState,
    isLoading,
    error,
    selectedSquare,
    legalMoves,
    pendingPromotion,
    showInvalidTurnNotification,
    castlingMoves,
    startNewGame,
    makeMove,
    undoMove,
    redoMove,
    resignGame,
    selectSquare,
    clearSelection,
    cancelPromotion,
    hideInvalidTurnNotification,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}