'use client';

import { PieceType } from '@/domain/value-objects/PieceType';
import { PieceColor } from '@/domain/value-objects/PieceColor';

interface PromotionDialogProps {
  isOpen: boolean;
  color: PieceColor;
  onSelect: (pieceType: PieceType) => void;
  onCancel: () => void;
}

/**
 * Promotion Dialog Component
 * 
 * Modal dialog for selecting pawn promotion piece
 */
export function PromotionDialog({ isOpen, color, onSelect, onCancel }: PromotionDialogProps) {
  if (!isOpen) return null;

  const promotionOptions = [
    { type: PieceType.Queen, label: 'Queen', symbol: color === 'white' ? '♕' : '♛' },
    { type: PieceType.Rook, label: 'Rook', symbol: color === 'white' ? '♖' : '♜' },
    { type: PieceType.Bishop, label: 'Bishop', symbol: color === 'white' ? '♗' : '♝' },
    { type: PieceType.Knight, label: 'Knight', symbol: color === 'white' ? '♘' : '♞' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '500px',
            width: '90%',
            animation: 'scaleIn 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 
              style={{ 
                color: 'white', 
                fontSize: '24px', 
                fontWeight: '700',
                marginBottom: '8px'
              }}
            >
              🎊 Pawn Promotion!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              Choose a piece to promote your pawn
            </p>
          </div>

          {/* Promotion Options */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '20px'
            }}
          >
            {promotionOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => onSelect(option.type)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = '#4ade80';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '48px' }}>{option.symbol}</span>
                <span style={{ 
                  color: 'white', 
                  fontSize: '12px', 
                  fontWeight: '600' 
                }}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}