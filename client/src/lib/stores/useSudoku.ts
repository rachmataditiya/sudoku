import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SudokuCell, Difficulty, GameState } from '../../types/sudoku';
import { SudokuGenerator } from '../sudoku/generator';
import { SudokuValidator } from '../sudoku/validator';
import { SudokuSolver } from '../sudoku/solver';
import { useProfile } from './useProfile';
import { useStatistics } from './useStatistics';

interface SudokuStore extends GameState {
  // Game actions
  newGame: (difficulty: Difficulty) => void;
  setCell: (row: number, col: number, value: number) => void;
  clearCell: (row: number, col: number) => void;
  toggleNote: (row: number, col: number, note: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  cancelGame: () => void;
  getHint: () => void;
  checkSolution: () => void;
  
  // UI state
  selectedCell: { row: number; col: number } | null;
  notesMode: boolean;
  hintsUsed: number;
  errors: Array<{ row: number; col: number }>;
  isGenerating: boolean;
  
  // Actions for UI state
  selectCell: (row: number, col: number) => void;
  toggleNotesMode: () => void;
  clearSelection: () => void;
}

const createEmptyGrid = (): SudokuCell[][] => {
  return Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({
      value: 0,
      isOriginal: false,
      isError: false,
      notes: []
    }))
  );
};

export const useSudoku = create<SudokuStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    grid: createEmptyGrid(),
    solution: Array(9).fill(null).map(() => Array(9).fill(0)),
    difficulty: 'mudah',
    startTime: 0,
    endTime: undefined,
    isComplete: false,
    isPaused: false,
    selectedCell: null,
    notesMode: false,
    hintsUsed: 0,
    errors: [],
    isGenerating: false,

    newGame: async (difficulty: Difficulty) => {
      set({ isGenerating: true, errors: [] });
      
      try {
        const generator = new SudokuGenerator();
        const { puzzle, solution } = generator.generate(difficulty);
        
        const grid: SudokuCell[][] = puzzle.map((row, rowIndex) =>
          row.map((cell, colIndex) => ({
            value: cell,
            isOriginal: cell !== 0,
            isError: false,
            notes: []
          }))
        );

        const newStartTime = Date.now();
        console.log('Setting new game with startTime:', newStartTime);
        
        set({
          grid,
          solution,
          difficulty,
          startTime: newStartTime,
          endTime: undefined,
          isComplete: false,
          isPaused: false,
          selectedCell: null,
          notesMode: false,
          hintsUsed: 0,
          errors: [],
          isGenerating: false
        });

        // Save game state to localStorage
        const gameState = {
          grid,
          solution,
          difficulty,
          startTime: Date.now(),
          hintsUsed: 0
        };
        localStorage.setItem('sudoku-current-game', JSON.stringify(gameState));
      } catch (error) {
        console.error('Error generating sudoku:', error);
        set({ isGenerating: false });
      }
    },

    setCell: (row: number, col: number, value: number) => {
      const state = get();
      if (state.isPaused || state.isComplete) return;
      
      const cell = state.grid[row][col];
      if (cell.isOriginal) return;

      const newGrid = state.grid.map(r => [...r]);
      
      if (state.notesMode) {
        // Toggle note
        const notes = [...cell.notes];
        const noteIndex = notes.indexOf(value);
        if (noteIndex === -1) {
          notes.push(value);
        } else {
          notes.splice(noteIndex, 1);
        }
        newGrid[row][col] = { ...cell, notes: notes.sort() };
      } else {
        // Set cell value
        const isValid = value === 0 || SudokuValidator.isValidMove(
          state.grid.map(r => r.map(c => c.value)), 
          row, 
          col, 
          value
        );
        
        newGrid[row][col] = {
          ...cell,
          value,
          isError: !isValid && value !== 0,
          notes: value !== 0 ? [] : cell.notes // Clear notes when setting value
        };
      }

      // Check for completion
      const gridValues = newGrid.map(r => r.map(c => c.value));
      const isComplete = SudokuValidator.isComplete(gridValues);
      
      const updates: Partial<SudokuStore> = {
        grid: newGrid,
        isComplete
      };

      if (isComplete) {
        updates.endTime = Date.now();
        
        // Award experience and achievements
        const profile = useProfile.getState().profile;
        if (profile) {
          const gameTime = Math.floor((Date.now() - state.startTime) / 1000);
          const baseXP = state.difficulty === 'mudah' ? 50 : state.difficulty === 'sedang' ? 100 : 200;
          const timeBonus = gameTime < 300 ? 50 : gameTime < 600 ? 25 : 0; // Speed bonus
          const hintPenalty = state.hintsUsed * 5;
          const totalXP = Math.max(baseXP + timeBonus - hintPenalty, 25);
          
          useProfile.getState().addExperience(totalXP);
          useProfile.getState().updateStreak();
          
          // Unlock achievements
          const profileState = useProfile.getState();
          if (!profile.achievements.firstWin) {
            profileState.unlockAchievement('firstWin');
          }
          if (gameTime < 300) {
            profileState.unlockAchievement('speedSolver');
          }
          if (state.hintsUsed === 0) {
            profileState.unlockAchievement('perfectionist');
          }
          if (state.difficulty === 'sulit') {
            profileState.unlockAchievement('expert');
          }
        }
        
        // Clear saved game when completed
        localStorage.removeItem('sudoku-current-game');
      } else {
        // Save current state
        const gameState = {
          grid: newGrid,
          solution: state.solution,
          difficulty: state.difficulty,
          startTime: state.startTime,
          hintsUsed: state.hintsUsed
        };
        localStorage.setItem('sudoku-current-game', JSON.stringify(gameState));
      }

      set(updates);
    },

    clearCell: (row: number, col: number) => {
      const state = get();
      if (state.isPaused || state.isComplete) return;
      
      const cell = state.grid[row][col];
      if (cell.isOriginal) return;

      state.setCell(row, col, 0);
    },

    toggleNote: (row: number, col: number, note: number) => {
      const state = get();
      if (state.isPaused || state.isComplete) return;
      
      const cell = state.grid[row][col];
      if (cell.isOriginal || cell.value !== 0) return;

      const notes = [...cell.notes];
      const noteIndex = notes.indexOf(note);
      
      if (noteIndex === -1) {
        notes.push(note);
      } else {
        notes.splice(noteIndex, 1);
      }

      const newGrid = state.grid.map(r => [...r]);
      newGrid[row][col] = { ...cell, notes: notes.sort() };

      set({ grid: newGrid });
    },

    pauseGame: () => {
      set({ isPaused: true });
    },

    resumeGame: () => {
      set({ isPaused: false });
    },

    restartGame: () => {
      const state = get();
      const newGrid = state.grid.map(row =>
        row.map(cell => ({
          ...cell,
          value: cell.isOriginal ? cell.value : 0,
          isError: false,
          notes: []
        }))
      );

      set({
        grid: newGrid,
        startTime: Date.now(),
        endTime: undefined,
        isComplete: false,
        isPaused: false,
        selectedCell: null,
        hintsUsed: 0,
        errors: []
      });
    },

    cancelGame: () => {
      // Record incomplete game if one was in progress
      const state = get();
      if (state.startTime && !state.isComplete && !state.isPaused) {
        const timeInSeconds = Math.floor((Date.now() - state.startTime) / 1000);
        const { recordGame } = useStatistics.getState();
        recordGame(state.difficulty, timeInSeconds, false, state.hintsUsed);
      }
      
      // Reset to initial state
      set({
        grid: createEmptyGrid(),
        solution: Array(9).fill(null).map(() => Array(9).fill(0)),
        difficulty: 'mudah',
        startTime: 0,
        endTime: undefined,
        isComplete: false,
        isPaused: false,
        selectedCell: null,
        notesMode: false,
        hintsUsed: 0,
        errors: [],
        isGenerating: false
      });
      
      // Clear saved game
      localStorage.removeItem('sudoku-current-game');
    },

    getHint: () => {
      const state = get();
      if (state.isPaused || state.isComplete) return;

      const gridValues = state.grid.map(r => r.map(c => c.value));
      const hint = SudokuSolver.getHint(gridValues, state.solution);
      
      if (hint) {
        state.setCell(hint.row, hint.col, hint.value);
        set({ hintsUsed: state.hintsUsed + 1 });
      }
    },

    checkSolution: () => {
      const state = get();
      const gridValues = state.grid.map(r => r.map(c => c.value));
      const { errors } = SudokuValidator.validateGrid(gridValues);
      
      // Update grid with error states
      const newGrid = state.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => ({
          ...cell,
          isError: errors.some(error => error.row === rowIndex && error.col === colIndex)
        }))
      );

      set({ grid: newGrid, errors });
    },

    selectCell: (row: number, col: number) => {
      set({ selectedCell: { row, col } });
    },

    toggleNotesMode: () => {
      set(state => ({ notesMode: !state.notesMode }));
    },

    clearSelection: () => {
      set({ selectedCell: null });
    }
  }))
);

// Auto-save functionality
useSudoku.subscribe(
  (state) => state.grid,
  (grid) => {
    const state = useSudoku.getState();
    if (!state.isComplete && !state.isGenerating && state.startTime > 0) {
      const gameState = {
        grid,
        solution: state.solution,
        difficulty: state.difficulty,
        startTime: state.startTime,
        hintsUsed: state.hintsUsed
      };
      localStorage.setItem('sudoku-current-game', JSON.stringify(gameState));
    }
  }
);

// Load saved game on initialization
const savedGame = localStorage.getItem('sudoku-current-game');
if (savedGame) {
  try {
    const gameState = JSON.parse(savedGame);
    // Only load if it's a valid game session
    if (gameState.startTime && gameState.startTime > 0) {
      useSudoku.setState({
        grid: gameState.grid,
        solution: gameState.solution,
        difficulty: gameState.difficulty,
        startTime: gameState.startTime,
        hintsUsed: gameState.hintsUsed || 0,
        isComplete: false,
        isPaused: false
      });
    }
  } catch (error) {
    console.error('Error loading saved game:', error);
    localStorage.removeItem('sudoku-current-game');
  }
}
