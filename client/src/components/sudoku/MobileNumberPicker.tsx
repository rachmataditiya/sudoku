import { useSudoku } from '../../lib/stores/useSudoku';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { X, Edit3, Eraser } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileNumberPickerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function MobileNumberPicker({ isVisible, onClose }: MobileNumberPickerProps) {
  const {
    selectedCell,
    notesMode,
    isComplete,
    isPaused,
    setCell,
    clearCell,
    toggleNotesMode,
    grid
  } = useSudoku();

  if (!isVisible || !selectedCell || isComplete || isPaused) {
    return null;
  }

  const cell = grid[selectedCell.row][selectedCell.col];
  const isDisabled = cell.isOriginal;

  const handleNumberClick = (num: number) => {
    if (!isDisabled) {
      setCell(selectedCell.row, selectedCell.col, num);
      onClose();
    }
  };

  const handleClearClick = () => {
    if (!isDisabled) {
      clearCell(selectedCell.row, selectedCell.col);
      onClose();
    }
  };

  const handleNotesToggle = () => {
    toggleNotesMode();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Number Picker Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <Card className="rounded-t-3xl rounded-b-none border-t border-gray-200 bg-white shadow-xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="font-semibold text-gray-800">
                  Baris {selectedCell.row + 1}, Kolom {selectedCell.col + 1}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Value Display */}
            {cell.value !== 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Nilai saat ini: <span className="font-bold text-lg">{cell.value}</span>
                </p>
              </div>
            )}

            {/* Notes Mode Toggle */}
            <div className="mb-4">
              <Button
                onClick={handleNotesToggle}
                variant={notesMode ? "default" : "outline"}
                className={cn(
                  "w-full justify-center gap-2 py-3",
                  notesMode && "bg-amber-500 hover:bg-amber-600"
                )}
              >
                <Edit3 className="h-4 w-4" />
                {notesMode ? "Mode Catatan Aktif" : "Aktifkan Mode Catatan"}
              </Button>
              {notesMode && (
                <p className="text-xs text-center mt-2 text-amber-700">
                  Pilih angka untuk menambah/menghapus catatan
                </p>
              )}
            </div>

            {/* Number Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                const isInNotes = cell.notes.includes(num);
                const isCurrent = cell.value === num;
                
                return (
                  <Button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    disabled={isDisabled}
                    variant={isCurrent ? "default" : "outline"}
                    className={cn(
                      "aspect-square text-2xl font-bold h-16 relative",
                      "hover:bg-blue-50 hover:border-blue-300 transition-all",
                      isCurrent && "bg-blue-600 hover:bg-blue-700",
                      notesMode && isInNotes && !isCurrent && "bg-amber-100 border-amber-300",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {num}
                    {notesMode && isInNotes && !isCurrent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Clear Button */}
            <Button
              onClick={handleClearClick}
              disabled={isDisabled || cell.value === 0}
              variant="outline"
              className="w-full py-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <Eraser className="h-4 w-4 mr-2" />
              Hapus Nilai
            </Button>

            {/* Help Text */}
            <p className="text-xs text-center mt-4 text-gray-500">
              {isDisabled 
                ? "Sel ini adalah bagian dari puzzle asli dan tidak dapat diubah"
                : "Pilih angka atau hapus untuk mengosongkan sel"
              }
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
