import { Piece } from '../Piece';
import { Position } from '@/domain/value-objects/Position';
import { PieceType } from '@/domain/value-objects/PieceType';
import { PieceColor } from '@/domain/value-objects/PieceColor';
import { 
  PAWN_DIRECTION, 
  PAWN_START_RANK, 
  PROMOTION_RANK 
} from '@/shared/constants/board.constants';



export class Pawn extends Piece {
  private justMovedTwoSquares: boolean = false;

  constructor(color: PieceColor, position: Position) {
    super(PieceType.Pawn, color, position);
  }

  getPossibleMoves(board: (Piece | null)[][]): Position[] {
    const possibleMoves: Position[] = [];
    const currentPos = this.getPosition();
    const direction = PAWN_DIRECTION[this.color]; 

    try {
      const oneSquareForward = new Position(
        currentPos.col,
        currentPos.row + direction
      );

      if (oneSquareForward.isValid()) {
        const targetPiece = this.getPieceAt(board, oneSquareForward);

        if (this.isEmptySquare(targetPiece)) {
          possibleMoves.push(oneSquareForward);

          if (!this.hasMoved() && currentPos.row === PAWN_START_RANK[this.color]) {
            const twoSquaresForward = new Position(
              currentPos.col,
              currentPos.row + (direction * 2)
            );

            if (twoSquaresForward.isValid()) {
              const targetPiece2 = this.getPieceAt(board, twoSquaresForward);
              
              if (this.isEmptySquare(targetPiece2)) {
                possibleMoves.push(twoSquaresForward);
              }
            }
          }
        }
      }
    } catch {
      // Position invalid
    }

    const captureDirections = [-1, 1]; 

    for (const colOffset of captureDirections) {
      try {
        const capturePos = new Position(
          currentPos.col + colOffset,
          currentPos.row + direction
        );

        if (capturePos.isValid()) {
          const targetPiece = this.getPieceAt(board, capturePos);

          if (this.isOpponentPiece(targetPiece)) {
            possibleMoves.push(capturePos);
          }

          const adjacentPos = new Position(
            currentPos.col + colOffset,
            currentPos.row
          );

          if (adjacentPos.isValid()) {
            const adjacentPiece = this.getPieceAt(board, adjacentPos);

            if (
              adjacentPiece &&
              adjacentPiece.type === PieceType.Pawn &&
              this.isOpponentPiece(adjacentPiece) &&
              (adjacentPiece as Pawn).getJustMovedTwoSquares()
            ) {
              possibleMoves.push(capturePos);
            }
          }
        }
      } catch {
        continue;
      }
    }

    return possibleMoves;
  }


  setPosition(position: Position): void {
    const oldRow = this.position.row;
    const newRow = position.row;
    const rowDifference = Math.abs(newRow - oldRow);

    this.justMovedTwoSquares = rowDifference === 2;

    super.setPosition(position);
  }


  getJustMovedTwoSquares(): boolean {
    return this.justMovedTwoSquares;
  }


  resetTwoSquaresFlag(): void {
    this.justMovedTwoSquares = false;
  }

  canPromote(): boolean {
    return this.position.row === PROMOTION_RANK[this.color];
  }


  clone(): Pawn {
    const cloned = new Pawn(this.color, this.position.clone());
    if (this.hasMoved()) {
      cloned.setPosition(this.position);
    }

    if (this.justMovedTwoSquares) {
      cloned.justMovedTwoSquares = true;
    }
    return cloned;
  }
}