import { useState, useEffect } from 'react';
import { useSudoku } from '../../lib/stores/useSudoku';
import { useStatistics } from '../../lib/stores/useStatistics';
import SudokuGrid from './SudokuGrid';
import GameControls from './GameControls';
import Timer from './Timer';
import DifficultySelector from './DifficultySelector';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Trophy, Clock, Zap, RotateCcw } from 'lucide-react';
import { GAME_TEXTS, formatTime, DIFFICULTY_LABELS } from '../../utils/indonesian';
import { Difficulty } from '../../types/sudoku';

export default function SudokuGame() {
  const {
    grid,
    difficulty,
    startTime,
    endTime,
    isComplete,
    isPaused,
    hintsUsed,
    newGame,
    restartGame,
    isGenerating
  } = useSudoku();

  const { recordGame } = useStatistics();
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Handle game completion
  useEffect(() => {
    if (isComplete && endTime) {
      const timeInSeconds = Math.floor((endTime - startTime) / 1000);
      setGameTime(timeInSeconds);
      
      // Record the completed game
      recordGame(difficulty, timeInSeconds, true, hintsUsed);
      
      // Check if it's a new record
      const stats = useStatistics.getState();
      const previousBest = stats.bestTimes[difficulty];
      setIsNewRecord(!previousBest || timeInSeconds < previousBest);
      
      setShowCompleteDialog(true);
    }
  }, [isComplete, endTime, startTime, difficulty, hintsUsed, recordGame]);

  const handleNewGame = (selectedDifficulty: Difficulty) => {
    // Record incomplete game if one was in progress
    if (startTime && !isComplete && !isPaused) {
      const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
      recordGame(difficulty, timeInSeconds, false, hintsUsed);
    }
    
    newGame(selectedDifficulty);
  };

  const handleRestart = () => {
    restartGame();
  };

  const handleCompleteDialogClose = () => {
    setShowCompleteDialog(false);
  };

  if (startTime === 0) {
    return <DifficultySelector onSelect={handleNewGame} isLoading={isGenerating} />;
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {DIFFICULTY_LABELS[difficulty]}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="h-4 w-4" />
                <span>{GAME_TEXTS.hintsUsed}: {hintsUsed}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Timer startTime={startTime} isPaused={isPaused} isComplete={isComplete} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {GAME_TEXTS.restart}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Board */}
      <div className="flex justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-6">
            <SudokuGrid />
          </CardContent>
        </Card>
      </div>

      {/* Game Controls */}
      <GameControls />

      {/* Completion Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-green-600 flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6" />
              {GAME_TEXTS.congratulations}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-center">
            <p className="text-lg font-semibold text-gray-700">
              {GAME_TEXTS.gameCompleted}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>{GAME_TEXTS.yourTime}: {formatTime(gameTime)}</span>
              </div>
              
              {isNewRecord && (
                <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                  🏆 {GAME_TEXTS.newRecord}
                </Badge>
              )}
              
              <div className="text-sm text-gray-600">
                <p>{DIFFICULTY_LABELS[difficulty]} • {GAME_TEXTS.hintsUsed}: {hintsUsed}</p>
              </div>
            </div>

            <div className="flex gap-2 justify-center pt-4">
              <Button onClick={handleCompleteDialogClose} variant="outline">
                Tutup
              </Button>
              <Button onClick={() => {
                handleCompleteDialogClose();
                window.location.reload();
              }}>
                {GAME_TEXTS.newGame}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
