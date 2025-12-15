import { Piece } from '../Piece';
import { Position } from '@/domain/value-objects/Position';
import { PieceType } from '@/domain/value-objects/PieceType';
import { PieceColor } from '@/domain/value-objects/PieceColor';

/**
 * SOLID Principles:
 * - Single Responsibility: Only handles Bishop's move logic
 * - Liskov Substitution: Can substitute Piece base class
 */

export class Bishop extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(PieceType.Bishop, color, position);
  }

  getPossibleMoves(board: (Piece | null)[][]): Position[] {
    const possibleMoves: Position[] = [];
    const currentPos = this.getPosition();

    const directions = [
      { row: -1, col: -1 },
      { row: -1, col: 1 },  
      { row: 1, col: -1 },  
      { row: 1, col: 1 },  
    ];

    for (const dir of directions) {
      let steps = 1;

      while (true) {
        try {
          const newPos = new Position(
            currentPos.col + (dir.col * steps),
            currentPos.row + (dir.row * steps)
          );

          if (!newPos.isValid()) break;

          const targetPiece = this.getPieceAt(board, newPos);

          if (this.isEmptySquare(targetPiece)) {
            possibleMoves.push(newPos);
            steps++;
            continue;
          }

          if (this.isOpponentPiece(targetPiece)) {
            possibleMoves.push(newPos);
            break;
          }

          if (this.isSameColorPiece(targetPiece)) {
            break;
          }

        } catch {
          break;
        }
      }
    }

    return possibleMoves;
  }

  clone(): Bishop {
    const cloned = new Bishop(this.color, this.position.clone());
    if (this.hasMoved()) {
      cloned.setPosition(this.position);
    }
    return cloned;
  }
}