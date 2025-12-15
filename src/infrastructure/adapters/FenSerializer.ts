import { Board } from '@/domain/entities/Board';
import { Game } from '@/domain/entities/Game';
import { Position } from '@/domain/value-objects/Position';
import { PieceColor } from '@/domain/value-objects/PieceColor';
import { PieceType } from '@/domain/value-objects/PieceType';
import { Piece } from '@/domain/entities/Piece';

/**
 * FEN Serializer Adapter
 * 
 * Serializes Board/Game entity to FEN notation.
 */
export class FENSerializer {
  /**
   * Serialize board to FEN position string (board part only)
   */
  static serializeBoardPosition(board: Board): string {
    let fen = '';
    for (let row = 7; row >= 0; row--) {
      let emptyCount = 0;

      for (let col = 0; col < 8; col++) {
        const position = new Position(col, row);
        const piece = board.getPieceAt(position);

        if (!piece) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += emptyCount.toString();
            emptyCount = 0;
          }

          fen += this.getPieceChar(piece);
        }
      }

      if (emptyCount > 0) {
        fen += emptyCount.toString();
      }

      if (row > 0) {
        fen += '/';
      }
    }

    return fen;
  }

  /**
   * Serialize complete game to FEN
   */
  static serializeGame(game: Game): string {
    const board = game.getBoard();
    const boardFEN = this.serializeBoardPosition(board);
    const activeColor = game.getCurrentTurn() === PieceColor.White ? 'w' : 'b';
    const castling = '-';
    const enPassant = '-';
    const halfmove = game.getHalfMoveClock().toString();
    const fullmove = game.getFullMoveNumber().toString();

    return `${boardFEN} ${activeColor} ${castling} ${enPassant} ${halfmove} ${fullmove}`;
  }

  /**
   * Get FEN character for piece
   */
  private static getPieceChar(piece: Piece): string {
    const charMap: Record<PieceType, string> = {
      [PieceType.King]: 'k',
      [PieceType.Queen]: 'q',
      [PieceType.Rook]: 'r',
      [PieceType.Bishop]: 'b',
      [PieceType.Knight]: 'n',
      [PieceType.Pawn]: 'p'
    };

    const char = charMap[piece.type];
    return piece.color === PieceColor.White ? char.toUpperCase() : char;
  }

  /**
   * Serialize board to FEN with custom game state
   */
  static serialize(
    board: Board,
    activeColor: PieceColor,
    castling: string = '-',
    enPassant: string = '-',
    halfmove: number = 0,
    fullmove: number = 1
  ): string {
    const boardFEN = this.serializeBoardPosition(board);
    const color = activeColor === PieceColor.White ? 'w' : 'b';

    return `${boardFEN} ${color} ${castling} ${enPassant} ${halfmove} ${fullmove}`;
  }
}