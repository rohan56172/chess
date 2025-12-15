import {Piece} from "../Piece";
import {PieceType} from "@/domain/value-objects/PieceType";
import {PieceColor} from "@/domain/value-objects/PieceColor";
import {Position} from "../../value-objects/Position";

export class King extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(PieceType.King, color, position);
  }

  getPossibleMoves(board: (Piece | null)[][]): Position[] {
    const possibleMoves: Position[] = [];
    const currentPos = this.getPosition();
    const directions = [
      {row: 1, col: 0}, // Up
      {row: 1, col: 1}, // Up-Right
      {row: 0, col: 1}, // Right
      {row: -1, col: 1}, // Down-Right
      {row: -1, col: 0}, // Down
      {row: -1, col: -1}, // Down-Left
      {row: 0, col: -1}, // Left
      {row: 1, col: -1}, // Up-Left
    ];

    for (const direction of directions) {
      try {
        const newPos = new Position(
          currentPos.col + direction.col,
          currentPos.row + direction.row
        );
        if (!newPos.isValid()) continue;

        const targetPiece = this.getPieceAt(board, newPos);
        if (
          this.isEmptySquare(targetPiece) ||
          this.isOpponentPiece(targetPiece)) {
          possibleMoves.push(newPos);
        }
      } catch  {
        continue;
      }
    }

    return possibleMoves;
  }

  clone(): King {
    const cloned = new King(this.color, this.getPosition());
    if (this.hasMoved()) {
      cloned.setPosition(this.getPosition());
    }
    return cloned;
  }

}
