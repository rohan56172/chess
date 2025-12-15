export enum GameStatus {
    Playing = "playing",
    Check = "check",
    Checkmate = "checkmate",
    Stalemate = "stalemate",
    DrawByAgreement = "draw_by_agreement",
    DrawByFiftyMoveRule = "draw_by_fifty_move_rule",
    DrawByRepetition = "draw_by_repetition",
    DrawByInsufficientMaterial = "draw_by_insufficient_material",
    NotStarted = "not_started",
    Paused = "paused",
    Resigned = "resigned",
}

export function isGameOver(status: GameStatus): boolean {
    return [
        GameStatus.Checkmate,
        GameStatus.Stalemate,
        GameStatus.DrawByAgreement,
        GameStatus.DrawByFiftyMoveRule,
        GameStatus.DrawByRepetition,
        GameStatus.DrawByInsufficientMaterial,
        GameStatus.Resigned,
    ].includes(status);
}

export function isDraw(status: GameStatus): boolean {
    return [
        GameStatus.Stalemate,
        GameStatus.DrawByAgreement,
        GameStatus.DrawByFiftyMoveRule,
        GameStatus.DrawByRepetition,
        GameStatus.DrawByInsufficientMaterial,
    ].includes(status);
}

export function getStatusMessage(status: GameStatus, currentPlayer?: string): string {
    const statusMessages: Record<GameStatus, string> = {
        [GameStatus.Playing]: currentPlayer ? `Game in progress. ${currentPlayer}'s turn.` : "Game in progress.",
        [GameStatus.Check]: currentPlayer ? `Check! ${currentPlayer}, is in check.` : "Check!",
        [GameStatus.Checkmate]: "Checkmate! Game over.",
        [GameStatus.Stalemate]: "Stalemate! Game is a draw.",
        [GameStatus.DrawByAgreement]: "Game drawn by agreement.",
        [GameStatus.DrawByFiftyMoveRule]: "Game drawn by fifty-move rule.",
        [GameStatus.DrawByRepetition]: "Game drawn by repetition.",
        [GameStatus.DrawByInsufficientMaterial]: "Game drawn by insufficient material.",
        [GameStatus.NotStarted]: "Game has not started.",
        [GameStatus.Paused]: "Game is paused.",
        [GameStatus.Resigned]: "Game over. A player has resigned.",
    };

    return statusMessages[status];
}