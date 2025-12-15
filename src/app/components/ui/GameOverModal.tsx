'use client';

import React from 'react';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  winner: 'white' | 'black' | 'draw';
  reason: string;
}

export function GameOverModal({
  isOpen,
  onClose,
  onNewGame,
  winner,
  reason,
}: GameOverModalProps) {
  if (!isOpen) return null;

  const getTitle = () => {
    if (winner === 'draw') return 'Game Draw';
    return winner === 'white' ? 'White Wins!' : 'Black Wins!';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2d3748] rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-600">
        <div className="text-center">
          {/* Winner Icon */}
          <div className="text-8xl mb-6">
            {winner === 'white' ? '♔' : winner === 'black' ? '♚' : '🤝'}
          </div>
          
          {/* Title */}
          <h2 className="text-4xl font-bold mb-3 text-white">
            {getTitle()}
          </h2>
          
          {/* Reason */}
          <p className="text-gray-400 text-lg mb-8 capitalize">
            {reason.replace('_', ' ')}
          </p>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Review
            </button>
            <button
              onClick={onNewGame}
              className="flex-1 bg-[#4ade80] hover:bg-[#22c55e] text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}