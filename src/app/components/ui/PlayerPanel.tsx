import { Piece } from '../chess/PieceComponent';

interface PlayerPanelProps {
  color: 'white' | 'black';
  playerName: string;
  isActive: boolean;
  capturedPieces: string[];
}

export function PlayerPanel({ color, playerName, isActive, capturedPieces }: PlayerPanelProps) {
  const pieceValues: Record<string, number> = {
    pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9
  };

  const materialValue = capturedPieces.reduce(
    (sum, piece) => sum + (pieceValues[piece] || 0), 0
  );
  
  const capturedPieceColor = color === 'white' ? 'black' : 'white';

  return (
    <>
      <div className={`player-panel ${isActive ? 'player-panel--active' : ''}`}>
        {/* Player Info */}
        <div className="player-info">
          <div className={`player-avatar ${color === 'white' ? 'player-avatar--white' : 'player-avatar--black'}`}>
            {color === 'white' ? '⚪' : '⚫'}
          </div>
          <div className="player-details">
            <div className="player-name">{playerName}</div>
            <div className="player-color-label">{color === 'white' ? 'White' : 'Black'}</div>
          </div>
          {materialValue > 0 && (
            <span className="material-advantage">
              +{materialValue}
            </span>
          )}
        </div>

        {/* Captured Pieces - Show opponent's pieces that THIS player captured */}
        {capturedPieces.length > 0 && (
          <div className="captured-pieces">
            {capturedPieces.slice(0, 16).map((pieceType, index) => (
              <div key={index} className="captured-piece">
                <Piece 
                  type={pieceType} 
                  color={capturedPieceColor}
                  size={16} 
                />
              </div>
            ))}
            {capturedPieces.length > 16 && (
              <span className="captured-overflow">
                +{capturedPieces.length - 16}
              </span>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .player-panel {
          background: #2d3748;
          border-radius: 8px;
          padding: 8px;
          border: ${isActive ? '2px solid #4ade80' : '2px solid transparent'};
          transition: all 0.3s;
          width: 100%;
        }

        .player-info {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .player-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          background: ${color === 'white' ? '#e5e7eb' : '#1f2937'};
          color: ${color === 'white' ? '#1f2937' : 'white'};
          flex-shrink: 0;
        }

        .player-avatar--white {
          background: #e5e7eb;
          color: #1f2937;
        }

        .player-avatar--black {
          background: #1f2937;
          color: white;
        }

        .player-details {
          flex: 1;
          min-width: 0;
        }

        .player-name {
          color: white;
          font-weight: 600;
          font-size: 12px;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .player-color-label {
          color: #9ca3af;
          font-size: 10px;
          line-height: 1.2;
        }

        .material-advantage {
          color: #4ade80;
          font-size: 11px;
          font-weight: bold;
          background: rgba(74, 222, 128, 0.2);
          padding: 2px 5px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .captured-pieces {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          background: rgba(0,0,0,0.2);
          padding: 4px;
          border-radius: 4px;
          min-height: 28px;
        }

        .captured-piece {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .captured-overflow {
          color: #9ca3af;
          font-size: 10px;
          font-weight: bold;
          align-self: center;
        }

        /* RESPONSIVE */
        @media (max-width: 767px) {
          .player-panel {
            padding: 10px;
          }

          .player-avatar {
            width: 28px;
            height: 28px;
            font-size: 16px;
          }

          .player-name {
            font-size: 13px;
          }

          .player-color-label {
            font-size: 11px;
          }
        }

        @media (max-width: 599px) {
          .player-info {
            margin-bottom: 8px;
          }

          .captured-pieces {
            padding: 6px;
          }
        }
      `}</style>
    </>
  );
}