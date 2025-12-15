import { Board } from './Board';
import { Position } from '../value-objects/Position';
import { Move } from '../value-objects/Move';
import { PieceColor, getOppositeColor } from '../value-objects/PieceColor';
import { GameStatus } from '../value-objects/GameStatus';
import { MoveValidator } from '../services/MoveValidator';
import { CheckmateDetector } from '../services/CheckmateDetector';
import { CastlingService } from '../services/CastlingService'; // ✅ NEW
import { PieceType } from '../value-objects/PieceType';

interface GameSnapshot {
  board: Board;
  currentTurn: PieceColor;
  status: GameStatus;
  halfMoveClock: number;
  fullMoveNumber: number;
  move: Move;
}

/**
 * Game Entity (Aggregate Root)
 * 
 * Orchestrates the entire chess game including:
 * - Turn management
 * - Move execution
 * - Game status tracking
 * - Move history
 * - Game state validation
 */

export class Game {
  private board: Board;
  private currentTurn: PieceColor;
  private status: GameStatus;
  private moveHistory: Move[];
  private halfMoveClock: number; 
  private fullMoveNumber: number;

  private undoStack: GameSnapshot[] = [];
  private redoStack: GameSnapshot[] = [];

  // ✅ NEW: Track last pawn double move for en passant
  private lastPawnDoubleMove: Position | null = null;

  private constructor(
    board: Board,
    currentTurn: PieceColor,
    status: GameStatus,
    moveHistory: Move[] = [],
    halfMoveClock: number = 0,
    fullMoveNumber: number = 1
  ) {
    this.board = board;
    this.currentTurn = currentTurn;
    this.status = status;
    this.moveHistory = moveHistory;
    this.halfMoveClock = halfMoveClock;
    this.fullMoveNumber = fullMoveNumber;
  }

  static createNewGame(): Game {
    const board = Board.createInitialSetup();
    return new Game(
      board,
      PieceColor.White, 
      GameStatus.Playing,
      [],
      0,
      1
    );
  }

  static fromState(
    board: Board,
    currentTurn: PieceColor,
    status: GameStatus,
    moveHistory: Move[],
    halfMoveClock: number,
    fullMoveNumber: number
  ): Game {
    return new Game(
      board,
      currentTurn,
      status,
      moveHistory,
      halfMoveClock,
      fullMoveNumber
    );
  }


  getBoard(): Board {
    return this.board;
  }

  getCurrentTurn(): PieceColor {
    return this.currentTurn;
  }

  getStatus(): GameStatus {
    return this.status;
  }

  getMoveHistory(): Move[] {
    return [...this.moveHistory]; 
  }

  getLastMove(): Move | null {
    return this.moveHistory.length > 0
      ? this.moveHistory[this.moveHistory.length - 1]
      : null;
  }

  getHalfMoveClock(): number {
    return this.halfMoveClock;
  }

  getFullMoveNumber(): number {
    return this.fullMoveNumber;
  }

  isGameOver(): boolean {
    return [
      GameStatus.Checkmate,
      GameStatus.Stalemate,
      GameStatus.DrawByAgreement,
      GameStatus.DrawByFiftyMoveRule,
      GameStatus.DrawByRepetition,
      GameStatus.DrawByInsufficientMaterial,
      GameStatus.Resigned
    ].includes(this.status);
  }

  /**
   * ✅ NEW: Make move with promotion support
   */
  makeMove(from: Position, to: Position, promotionPiece?: PieceType): boolean {
    if (this.isGameOver()) {
      console.warn('Cannot make move: Game is over');
      return false;
    }

    const piece = this.board.getPieceAt(from);
    if (!piece) {
      console.warn(`No piece at ${from.toNotation()}`);
      return false;
    }

    // ✅ Check if it's a castling move
    if (piece.type === PieceType.King && CastlingService.isCastlingMove(from, to)) {
      return this.executeCastling(from, to);
    }

    // ✅ Check if pawn promotion
    if (piece.type === PieceType.Pawn && this.isPromotionMove(to, piece.color)) {
      if (!promotionPiece) {
        console.warn('Promotion piece not specified');
        return false;
      }
      return this.executePromotion(from, to, promotionPiece);
    }

    // ✅ Regular move validation
    const validation = MoveValidator.validateMove(
      this.board,
      from,
      to,
      this.currentTurn
    );

    if (!validation.isValid) {
      console.warn(`Invalid move: ${validation.error}`);
      return false;
    }

    // ✅ Save snapshot
    this.saveSnapshot(from, to);

    // ✅ Check for en passant
    const isEnPassant = this.isEnPassantCapture(from, to);

    // ✅ Execute move
    const capturedPiece = this.board.getPieceAt(to);
    this.board.movePiece(from, to);

    // ✅ Handle en passant capture
    if (isEnPassant) {
      const captureRow = piece.color === PieceColor.White ? to.row - 1 : to.row + 1;
      const capturePos = new Position(to.col, captureRow);
      const capturedPawn = this.board.getPieceAt(capturePos);
      this.board.removePiece(capturePos);

      const move = Move.enPassant(from, to, capturedPawn!.color);
      this.moveHistory.push(move);
    } else {
      // ✅ Regular move
      const move = capturedPiece
        ? Move.capture(from, to, piece.type, capturedPiece.type, capturedPiece.color)
        : Move.standard(from, to, piece.type);
      this.moveHistory.push(move);
    }

    // ✅ Track pawn double move for en passant
    if (piece.type === PieceType.Pawn && Math.abs(to.row - from.row) === 2) {
      this.lastPawnDoubleMove = to;
    } else {
      this.lastPawnDoubleMove = null;
    }

    this.redoStack = [];
    this.updateCounters(piece.type, capturedPiece !== null);
    this.currentTurn = getOppositeColor(this.currentTurn);
    this.updateGameStatus();

    return true;
  }

  /**
   * ✅ NEW: Execute castling move
   */
  private executeCastling(kingFrom: Position, kingTo: Position): boolean {
    const side = CastlingService.getCastlingSide(kingFrom, kingTo);

    if (!CastlingService.canCastle(this.board, this.currentTurn, side)) {
      console.warn(`Cannot castle ${side}`);
      return false;
    }

    this.saveSnapshot(kingFrom, kingTo);
    this.board.movePiece(kingFrom, kingTo);

    const rookCol = side === 'kingside' ? 7 : 0;
    const rookFrom = new Position(rookCol, kingFrom.row);
    const rookTo = CastlingService.getRookDestination(this.currentTurn, side);
    this.board.movePiece(rookFrom, rookTo);

    const move = Move.castling(kingFrom, kingTo, rookFrom, rookTo, side);
    this.moveHistory.push(move);

    this.redoStack = [];
    this.halfMoveClock++;
    if (this.currentTurn === PieceColor.Black) {
      this.fullMoveNumber++;
    }

    this.currentTurn = getOppositeColor(this.currentTurn);
    this.updateGameStatus();

    return true;
  }

  /**
   * ✅ NEW: Execute pawn promotion
   */
  private executePromotion(
    from: Position,
    to: Position,
    promotionPiece: PieceType
  ): boolean {
    const validation = MoveValidator.validateMove(
      this.board,
      from,
      to,
      this.currentTurn
    );

    if (!validation.isValid) {
      return false;
    }

    this.saveSnapshot(from, to);

    const piece = this.board.getPieceAt(from)!;
    const capturedPiece = this.board.getPieceAt(to);

    // ✅ Move pawn
    this.board.movePiece(from, to);

    // ✅ Replace with promoted piece
    const promotedPiece = this.board.createPieceOfType(
      promotionPiece,
      piece.color,
      to
    );
    this.board.removePiece(to);
    this.board.placePiece(promotedPiece, to);

    // ✅ Create promotion move
    const move = Move.promotion(
      from,
      to,
      promotionPiece,
      capturedPiece?.type,
      capturedPiece?.color
    );
    this.moveHistory.push(move);

    this.redoStack = [];
    this.halfMoveClock = 0; // Pawn move resets counter
    if (this.currentTurn === PieceColor.Black) {
      this.fullMoveNumber++;
    }

    this.currentTurn = getOppositeColor(this.currentTurn);
    this.updateGameStatus();

    return true;
  }

  /**
   *  Check if move is a promotion
   */
  private isPromotionMove(to: Position, color: PieceColor): boolean {
    const promotionRank = color === PieceColor.White ? 7 : 0;
    return to.row === promotionRank;
  }

  /**
   *  Check if move is en passant
   */
  private isEnPassantCapture(from: Position, to: Position): boolean {
    const piece = this.board.getPieceAt(from);
    
    if (!piece || piece.type !== PieceType.Pawn) {
      return false;
    }

    if (!this.lastPawnDoubleMove) {
      return false;
    }

    // Check if capturing to the side
    const colDiff = Math.abs(to.col - from.col);
    const rowDiff = to.row - from.row;
    const expectedRowDiff = piece.color === PieceColor.White ? 1 : -1;

    if (colDiff !== 1 || rowDiff !== expectedRowDiff) {
      return false;
    }

    // Check if target is behind the last double moved pawn
    return to.col === this.lastPawnDoubleMove.col &&
           ((piece.color === PieceColor.White && to.row === this.lastPawnDoubleMove.row + 1) ||
            (piece.color === PieceColor.Black && to.row === this.lastPawnDoubleMove.row - 1));
  }

  /**
   * Update move counters
   */
  private updateCounters(pieceType: PieceType, isCapture: boolean): void {
    if (isCapture || pieceType === PieceType.Pawn) {
      this.halfMoveClock = 0;
    } else {
      this.halfMoveClock++;
    }

    if (this.currentTurn === PieceColor.Black) {
      this.fullMoveNumber++;
    }
  }

  private saveSnapshot(from: Position, to: Position): void {
    const piece = this.board.getPieceAt(from);
    if (!piece) return;

    const capturedPiece = this.board.getPieceAt(to);

    const move = capturedPiece
      ? Move.capture(from, to, piece.type, capturedPiece.type, capturedPiece.color)
      : Move.standard(from, to, piece.type);

    const snapshot: GameSnapshot = {
      board: this.board.clone(),
      currentTurn: this.currentTurn,
      status: this.status,
      halfMoveClock: this.halfMoveClock,
      fullMoveNumber: this.fullMoveNumber,
      move: move
    };

    this.undoStack.push(snapshot);
  }

  private updateGameStatus(): void {
    if (this.halfMoveClock >= 100) {
      this.status = GameStatus.DrawByFiftyMoveRule;
      return;
    }

    if (CheckmateDetector.isInsufficientMaterial(this.board)) {
      this.status = GameStatus.DrawByInsufficientMaterial;
      return;
    }

    this.status = CheckmateDetector.detectGameStatus(this.board, this.currentTurn);
  }

  getLegalMovesForPiece(position: Position): Position[] {
    return MoveValidator.getLegalMoves(this.board, position);
  }

  resign(): void {
    if (this.isGameOver()) {
      return;
    }
    this.status = GameStatus.Resigned;
  }

  offerDraw(): void {
    if (this.isGameOver()) {
      return;
    }
    this.status = GameStatus.DrawByAgreement;
  }

  /**
   * Undo last move
   * @returns true if undo was successful
   */
  undoLastMove(): boolean {
    if (this.undoStack.length === 0) {
      return false;
    }

    if (this.moveHistory.length === 0) {
      return false;
    }

    const currentSnapshot: GameSnapshot = {
      board: this.board.clone(),
      currentTurn: this.currentTurn,
      status: this.status,
      halfMoveClock: this.halfMoveClock,
      fullMoveNumber: this.fullMoveNumber,
      move: this.moveHistory[this.moveHistory.length - 1]
    };
    this.redoStack.push(currentSnapshot);

    const snapshot = this.undoStack.pop()!;
    this.board = snapshot.board;
    this.currentTurn = snapshot.currentTurn;
    this.status = snapshot.status;
    this.halfMoveClock = snapshot.halfMoveClock;
    this.fullMoveNumber = snapshot.fullMoveNumber;

    this.moveHistory.pop();

    return true;
  }

  /**
   * Redo last undone move
   * @returns true if redo was successful
   */
  redoLastMove(): boolean {
    if (this.redoStack.length === 0) {
      return false;
    }

    const lastMove = this.moveHistory.length > 0 
      ? this.moveHistory[this.moveHistory.length - 1]
      : null;

    if (!lastMove) {
      const snapshot = this.redoStack[this.redoStack.length - 1];
      const currentSnapshot: GameSnapshot = {
        board: this.board.clone(),
        currentTurn: this.currentTurn,
        status: this.status,
        halfMoveClock: this.halfMoveClock,
        fullMoveNumber: this.fullMoveNumber,
        move: snapshot.move
      };
      this.undoStack.push(currentSnapshot);
    } else {
      const currentSnapshot: GameSnapshot = {
        board: this.board.clone(),
        currentTurn: this.currentTurn,
        status: this.status,
        halfMoveClock: this.halfMoveClock,
        fullMoveNumber: this.fullMoveNumber,
        move: lastMove
      };
      this.undoStack.push(currentSnapshot);
    }

    const snapshot = this.redoStack.pop()!;
    this.board = snapshot.board;
    this.currentTurn = snapshot.currentTurn;
    this.status = snapshot.status;
    this.halfMoveClock = snapshot.halfMoveClock;
    this.fullMoveNumber = snapshot.fullMoveNumber;
    this.moveHistory.push(snapshot.move);

    return true;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  reset(): void {
    this.board.reset();
    this.currentTurn = PieceColor.White;
    this.status = GameStatus.Playing;
    this.moveHistory = [];
    this.halfMoveClock = 0;
    this.fullMoveNumber = 1;
    this.undoStack = [];
    this.redoStack = [];
  }

  clone(): Game {
    const cloned = new Game(
      this.board.clone(),
      this.currentTurn,
      this.status,
      this.moveHistory.map(m => m.clone()),
      this.halfMoveClock,
      this.fullMoveNumber
    );

    cloned.undoStack = this.undoStack.map(s => ({
      board: s.board.clone(),
      currentTurn: s.currentTurn,
      status: s.status,
      halfMoveClock: s.halfMoveClock,
      fullMoveNumber: s.fullMoveNumber,
      move: s.move.clone()
    }));

    cloned.redoStack = this.redoStack.map(s => ({
      board: s.board.clone(),
      currentTurn: s.currentTurn,
      status: s.status,
      halfMoveClock: s.halfMoveClock,
      fullMoveNumber: s.fullMoveNumber,
      move: s.move.clone()
    }));

    return cloned;
  }

  toFEN(): string {
    const boardFEN = this.board.toFEN();
    const turn = this.currentTurn === PieceColor.White ? 'w' : 'b';
    const castling = '-';
    const enPassant = '-'; 
    const halfMove = this.halfMoveClock.toString();
    const fullMove = this.fullMoveNumber.toString();

    return `${boardFEN} ${turn} ${castling} ${enPassant} ${halfMove} ${fullMove}`;
  }

  getStatistics() {
    const whitePieces = this.board.getPiecesByColor(PieceColor.White);
    const blackPieces = this.board.getPiecesByColor(PieceColor.Black);

    return {
      totalMoves: this.moveHistory.length,
      fullMoveNumber: this.fullMoveNumber,
      halfMoveClock: this.halfMoveClock,
      whitePiecesCount: whitePieces.length,
      blackPiecesCount: blackPieces.length,
      capturedPieces: this.moveHistory.filter(m => m.isCapture()).length,
      currentTurn: this.currentTurn,
      status: this.status
    };
  }

  exportState(): GameState {
    return {
      board: this.board.toFEN(),
      currentTurn: this.currentTurn,
      status: this.status,
      moveHistory: this.moveHistory.map(m => m.toAlgebraicNotation()),
      halfMoveClock: this.halfMoveClock,
      fullMoveNumber: this.fullMoveNumber,
      timestamp: new Date().toISOString()
    };
  }

  toString(): string {
    const stats = this.getStatistics();
    return `
Game Status: ${this.status}
Current Turn: ${this.currentTurn}
Full Move: ${stats.fullMoveNumber}
Half Move Clock: ${stats.halfMoveClock}
Total Moves: ${stats.totalMoves}

${this.board.toString()}
    `.trim();
  }
}

export interface GameState {
  board: string;
  currentTurn: PieceColor;
  status: GameStatus;
  moveHistory: string[];
  halfMoveClock: number;
  fullMoveNumber: number;
  timestamp: string;
}