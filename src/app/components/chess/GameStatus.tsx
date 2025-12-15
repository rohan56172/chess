import { useGame } from '../../context/GameContext';

/**
 * Game Status Display Component
 */
export function GameStatus() {
  const { gameState } = useGame();

  if (!gameState) {
    return null;
  }

  const statusColors: Record<string, string> = {
    playing: 'text-green-600',
    check: 'text-yellow-600',
    checkmate: 'text-red-600',
    stalemate: 'text-gray-600',
  };

  const statusColor = statusColors[gameState.status] || 'text-gray-600';

  const turnDisplay = gameState.currentTurn === 'white' ? '⚪ White' : '⚫ Black';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Game Status</h2>
      
      <div className="space-y-3">
        {/* Current Turn */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Turn:</span>
          <span className="text-lg font-bold">{turnDisplay}</span>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Status:</span>
          <span className={`text-lg font-bold ${statusColor} capitalize`}>
            {gameState.status.replace('_', ' ')}
          </span>
        </div>

        {/* Move Number */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Move:</span>
          <span className="text-lg font-bold">{gameState.fullMoveNumber}</span>
        </div>

        {/* Half Move Clock */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium text-sm">50-Move Rule:</span>
          <span className="text-sm text-gray-500">{gameState.halfMoveClock}/100</span>
        </div>
      </div>
    </div>
  );
}