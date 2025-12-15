import { useGame } from '@/app/context/GameContext';
import { Button } from './Button';

/**
 * Ultra Modern Game Info Component
 */
export function GameInfo() {
  const { gameState, startNewGame, undoMove, resignGame, isLoading } = useGame();

  if (!gameState) {
    return (
      <div className="glass rounded-3xl p-8 glow-effect">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-white/10 rounded-2xl" />
          <div className="h-32 bg-white/10 rounded-2xl" />
          <div className="h-40 bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { color: string; icon: string; label: string; gradient: string }> = {
    playing: { 
      color: 'text-green-400', 
      icon: '⚡', 
      label: 'Active',
      gradient: 'from-green-500/30 to-emerald-500/30'
    },
    check: { 
      color: 'text-yellow-400', 
      icon: '⚠️', 
      label: 'Check!',
      gradient: 'from-yellow-500/30 to-orange-500/30'
    },
    checkmate: { 
      color: 'text-red-400', 
      icon: '👑', 
      label: 'Checkmate',
      gradient: 'from-red-500/30 to-pink-500/30'
    },
    stalemate: { 
      color: 'text-gray-400', 
      icon: '🤝', 
      label: 'Draw',
      gradient: 'from-gray-500/30 to-slate-500/30'
    },
    resigned: { 
      color: 'text-red-400', 
      icon: '🏳️', 
      label: 'Resigned',
      gradient: 'from-red-500/30 to-pink-500/30'
    },
  };

  const config = statusConfig[gameState.status] || statusConfig.playing;
  const isGameActive = !gameState.status.includes('checkmate') && 
                       !gameState.status.includes('stalemate') &&
                       !gameState.status.includes('resigned');
  const canUndo = gameState.moveHistory.length > 0;

  return (
    <div className="space-y-4">
      {/* Player Turn - Large Display */}
      <div className="glass rounded-3xl p-8 text-center glow-effect">
        <div className="mb-4">
          <div className="text-8xl mb-4 filter drop-shadow-lg animate-pulse">
            {gameState.currentTurn === 'white' ? '⚪' : '⚫'}
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {gameState.currentTurn === 'white' ? 'White' : 'Black'}
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-wider">to move</p>
        </div>
      </div>

      {/* Status Card */}
      <div className={`glass rounded-3xl p-6 bg-gradient-to-br ${config.gradient}`}>
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Status</span>
          <div className={`flex items-center gap-2 ${config.color} font-bold text-lg`}>
            <span className="text-2xl">{config.icon}</span>
            <span>{config.label}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass rounded-2xl p-4 text-center bg-white/5">
            <div className="text-gray-400 text-xs mb-2 uppercase">Move</div>
            <div className="text-white font-black text-3xl">{gameState.fullMoveNumber}</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center bg-white/5">
            <div className="text-gray-400 text-xs mb-2 uppercase">Total</div>
            <div className="text-white font-black text-3xl">{gameState.moveHistory.length}</div>
          </div>
        </div>

        {/* 50-Move Rule Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-3 uppercase tracking-wider">
            <span>50-Move Rule</span>
            <span className="font-bold">{gameState.halfMoveClock}/100</span>
          </div>
          <div className="relative w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                gameState.halfMoveClock > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                gameState.halfMoveClock > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 
                'bg-gradient-to-r from-green-500 to-emerald-600'
              }`}
              style={{ width: `${(gameState.halfMoveClock / 100) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls Card */}
      <div className="glass rounded-3xl p-6">
        <h3 className="text-white font-bold mb-4 text-lg uppercase tracking-wider flex items-center gap-2">
          <span>🎮</span> Controls
        </h3>
        
        <div className="space-y-3">
          {/* New Game */}
          <Button
            variant="success"
            fullWidth
            size="lg"
            onClick={startNewGame}
            disabled={isLoading}
            className="!bg-gradient-to-r !from-green-500 !to-emerald-600 hover:!from-green-600 hover:!to-emerald-700 !shadow-xl hover:!shadow-2xl !transform hover:!scale-105"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span className="font-bold">Loading...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 font-bold">
                <span className="text-xl">🆕</span> New Game
              </span>
            )}
          </Button>

          {/* Undo */}
          <Button
            variant="warning"
            fullWidth
            size="lg"
            onClick={undoMove}
            disabled={isLoading || !isGameActive || !canUndo}
            className="!bg-gradient-to-r !from-yellow-500 !to-orange-600 hover:!from-yellow-600 hover:!to-orange-700 !shadow-xl hover:!shadow-2xl !transform hover:!scale-105"
          >
            <span className="flex items-center justify-center gap-2 font-bold">
              <span className="text-xl">⏪</span> Undo Move
            </span>
          </Button>

          {/* Resign */}
          <Button
            variant="danger"
            fullWidth
            size="lg"
            onClick={resignGame}
            disabled={isLoading || !isGameActive}
            className="!bg-gradient-to-r !from-red-500 !to-pink-600 hover:!from-red-600 hover:!to-pink-700 !shadow-xl hover:!shadow-2xl !transform hover:!scale-105"
          >
            <span className="flex items-center justify-center gap-2 font-bold">
              <span className="text-xl">🏳️</span> Resign
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}