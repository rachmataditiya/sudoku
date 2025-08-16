import { useSudoku } from '../../lib/stores/useSudoku';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Play, 
  Pause, 
  Lightbulb, 
  Check, 
  Edit3, 
  Plus,
  Eraser
} from 'lucide-react';
import { GAME_TEXTS } from '../../utils/indonesian';
import { cn } from '../../lib/utils';

interface GameControlsProps {
  onNewGame?: () => void;
}

export default function GameControls({ onNewGame }: GameControlsProps) {
  const {
    isPaused,
    isComplete,
    notesMode,
    selectedCell,
    startTime,
    pauseGame,
    resumeGame,
    getHint,
    checkSolution,
    toggleNotesMode,
    setCell,
    clearCell,
    cancelGame
  } = useSudoku();

  const handleNumberClick = (num: number) => {
    if (selectedCell && !isComplete) {
      setCell(selectedCell.row, selectedCell.col, num);
    }
  };

  const handleClearClick = () => {
    if (selectedCell && !isComplete) {
      clearCell(selectedCell.row, selectedCell.col);
    }
  };

  const isDisabled = isComplete || (!selectedCell && notesMode);
  
  // Check if game is currently running
  const isGameRunning = startTime > 0 && !isComplete;
  
  // Debug: console.log('GameControls render:', { startTime, isComplete, isGameRunning });

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={isGameRunning ? cancelGame : (onNewGame || (() => window.location.reload()))}
              variant={isGameRunning ? "destructive" : "default"}
              size="sm"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{isGameRunning ? 'Batalkan Permainan' : GAME_TEXTS.newGame}</span>
              <span className="sm:hidden">{isGameRunning ? 'Batal' : 'Baru'}</span>
            </Button>

            {!isComplete && (
              <Button
                onClick={isPaused ? resumeGame : pauseGame}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                {isPaused ? (
                  <>
                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{GAME_TEXTS.resume}</span>
                    <span className="sm:hidden">Main</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{GAME_TEXTS.pause}</span>
                    <span className="sm:hidden">Jeda</span>
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={getHint}
              variant="outline"
              size="sm"
              disabled={isComplete || isPaused}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{GAME_TEXTS.hint}</span>
              <span className="sm:hidden">Hint</span>
            </Button>

            <Button
              onClick={checkSolution}
              variant="outline"
              size="sm"
              disabled={isComplete || isPaused}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{GAME_TEXTS.check}</span>
              <span className="sm:hidden">Cek</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Instruction */}
      <Card className="bg-blue-50/90 backdrop-blur-sm border-blue-200">
        <CardContent className="p-3">
          <div className="text-center">
            <p className="text-sm text-blue-700">
              {selectedCell 
                ? `Pilih sel Baris ${selectedCell.row + 1}, Kolom ${selectedCell.col + 1} untuk memasukkan angka`
                : '👆 Ketuk sel kosong untuk memasukkan angka'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
