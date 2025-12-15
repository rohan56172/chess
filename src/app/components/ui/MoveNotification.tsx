'use client';

import { useEffect, useState } from 'react';

interface MoveNotificationProps {
  message: string;
  type: 'castling' | 'promotion' | 'capture' | 'check' | 'checkmate';
  onClose: () => void;
}

export function MoveNotification({ message, type, onClose }: MoveNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'castling':
        return '🏰';
      case 'promotion':
        return '👑';
      case 'capture':
        return '⚔️';
      case 'check':
        return '⚠️';
      case 'checkmate':
        return '🎯';
      default:
        return '✓';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'castling':
        return '#8b5cf6';
      case 'promotion':
        return '#f59e0b';
      case 'capture':
        return '#ef4444';
      case 'check':
        return '#facc15';
      case 'checkmate':
        return '#dc2626';
      default:
        return '#4ade80';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: `2px solid ${getColor()}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 9999,
        animation: 'slideInRight 0.3s ease-out',
        minWidth: '250px'
      }}
    >
      <span style={{ fontSize: '32px' }}>{getIcon()}</span>
      <div style={{ flex: 1 }}>
        <div style={{ 
          color: 'white', 
          fontWeight: '700', 
          fontSize: '14px',
          marginBottom: '4px'
        }}>
          {type.charAt(0).toUpperCase() + type.slice(1)}!
        </div>
        <div style={{ color: '#9ca3af', fontSize: '12px' }}>
          {message}
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '4px'
        }}
      >
        ✕
      </button>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}