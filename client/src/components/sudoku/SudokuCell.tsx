import { SudokuCell as CellType } from '../../types/sudoku';
import { cn } from '../../lib/utils';

interface SudokuCellProps {
  cell: CellType;
  row: number;
  col: number;
  isSelected: boolean;
  isRelated: boolean;
  isRightBorder: boolean;
  isBottomBorder: boolean;
  onClick: () => void;
}

export default function SudokuCell({
  cell,
  row,
  col,
  isSelected,
  isRelated,
  isRightBorder,
  isBottomBorder,
  onClick
}: SudokuCellProps) {
  const { value, isOriginal, isError, notes } = cell;

  return (
    <button
      className={cn(
        "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 relative transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
        // Base styling
        "bg-white border border-gray-300 hover:bg-gray-50",
        // Selection and relation highlighting
        isSelected && "bg-blue-100 border-blue-500 ring-2 ring-blue-300",
        isRelated && !isSelected && "bg-blue-50",
        // Original cells styling
        isOriginal && "bg-gray-100 font-bold text-gray-800",
        // Error styling
        isError && "bg-red-100 border-red-500 text-red-700",
        // 3x3 box borders
        isRightBorder && "border-r-2 border-r-gray-800",
        isBottomBorder && "border-b-2 border-b-gray-800",
        // Typography
        "text-sm sm:text-lg font-medium"
      )}
      onClick={onClick}
      disabled={isOriginal}
    >
      {value !== 0 ? (
        <span className={cn(
          "absolute inset-0 flex items-center justify-center",
          isOriginal ? "text-gray-800" : "text-blue-600",
          isError && "text-red-600"
        )}>
          {value}
        </span>
      ) : notes.length > 0 ? (
        <div className="absolute inset-0 p-0.5">
          <div className="grid grid-cols-3 gap-0 text-xs text-gray-500 h-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <div
                key={num}
                className="flex items-center justify-center"
                style={{
                  fontSize: '10px',
                  lineHeight: 1
                }}
              >
                {notes.includes(num) ? num : ''}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </button>
  );
}
