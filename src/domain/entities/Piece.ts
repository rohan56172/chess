import { Position } from "@/domain/value-objects/Position";
import { PieceType } from "@/domain/value-objects/PieceType";
import { PieceColor } from "@/domain/value-objects/PieceColor";

export abstract class Piece {
    protected _hasMoved: boolean = false;

    constructor(
        public readonly type: PieceType,
        public readonly color: PieceColor,
        protected position: Position,
    ) {}

    getPosition(): Position {
        return this.position;
    }

    setPosition(position: Position): void {
        this.position = position;
        this._hasMoved = true;
    }

    hasMoved(): boolean {
        return this._hasMoved;
    }

    /**  
     * @param board - Current board state 
     * @returns Array of valid positions
     */
    abstract getPossibleMoves(board: (Piece | null)[][]): Position[];
    
    /**
     * Check if piece can move to target position
     * @param to - Target position
     * @param board - Current board state (
     */
    canMoveTo(to: Position, board: (Piece | null)[][]): boolean {
        const possibleMoves = this.getPossibleMoves(board);
        return possibleMoves.some(pos => pos.equals(to));
    }

    protected isOpponentPiece(target: Piece | null): boolean {
        return target !== null && target.color !== this.color;
    }

    protected isSameColorPiece(target: Piece | null): boolean {
        return target !== null && target.color === this.color;
    }

    protected isEmptySquare(target: Piece | null): boolean {
        return target === null;
    }

    protected isValidPosition(position: Position): boolean {
        return position.isValid();
    }

    protected getPieceAt(board: (Piece | null)[][], position: Position): Piece | null {
        if (!this.isValidPosition(position)) return null;   
        return board[position.row][position.col];
    }

    abstract clone(): Piece;

    toString(): string {
        return `${this.color} ${this.type} at ${this.position.toNotation()}`;
    }

    equals(other: Piece): boolean {
        return (
            this.type === other.type &&
            this.color === other.color &&
            this.position.equals(other.position)
        );
    }
}