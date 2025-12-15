import {Piece} from "../Piece";
import {PieceType} from "@/domain/value-objects/PieceType";
import {PieceColor} from "@/domain/value-objects/PieceColor";
import {Position} from "../../value-objects/Position";

export class Queen extends Piece {
  constructor(color: PieceColor, position: Position) {
    super(PieceType.Queen, color, position);
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

    for (const dir of directions) {
      let steps = 1;
      while (true) {
        try {
          const newPos = new Position(
            currentPos.col + dir.col * steps,
            currentPos.row + dir.row * steps
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

  clone(): Queen {
    const cloned = new Queen(this.color, this.position.clone());
    if (this.hasMoved()) {
      cloned.setPosition(this.position);
    }
    return cloned;
  }
}
