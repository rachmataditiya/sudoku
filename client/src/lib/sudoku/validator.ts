export class SudokuValidator {
  public static isValidMove(grid: number[][], row: number, col: number, num: number): boolean {
    // Check if the cell is already filled
    if (grid[row][col] !== 0) {
      return false;
    }

    // Check row
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) {
        return false;
      }
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = startRow + i;
        const currentCol = startCol + j;
        if ((currentRow !== row || currentCol !== col) && 
            grid[currentRow][currentCol] === num) {
          return false;
        }
      }
    }

    return true;
  }

  public static validateGrid(grid: number[][]): { isValid: boolean, errors: Array<{row: number, col: number}> } {
    const errors: Array<{row: number, col: number}> = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const num = grid[row][col];
        if (num !== 0) {
          // Temporarily remove the number to check if it's valid in this position
          const tempGrid = grid.map(r => [...r]);
          tempGrid[row][col] = 0;
          
          if (!this.isValidMove(tempGrid, row, col, num)) {
            errors.push({ row, col });
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static isComplete(grid: number[][]): boolean {
    // Check if all cells are filled
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          return false;
        }
      }
    }

    // Check if the solution is valid
    return this.validateGrid(grid).isValid;
  }

  public static getConflicts(grid: number[][], row: number, col: number): Array<{row: number, col: number}> {
    const conflicts: Array<{row: number, col: number}> = [];
    const num = grid[row][col];
    
    if (num === 0) return conflicts;

    // Check row conflicts
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) {
        conflicts.push({ row, col: x });
      }
    }

    // Check column conflicts
    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) {
        conflicts.push({ row: x, col });
      }
    }

    // Check 3x3 box conflicts
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = startRow + i;
        const currentCol = startCol + j;
        if (currentRow !== row && currentCol !== col && 
            grid[currentRow][currentCol] === num) {
          conflicts.push({ row: currentRow, col: currentCol });
        }
      }
    }

    return conflicts;
  }
}
