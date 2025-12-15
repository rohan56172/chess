'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { GameProvider, useGame } from '@/app/context/GameContext';
import { ChessBoard } from '@/app/components/chess/ChessBoard';
import { PlayerPanel } from '@/app/components/ui/PlayerPanel';
import { MoveHistory } from '@/app/components/chess/MoveHistory';
import { GameControls } from '@/app/components/ui/GameControls';
import { GameOverModal } from '@/app/components/ui/GameOverModal';
import { PromotionDialog } from '@/app/components/ui/PromotionDialog';
import { TurnNotification } from '@/app/components/ui/TurnNotification';
import { PieceType } from '@/domain/value-objects/PieceType';
import { PieceColor } from '@/domain/value-objects/PieceColor';

function GamePage() {
  const { 
    startNewGame, 
    gameState,
    pendingPromotion,
    makeMove,
    cancelPromotion,
    showInvalidTurnNotification,
    hideInvalidTurnNotification
  } = useGame();
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const gameStatus = gameState?.status ?? null;
  const isGameOver = useMemo(() => {
    if (!gameStatus) return false;
    
    return (
      gameStatus.includes('checkmate') ||
      gameStatus.includes('stalemate') ||
      gameStatus.includes('draw') ||
      gameStatus.includes('resigned')
    );
  }, [gameStatus]);

  useEffect(() => {
    setShowGameOverModal(isGameOver);
  }, [isGameOver]);

  const handleNewGame = useCallback(() => {
    setShowGameOverModal(false);
    startNewGame();
  }, [startNewGame]);

  const getWinner = useCallback((): 'white' | 'black' | 'draw' => {
    if (!gameState) return 'draw';
    
    if (gameState.status.includes('draw') || gameState.status.includes('stalemate')) {
      return 'draw';
    }
    
    if (gameState.status === 'checkmate') {
      return gameState.currentTurn === 'white' ? 'black' : 'white';
    }
    
    if (gameState.status === 'resigned') {
      return gameState.currentTurn === 'white' ? 'black' : 'white';
    }
    
    return 'draw';
  }, [gameState]);

  const handlePromotionSelect = useCallback(async (pieceType: PieceType) => {
    if (pendingPromotion) {
      await makeMove(pendingPromotion.from, pendingPromotion.to, pieceType);
    }
  }, [pendingPromotion, makeMove]);

  const getCurrentPlayerName = useCallback(() => {
    if (!gameState) return 'Player';
    return gameState.currentTurn === 'white' ? 'Player 1' : 'Player 2';
  }, [gameState]);

  if (!gameState) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>♟️</div>
          <div style={{ color: 'white', fontSize: '20px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Header */}
      <header className="game-header">
        <h1 className="game-title">Chess App</h1>
      </header>

      {/* Show only on invalid turn attempt */}
      <TurnNotification
        currentTurn={gameState.currentTurn}
        playerName={getCurrentPlayerName()}
        show={showInvalidTurnNotification}
        onClose={hideInvalidTurnNotification}
      />

      {/* Main Content */}
      <div className="main-content">
        
        {/* Left Side - Board Area */}
        <div className="board-area">
          {/* Chess Board */}
          <div className="board-wrapper">
            <ChessBoard />
          </div>

          {/* Player Panels */}
          <div className="player-panels">
            <div className="player-panel-top">
              <PlayerPanel
                color="black"
                playerName="Player 2"
                isActive={gameState.currentTurn === 'black'}
                capturedPieces={gameState.capturedPieces.white}
              />
            </div>

            <div className="player-panel-bottom">
              <PlayerPanel
                color="white"
                playerName="Player 1"
                isActive={gameState.currentTurn === 'white'}
                capturedPieces={gameState.capturedPieces.black}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="sidebar">
          <MoveHistory />
          <GameControls />
        </div>
      </div>

      {/* Promotion Dialog */}
      {pendingPromotion && (
        <PromotionDialog
          isOpen={true}
          color={gameState.currentTurn === 'white' ? PieceColor.White : PieceColor.Black}
          onSelect={handlePromotionSelect}
          onCancel={cancelPromotion}
        />
      )}

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        onNewGame={handleNewGame}
        winner={getWinner()}
        reason={gameState.status}
      />
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GamePage />
    </GameProvider>
  );
}