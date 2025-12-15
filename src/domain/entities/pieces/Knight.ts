import { Piece } from '../Piece';
import { Position } from '@/domain/value-objects/Position';
import { PieceType } from '@/domain/value-objects/PieceType';
import { PieceColor } from '@/domain/value-objects/PieceColor';


export class Knight extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(PieceType.Knight, color, position);
  }

  getPossibleMoves(board: (Piece | null)[][]): Position[] {
    const possibleMoves: Position[] = [];
    const currentPos = this.getPosition();

    const knightMoves = [
      { row: -2, col: -1 }, 
      { row: -2, col: 1 }, 
      { row: -1, col: -2 }, 
      { row: -1, col: 2 },
      { row: 1, col: -2 },  
      { row: 1, col: 2 },  
      { row: 2, col: -1 }, 
      { row: 2, col: 1 },   
    ];

    for (const move of knightMoves) {
      try {
        const newPos = new Position(
          currentPos.col + move.col,
          currentPos.row + move.row
        );

        if (!newPos.isValid()) continue;

        const targetPiece = this.getPieceAt(board, newPos);

        if (this.isEmptySquare(targetPiece) || this.isOpponentPiece(targetPiece)) {
          possibleMoves.push(newPos);
        }

      } catch {

        continue;
      }
    }

    return possibleMoves;
  }

  clone(): Knight {
    const cloned = new Knight(this.color, this.position.clone());
    if (this.hasMoved()) {
      cloned.setPosition(this.position);
    }
    return cloned;
  }
}