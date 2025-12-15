import { PieceType } from '@/domain/value-objects/PieceType';
import { PieceColor } from '@/domain/value-objects/PieceColor';

export const BOARD_SIZE = 8;
export const MIN_ROW = 0;
export const MAX_ROW = 7;
export const MIN_COL = 0;
export const MAX_COL = 7;

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

export const INITIAL_BOARD_SETUP = [
    [
        { type: PieceType.Rook, color: PieceColor.White },
        { type: PieceType.Knight, color: PieceColor.White },
        { type: PieceType.Bishop, color: PieceColor.White },
        { type: PieceType.Queen, color: PieceColor.White },
        { type: PieceType.King, color: PieceColor.White },
        { type: PieceType.Bishop, color: PieceColor.White },
        { type: PieceType.Knight, color: PieceColor.White },
        { type: PieceType.Rook, color: PieceColor.White },

    ],
    Array(8).fill({ type: PieceType.Pawn, color: PieceColor.White }),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill({ type: PieceType.Pawn, color: PieceColor.Black }),
    [
        { type: PieceType.Rook, color: PieceColor.Black },
        { type: PieceType.Knight, color: PieceColor.Black },
        { type: PieceType.Bishop, color: PieceColor.Black },
        { type: PieceType.Queen, color: PieceColor.Black },
        { type: PieceType.King, color: PieceColor.Black },
        { type: PieceType.Bishop, color: PieceColor.Black },
        { type: PieceType.Knight, color: PieceColor.Black },
        { type: PieceType.Rook, color: PieceColor.Black },
    ],
] as const;

export const INITIAL_KING_POSITIONS = {
    [PieceColor.White]: { row: 0, col: 4 },
    [PieceColor.Black]: { row: 7, col: 4 },
} as const;

export const INITIAL_ROOK_POSITIONS = {
    [PieceColor.White]: {
        kingside: { row: 0, col: 7 },
        queenside: { row: 0, col: 0 },
    },
    [PieceColor.Black]: {
        kingside: { row: 7, col: 7 },
        queenside: { row: 7, col: 0 },
    },
} as const;

export const PROMOTION_RANK = {
    [PieceColor.White]: 7,
    [PieceColor.Black]: 0,
} as const;

export const PAWN_START_RANK = {
    [PieceColor.White]: 1,
    [PieceColor.Black]: 6,
} as const; 

export const PAWN_DIRECTION = {
    [PieceColor.White]: 1,
    [PieceColor.Black]: -1,
} as const;
