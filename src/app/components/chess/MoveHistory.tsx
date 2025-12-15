import { useGame } from '@/app/context/GameContext';

export function MoveHistory() {
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
    <div style={{
      background: '#2d3748',
      borderRadius: '10px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 55%',
      minHeight: 0
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: '#1a2332',
        borderBottom: '1px solid #4b5563',
        flexShrink: 0
      }}>
        <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '15px', marginBottom: '2px' }}>
          Move History
        </h3>
        {gameState.moveHistory.length > 0 && (
          <p style={{ color: '#9ca3af', fontSize: '12px' }}>
            {gameState.moveHistory.length} moves
          </p>
        )}
      </div>

      {/* Moves List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px',
        minHeight: 0
      }}>
        {movePairs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            paddingTop: '80px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            No moves yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {movePairs.map((pair, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: index === movePairs.length - 1 ? 'rgba(74, 222, 128, 0.2)' : 'transparent',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (index !== movePairs.length - 1) {
                    e.currentTarget.style.background = '#1a2332';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== movePairs.length - 1) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ width: '32px', color: '#9ca3af', fontSize: '14px', fontWeight: 500 }}>
                  {index + 1}.
                </div>
                <div style={{ flex: 1, fontFamily: 'monospace', color: 'white', fontSize: '14px', fontWeight: 600 }}>
                  {pair.white}
                </div>
                <div style={{ flex: 1, fontFamily: 'monospace', color: 'white', fontSize: '14px', fontWeight: 600 }}>
                  {pair.black || '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}