'use client';

import { useState } from 'react';
import { useGame } from '@/app/context/GameContext';

const UndoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
  </svg>
);

const RedoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
  </svg>
);

const FlagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
  </svg>
);

export function GameControls() {
  const { startNewGame, undoMove, redoMove, resignGame, isLoading, gameState } = useGame();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const isGameActive = gameState && 
    !gameState.status.includes('checkmate') && 
    !gameState.status.includes('stalemate') &&
    !gameState.status.includes('resigned');

  const buttons = [
    {
      id: 'undo',
      icon: <UndoIcon />,
      label: 'Undo Move',
      description: 'Take back last move',
      onClick: undoMove,
      disabled: isLoading || !isGameActive || !gameState?.moveHistory.length,
      color: '#6b7280'
    },
    {
      id: 'redo',
      icon: <RedoIcon />,
      label: 'Redo Move',
      description: 'Restore undone move',
      onClick: redoMove,
      disabled: isLoading || !isGameActive,
      color: '#6b7280'
    },
    {
      id: 'resign',
      icon: <FlagIcon />,
      label: 'Resign Game',
      description: 'Forfeit the match',
      onClick: resignGame,
      disabled: isLoading || !isGameActive,
      color: '#ef4444'
    },
    {
      id: 'new-game',
      icon: <RefreshIcon />,
      label: 'New Game',
      description: 'Start fresh match',
      onClick: startNewGame,
      disabled: isLoading,
      color: '#4ade80'
    }
  ];

  return (
    <div 
      style={{
        background: '#2d3748',
        borderRadius: '10px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ 
          color: 'white', 
          fontWeight: '700', 
          fontSize: '16px', 
          margin: 0 
        }}>
          Game Controls
        </h3>
      </div>

      {/* Icon Buttons Row - HORIZONTAL */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          width: '100%'
        }}
      >
        {buttons.map((button) => (
          <div 
            key={button.id} 
            style={{
              flex: 1,
              position: 'relative'
            }}
          >
            {/* Button */}
            <button
              onClick={button.onClick}
              disabled={button.disabled}
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: button.disabled ? '#4b5563' : button.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: button.disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                padding: 0,
                margin: 0,
                position: 'relative',
                overflow: 'visible'
              }}
              onMouseEnter={() => !button.disabled && setHoveredButton(button.id)}
              onMouseLeave={() => setHoveredButton(null)}
              onMouseDown={(e) => {
                if (!button.disabled) {
                  e.currentTarget.style.transform = 'scale(0.9)';
                }
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* Icon with hover effect */}
              <div style={{
                transform: hoveredButton === button.id ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {button.icon}
              </div>
            </button>
            
            {/* Modal Popup Tooltip */}
            {hoveredButton === button.id && !button.disabled && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 12px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                  color: 'white',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  zIndex: 1000,
                  pointerEvents: 'none',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  animation: 'tooltipSlideUp 0.2s ease-out',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Title */}
                <div style={{
                  fontWeight: '700',
                  marginBottom: '2px',
                  color: button.color
                }}>
                  {button.label}
                </div>
                
                {/* Description */}
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  fontWeight: '400'
                }}>
                  {button.description}
                </div>
                
                {/* Arrow */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #1f2937'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Game Status Info */}
      {gameState && (
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingTop: '14px',
            borderTop: '1px solid #4b5563'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#9ca3af', fontWeight: '500' }}>Turn</span>
            <span style={{ color: 'white', fontWeight: '700' }}>
              {gameState.currentTurn === 'white' ? '⚪ White' : '⚫ Black'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#9ca3af', fontWeight: '500' }}>Move</span>
            <span style={{ color: 'white', fontWeight: '700' }}>{gameState.fullMoveNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#9ca3af', fontWeight: '500' }}>Status</span>
            <span style={{ 
              color: gameState.status === 'check' ? '#facc15' :
                     gameState.status.includes('checkmate') ? '#f87171' :
                     '#4ade80',
              fontWeight: '700'
            }}>
              {gameState.status === 'playing' ? 'Active' : 
               gameState.status.charAt(0).toUpperCase() + gameState.status.slice(1)}
            </span>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes tooltipSlideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}