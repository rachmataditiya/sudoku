export type Difficulty = 'mudah' | 'sedang' | 'sulit';

export interface SudokuCell {
  value: number;
  isOriginal: boolean;
  isError: boolean;
  notes: number[];
}

export interface GameState {
  grid: SudokuCell[][];
  solution: number[][];
  difficulty: Difficulty;
  startTime: number;
  endTime?: number;
  isComplete: boolean;
  isPaused: boolean;
}

export interface GameStatistics {
  gamesPlayed: {
    mudah: number;
    sedang: number;
    sulit: number;
  };
  gamesCompleted: {
    mudah: number;
    sedang: number;
    sulit: number;
  };
  bestTimes: {
    mudah?: number;
    sedang?: number;
    sulit?: number;
  };
  averageTimes: {
    mudah: number[];
    sedang: number[];
    sulit: number[];
  };
  totalPlayTime: number;
  lastPlayed?: number;
}

export interface DifficultyConfig {
  name: string;
  displayName: string;
  cellsToRemove: number;
  description: string;
}
