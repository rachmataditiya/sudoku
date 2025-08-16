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
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={isGameRunning ? cancelGame : (onNewGame || (() => window.location.reload()))}
              variant={isGameRunning ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {isGameRunning ? 'Batalkan Permainan' : GAME_TEXTS.newGame}
            </Button>

            {!isComplete && (
              <Button
                onClick={isPaused ? resumeGame : pauseGame}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4" />
                    {GAME_TEXTS.resume}
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    {GAME_TEXTS.pause}
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={getHint}
              variant="outline"
              disabled={isComplete || isPaused}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {GAME_TEXTS.hint}
            </Button>

            <Button
              onClick={checkSolution}
              variant="outline"
              disabled={isComplete || isPaused}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              {GAME_TEXTS.check}
            </Button>

            <Button
              onClick={toggleNotesMode}
              variant={notesMode ? "default" : "outline"}
              disabled={isComplete || isPaused}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              {GAME_TEXTS.notes}
              {notesMode && <Badge variant="secondary" className="ml-1">ON</Badge>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Number Input */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {selectedCell 
                  ? `Sel terpilih: Baris ${selectedCell.row + 1}, Kolom ${selectedCell.col + 1}`
                  : 'Pilih sel untuk memasukkan angka'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              {/* Numbers 1-9 */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <Button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  disabled={isDisabled || isPaused}
                  variant="outline"
                  className={cn(
                    "aspect-square text-lg font-semibold",
                    "hover:bg-blue-50 hover:border-blue-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {num}
                </Button>
              ))}
              
              {/* Clear button */}
              <Button
                onClick={handleClearClick}
                disabled={isDisabled || isPaused}
                variant="outline"
                className="aspect-square flex items-center justify-center col-span-1"
              >
                <Eraser className="h-5 w-5" />
              </Button>
            </div>

            {notesMode && (
              <div className="text-center">
                <Badge variant="secondary" className="text-xs">
                  Mode Catatan Aktif - Klik angka untuk menambah/menghapus catatan
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
