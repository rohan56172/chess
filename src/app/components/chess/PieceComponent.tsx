interface PieceProps {
  type: string;
  color: 'white' | 'black';
  size?: number;
}

export function Piece({ type, color, size = 60 }: PieceProps) {
  const pieces: Record<string, Record<'white' | 'black', string>> = {
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    knight: { white: '♘', black: '♞' },
    pawn: { white: '♙', black: '♟' },
  };

  const piece = pieces[type]?.[color] || '?';

  return (
    <div
      style={{
        fontSize: `${size}px`,
        lineHeight: 1,
        userSelect: 'none',
        color: color === 'white' ? '#ffffff' : '#000000',
        textShadow: color === 'white' 
          ? '0 2px 4px rgba(0, 0, 0, 0.4), 0 0 1px rgba(0, 0, 0, 0.6)' 
          : '0 2px 4px rgba(255, 255, 255, 0.3), 0 0 1px rgba(255, 255, 255, 0.4)',
        filter: color === 'white'
          ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
          : 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.2))',
        fontWeight: 400,
        transition: 'transform 0.2s ease'
      }}
    >
      {piece}
    </div>
  );
}