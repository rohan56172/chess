export enum PieceType {
    Pawn = "pawn",
    Knight = "knight",
    Bishop = "bishop",
    Rook = "rook",
    Queen = "queen",
    King = "king",
}

export const PieceSymbols: Record<PieceType, { white: string, black: string }> = {
    [PieceType.Pawn]: { white: "♙", black: "♟" },
    [PieceType.Knight]: { white: "♘", black: "♞" },
    [PieceType.Bishop]: { white: "♗", black: "♝" },
    [PieceType.Rook]: { white: "♖", black: "♜" },
    [PieceType.Queen]: { white: "♕", black: "♛" },
    [PieceType.King]: { white: "♔", black: "♚" },
}

export function getPieceSymbol(type: PieceType, color: 'white' | 'black'): string {
    return PieceSymbols[type][color];
}

export const PieceValues: Record<PieceType, number> = {
    [PieceType.Pawn]: 1,
    [PieceType.Knight]: 3,
    [PieceType.Bishop]: 3,
    [PieceType.Rook]: 5,
    [PieceType.Queen]: 9,
    [PieceType.King]: 0,
}

export const PieceFenNotation: Record<PieceType, { white: string, black: string }> = {
    [PieceType.Pawn]: { white: "P", black: "p" },
    [PieceType.Knight]: { white: "N", black: "n" },
    [PieceType.Bishop]: { white: "B", black: "b" },
    [PieceType.Rook]: { white: "R", black: "r" },
    [PieceType.Queen]: { white: "Q", black: "q" },
    [PieceType.King]: { white: "K", black: "k" },
}  