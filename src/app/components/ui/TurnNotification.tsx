'use client';

import { useEffect } from 'react';

interface TurnNotificationProps {
  currentTurn: 'white' | 'black';
  playerName: string;
  show: boolean;
  onClose: () => void;
}

export function TurnNotification({ currentTurn, playerName, show, onClose }: TurnNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const color = currentTurn === 'white' ? '#f3f4f6' : '#1f2937';
  const textColor = currentTurn === 'white' ? '#1f2937' : '#f3f4f6';


  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: `linear-gradient(135deg, ${color} 0%, ${currentTurn === 'white' ? '#e5e7eb' : '#111827'} 100%)`,
        padding: '16px 32px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        border: `2px solid ${currentTurn === 'white' ? '#d1d5db' : '#374151'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 9999,
        animation: 'slideDown 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        minWidth: '300px',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Icon */}
      <div style={{
        fontSize: '32px',
        animation: 'shake 0.5s ease-in-out'
      }}>
        ⚠️
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          color: textColor, 
          fontWeight: '700', 
          fontSize: '16px',
          marginBottom: '4px'
        }}>
          Not Your Turn!
        </div>
        <div style={{ 
          color: currentTurn === 'white' ? '#6b7280' : '#9ca3af', 
          fontSize: '13px' 
        }}>
          {/* Show whose turn it is */}
          It&apos;s {playerName}&apos;s turn ({currentTurn === 'white' ? 'White' : 'Black'})
        </div>
      </div>

      {/* Timer indicator */}
      <div style={{
        width: '4px',
        height: '48px',
        background: `linear-gradient(to bottom, ${currentTurn === 'white' ? '#3b82f6' : '#ef4444'} 0%, transparent 100%)`,
        borderRadius: '2px',
        animation: 'shrink 3s linear'
      }} />

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes shrink {
          from {
            height: 48px;
          }
          to {
            height: 0px;
          }
        }
      `}</style>
    </div>
  );
}