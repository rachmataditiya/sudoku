export class SudokuSolver {
  public static solve(grid: number[][]): number[][] | null {
    const solution = grid.map(row => [...row]);
    
    if (this.solveSudoku(solution)) {
      return solution;
    }
    
    return null;
  }

  private static solveSudoku(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;
              
              if (this.solveSudoku(grid)) {
                return true;
              }
              
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private static isValid(grid: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  public static getHint(grid: number[][], solution: number[][]): { row: number, col: number, value: number } | null {
    const emptyCells: Array<{row: number, col: number}> = [];
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) return null;

    // Find a cell that has only one possible value
    for (const cell of emptyCells) {
      const possibleValues = this.getPossibleValues(grid, cell.row, cell.col);
      if (possibleValues.length === 1) {
        return {
          row: cell.row,
          col: cell.col,
          value: possibleValues[0]
        };
      }
    }

    // If no single-possibility cell found, return a random empty cell with its solution
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return {
      row: randomCell.row,
      col: randomCell.col,
      value: solution[randomCell.row][randomCell.col]
    };
  }

  private static getPossibleValues(grid: number[][], row: number, col: number): number[] {
    const possible: number[] = [];
    
    for (let num = 1; num <= 9; num++) {
      if (this.isValid(grid, row, col, num)) {
        possible.push(num);
      }
    }
    
    return possible;
  }
}
