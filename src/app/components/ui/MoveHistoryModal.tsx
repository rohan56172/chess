import React from 'react';
import { useGame } from '@/app/context/GameContext';

interface MoveHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Move History Modal - Slides up from bottom
 */
export function MoveHistoryModal({ isOpen, onClose }: MoveHistoryModalProps) {
  const { gameState } = useGame();

  if (!gameState) return null;

  const movePairs: Array<{ white: string; black?: string }> = [];
  for (let i = 0; i < gameState.moveHistory.length; i += 2) {
    movePairs.push({
      white: gameState.moveHistory[i].notation,
      black: gameState.moveHistory[i + 1]?.notation,
    });
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <div 
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-slate-900 rounded-t-3xl shadow-2xl
          transform transition-transform duration-300
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-xl">Move History</h3>
            <p className="text-gray-400 text-sm">{gameState.moveHistory.length} moves</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Moves List */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {movePairs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-6xl mb-4">♟️</div>
              <p>No moves yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {movePairs.map((pair, index) => (
                <div 
                  key={index}
                  className={`
                    glass rounded-xl p-4 hover:bg-white/10 transition-all
                    ${index === movePairs.length - 1 ? 'ring-2 ring-blue-500/50' : ''}
                  `}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Move Number */}
                    <div className="col-span-2 text-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                    
                    {/* White Move */}
                    <div className="col-span-5">
                      <div className="bg-white/10 rounded-lg px-4 py-3">
                        <div className="text-gray-400 text-xs mb-1">White</div>
                        <div className="font-mono text-white font-bold text-lg">{pair.white}</div>
                      </div>
                    </div>
                    
                    {/* Black Move */}
                    <div className="col-span-5">
                      <div className="bg-white/10 rounded-lg px-4 py-3">
                        <div className="text-gray-400 text-xs mb-1">Black</div>
                        <div className="font-mono text-white font-bold text-lg">{pair.black || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}