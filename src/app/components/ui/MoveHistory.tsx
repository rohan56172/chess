import { useGame } from '@/app/context/GameContext';
import { Card } from './Card';

/**
 * Move History Component
 * 
 * Displays list of moves in chess notation
 */
export function MoveHistory() {
  const { gameState } = useGame();

  if (!gameState || gameState.moveHistory.length === 0) {
    return (
      <Card title="Move History">
        <p className="text-gray-500 text-center">No moves yet</p>
      </Card>
    );
  }

  const movePairs: Array<{ white: string; black?: string }> = [];
  
  for (let i = 0; i < gameState.moveHistory.length; i += 2) {
    movePairs.push({
      white: gameState.moveHistory[i].notation,
      black: gameState.moveHistory[i + 1]?.notation,
    });
  }

  return (
    <Card title="Move History">
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="py-2 px-3 text-left">#</th>
              <th className="py-2 px-3 text-left">White</th>
              <th className="py-2 px-3 text-left">Black</th>
            </tr>
          </thead>
          <tbody>
            {movePairs.map((pair, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-500">{index + 1}</td>
                <td className="py-2 px-3 font-mono">{pair.white}</td>
                <td className="py-2 px-3 font-mono">{pair.black || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}