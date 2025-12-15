import { MoveDTO } from './MoveDTO';

export interface GameStateDTO {
  board: (PieceDTO | null)[][];
  currentTurn: 'white' | 'black';
  status: string;
  moveHistory: MoveDTO[];
  lastMove: MoveDTO | null;
  legalMoves: Record<string, string[]>;
  halfMoveClock: number;
  fullMoveNumber: number;
  capturedPieces: {
    white: string[];
    black: string[];
  };
  fen: string;
  timestamp: string;
}

export interface PieceDTO {
  type: string;
  color: 'white' | 'black';
  position: {
    col: number;
    row: number;
    notation: string;
  };
  hasMoved: boolean;
}

export interface GameSummaryDTO {
  status: string;
  currentTurn: 'white' | 'black';
  moveCount: number;
  capturedPiecesCount: {
    white: number;
    black: number;
  };
  timestamp: string;
}