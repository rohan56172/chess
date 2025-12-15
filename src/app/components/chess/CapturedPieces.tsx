import { Piece } from './PieceComponent';

interface CapturedPiecesProps {
  whiteCaptured: string[];
  blackCaptured: string[];
}

/**
 * Modern Horizontal Captured Pieces
 */
export function CapturedPieces({ whiteCaptured, blackCaptured }: CapturedPiecesProps) {
  const pieceValues: Record<string, number> = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0,
  };

  const calculateMaterialAdvantage = () => {
    const whiteValue = whiteCaptured.reduce((sum, piece) => sum + (pieceValues[piece] || 0), 0);
    const blackValue = blackCaptured.reduce((sum, piece) => sum + (pieceValues[piece] || 0), 0);
    return whiteValue - blackValue;
  };

  const materialAdvantage = calculateMaterialAdvantage();

  return (
    <div className="glass rounded-3xl p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Black's Captures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚫</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Black</div>
                <div className="text-gray-400 text-xs">Captured</div>
              </div>
            </div>
            {materialAdvantage > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                +{materialAdvantage}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 min-h-[70px] bg-white/5 rounded-2xl p-3">
            {whiteCaptured.length === 0 ? (
              <div className="w-full text-center py-4">
                <span className="text-gray-500 text-sm">No captures</span>
              </div>
            ) : (
              whiteCaptured.map((pieceType, index) => (
                <div 
                  key={`white-${index}`} 
                  className="bg-white/10 rounded-xl p-2 hover:bg-white/20 transition-all transform hover:scale-110 cursor-pointer"
                >
                  <Piece type={pieceType} color="white" size={32} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* White's Captures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚪</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">White</div>
                <div className="text-gray-400 text-xs">Captured</div>
              </div>
            </div>
            {materialAdvantage < 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                +{Math.abs(materialAdvantage)}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 min-h-[70px] bg-white/5 rounded-2xl p-3">
            {blackCaptured.length === 0 ? (
              <div className="w-full text-center py-4">
                <span className="text-gray-500 text-sm">No captures</span>
              </div>
            ) : (
              blackCaptured.map((pieceType, index) => (
                <div 
                  key={`black-${index}`} 
                  className="bg-white/10 rounded-xl p-2 hover:bg-white/20 transition-all transform hover:scale-110 cursor-pointer"
                >
                  <Piece type={pieceType} color="black" size={32} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Material Balance */}
      {materialAdvantage === 0 && (whiteCaptured.length > 0 || blackCaptured.length > 0) && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <span className="text-gray-400 text-sm">⚖️ Material is equal</span>
        </div>
      )}
    </div>
  );
}