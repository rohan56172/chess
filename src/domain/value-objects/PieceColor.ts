export enum PieceColor {
    White = "white",
    Black = "black",
}

export function getOppositeColor(color: PieceColor): PieceColor {
    return color === PieceColor.White ? PieceColor.Black : PieceColor.White;
}

export function isValidPieceColor(value: string): value is PieceColor {
    return value === PieceColor.White || value === PieceColor.Black;
}