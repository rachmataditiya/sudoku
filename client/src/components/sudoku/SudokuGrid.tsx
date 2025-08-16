import { useSudoku } from '../../lib/stores/useSudoku';
import SudokuCell from './SudokuCell';
import { useEffect, useCallback } from 'react';

export default function SudokuGrid() {
  const { grid, selectedCell, selectCell, clearSelection, setCell, clearCell, isPaused } = useSudoku();

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!selectedCell || isPaused) return;
    
    const { row, col } = selectedCell;
    
    // Number input
    if (event.key >= '1' && event.key <= '9') {
      const num = parseInt(event.key);
      setCell(row, col, num);
      event.preventDefault();
    }
    
    // Delete/Backspace to clear cell
    if (event.key === 'Delete' || event.key === 'Backspace') {
      clearCell(row, col);
      event.preventDefault();
    }
    
    // Arrow key navigation
    if (event.key === 'ArrowUp' && row > 0) {
      selectCell(row - 1, col);
      event.preventDefault();
    }
    if (event.key === 'ArrowDown' && row < 8) {
      selectCell(row + 1, col);
      event.preventDefault();
    }
    if (event.key === 'ArrowLeft' && col > 0) {
      selectCell(row, col - 1);
      event.preventDefault();
    }
    if (event.key === 'ArrowRight' && col < 8) {
      selectCell(row, col + 1);
      event.preventDefault();
    }
    
    // Escape to clear selection
    if (event.key === 'Escape') {
      clearSelection();
      event.preventDefault();
    }
  }, [selectedCell, isPaused, setCell, clearCell, selectCell, clearSelection]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle click outside grid to clear selection
  const handleGridClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      clearSelection();
    }
  };

  if (isPaused) {
    return (
      <div className="relative">
        <div className="grid grid-cols-9 gap-1 bg-gray-300 p-4 rounded-lg blur-sm">
          {grid.map((row, rowIndex) =>
            row.map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-12 h-12 bg-white border border-gray-400"
              />
            ))
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-gray-700">Game Dijeda</p>
            <p className="text-sm text-gray-600">Klik 'Lanjutkan' untuk melanjutkan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-9 gap-1 bg-gray-800 p-2 rounded-lg shadow-inner"
      onClick={handleGridClick}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // Determine border styling for 3x3 boxes
          const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex < 8;
          const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex < 8;
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          
          // Highlight related cells (same row, column, or 3x3 box)
          const isRelated = selectedCell && (
            selectedCell.row === rowIndex ||
            selectedCell.col === colIndex ||
            (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
             Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3))
          );

          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              isSelected={isSelected}
              isRelated={Boolean(isRelated && !isSelected)}
              isRightBorder={isRightBorder}
              isBottomBorder={isBottomBorder}
              onClick={() => selectCell(rowIndex, colIndex)}
            />
          );
        })
      )}
    </div>
  );
}
