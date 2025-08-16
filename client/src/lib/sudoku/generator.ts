import { Difficulty } from '../../types/sudoku';

export class SudokuGenerator {
  private grid: number[][];
  
  constructor() {
    this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
  }

  private isValid(grid: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  private solveSudoku(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          
          for (const num of numbers) {
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

  private generateCompleteGrid(): number[][] {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    this.solveSudoku(grid);
    return grid;
  }

  private removeNumbers(grid: number[][], difficulty: Difficulty): number[][] {
    const cellsToRemove = this.getCellsToRemove(difficulty);
    const puzzle = grid.map(row => [...row]);
    
    let removed = 0;
    const attempts = cellsToRemove * 3; // Prevent infinite loop
    let attemptCount = 0;

    while (removed < cellsToRemove && attemptCount < attempts) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== 0) {
        const backup = puzzle[row][col];
        puzzle[row][col] = 0;
        
        // Check if puzzle still has unique solution
        if (this.hasUniqueSolution(puzzle)) {
          removed++;
        } else {
          puzzle[row][col] = backup;
        }
      }
      attemptCount++;
    }

    return puzzle;
  }

  private getCellsToRemove(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'mudah': return 40;
      case 'sedang': return 50;
      case 'sulit': return 60;
      default: return 50;
    }
  }

  private hasUniqueSolution(grid: number[][]): boolean {
    // Simplified check - in a production app, you'd want a more sophisticated algorithm
    const testGrid = grid.map(row => [...row]);
    let solutionCount = 0;
    
    const solve = (): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (testGrid[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (this.isValid(testGrid, row, col, num)) {
                testGrid[row][col] = num;
                
                if (solve()) {
                  solutionCount++;
                  if (solutionCount > 1) return false; // More than one solution
                }
                
                testGrid[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    solve();
    return solutionCount === 1;
  }

  public generate(difficulty: Difficulty): { puzzle: number[][], solution: number[][] } {
    const solution = this.generateCompleteGrid();
    const puzzle = this.removeNumbers(solution, difficulty);
    
    return {
      puzzle: puzzle.map(row => [...row]),
      solution: solution.map(row => [...row])
    };
  }
}
