export class Position {

    constructor (
        public readonly col: number,
        public readonly row: number,
    ) {
        if (!this.isValid()){
            throw new Error(
                `Invalid Position: row=${row}, col=${col}. Must be between 0-7.`
            );
        }
    }

    static fromNotation(notation: string): Position {
        if (notation.length !== 2 ){
            throw new Error(`Invalid notation: ${notation}`);
        }

        const file = notation.charCodeAt(0) - 'a'.charCodeAt(0);
        const rank = parseInt(notation[1], 10) - 1;

        return new Position(file, rank);
    }

    toNotation(): string {
        const file = String.fromCharCode('a'.charCodeAt(0) + this.col);
        const rank = (this.row + 1).toString();

        return file + rank;
    }

    isValid(): boolean {
        return (
            this.row >= 0 &&
            this.row <= 7 &&
            this.col >= 0 &&
            this.col <= 7
        );
    }

    equals(other: Position): boolean {
        return this.row === other.row && this.col === other.col;
    }

    isDiagonalTo(other: Position): boolean {
        return Math.abs(this.row - other.row) === Math.abs(this.col - other.col);
    }

    isHorizontalTo(other: Position): boolean {
        return this.row === other.row;
    }

    isVerticalTo(other: Position): boolean {
        return this.col === other.col;
    }
    
    toString(): string {
        return `Position(${this.col}, ${this.row}) [${this.toNotation()}]`;
    }

    clone(): Position{
        return new Position(this.col, this.row);
    }
}
