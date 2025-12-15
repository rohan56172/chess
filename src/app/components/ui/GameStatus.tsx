import { useGame } from '@/app/context/GameContext';

/**
 * Enhanced Game Status Component
 * Better contrast and readability
 */
export function GameStatus() {
  const { gameState } = useGame();

  if (!gameState) {
    return null;
  }

  const statusConfig: Record<string, { color: string; icon: string; label: string }> = {
    playing: { color: 'text-green-500', icon: '▶️', label: 'In Progress' },
    check: { color: 'text-yellow-500', icon: '⚠️', label: 'Check!' },
    checkmate: { color: 'text-red-500', icon: '👑', label: 'Checkmate' },
    stalemate: { color: 'text-gray-400', icon: '🤝', label: 'Stalemate' },
    resigned: { color: 'text-red-500', icon: '🏳️', label: 'Resigned' },
  };

  const config = statusConfig[gameState.status] || statusConfig.playing;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <span>📊</span> Game Status
      </h2>
      
      <div className="space-y-4">
        {/* Status */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">Status</span>
            <div className={`flex items-center gap-2 ${config.color} font-bold text-lg`}>
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </div>
          </div>
        </div>

        {/* Turn */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm font-medium">Turn</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{gameState.currentTurn === 'white' ? '⚪' : '⚫'}</span>
              <span className="text-white font-bold capitalize">{gameState.currentTurn}</span>
            </div>
          </div>
        </div>

        {/* Move Number */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm font-medium">Move Number</span>
            <span className="text-white font-bold text-xl">{gameState.fullMoveNumber}</span>
          </div>
        </div>

        {/* 50-Move Rule Progress */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">50-Move Rule</span>
            <span className="text-gray-400 text-xs">{gameState.halfMoveClock}/100</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                gameState.halfMoveClock > 80 ? 'bg-red-500' : 
                gameState.halfMoveClock > 50 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${(gameState.halfMoveClock / 100) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}