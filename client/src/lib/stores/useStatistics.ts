import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Difficulty, GameStatistics } from '../../types/sudoku';
import { useProfile } from './useProfile';

interface StatisticsStore extends GameStatistics {
  recordGame: (difficulty: Difficulty, timeInSeconds: number, completed: boolean, hintsUsed: number) => void;
  getCompletionRate: (difficulty?: Difficulty) => number;
  getAverageTime: (difficulty: Difficulty) => number;
  reset: () => void;
}

const defaultStatistics: GameStatistics = {
  gamesPlayed: { mudah: 0, sedang: 0, sulit: 0 },
  gamesCompleted: { mudah: 0, sedang: 0, sulit: 0 },
  bestTimes: {},
  averageTimes: { mudah: [], sedang: [], sulit: [] },
  totalPlayTime: 0,
  lastPlayed: undefined
};

const loadStatistics = (): GameStatistics => {
  try {
    const saved = localStorage.getItem('sudoku-statistics');
    if (saved) {
      return { ...defaultStatistics, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
  return defaultStatistics;
};

const saveStatistics = (stats: GameStatistics) => {
  try {
    localStorage.setItem('sudoku-statistics', JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving statistics:', error);
  }
};

export const useStatistics = create<StatisticsStore>()(
  subscribeWithSelector((set, get) => ({
    ...loadStatistics(),

  recordGame: (difficulty: Difficulty, timeInSeconds: number, completed: boolean, hintsUsed: number) => {
    set(state => {
      const newStats = {
        ...state,
        gamesPlayed: {
          ...state.gamesPlayed,
          [difficulty]: state.gamesPlayed[difficulty] + 1
        },
        totalPlayTime: state.totalPlayTime + timeInSeconds,
        lastPlayed: Date.now()
      };

      if (completed) {
        newStats.gamesCompleted = {
          ...state.gamesCompleted,
          [difficulty]: state.gamesCompleted[difficulty] + 1
        };

        // Update best time
        const currentBest = state.bestTimes[difficulty];
        if (!currentBest || timeInSeconds < currentBest) {
          newStats.bestTimes = {
            ...state.bestTimes,
            [difficulty]: timeInSeconds
          };
        }

        // Add to average times (keep last 10 games for rolling average)
        const times = [...state.averageTimes[difficulty], timeInSeconds];
        if (times.length > 10) {
          times.shift();
        }
        newStats.averageTimes = {
          ...state.averageTimes,
          [difficulty]: times
        };
      }

      // Check for persistent achievement
      const totalCompleted = newStats.gamesCompleted.mudah + newStats.gamesCompleted.sedang + newStats.gamesCompleted.sulit;
      if (totalCompleted >= 10) {
        const profile = useProfile.getState().profile;
        if (profile && !profile.achievements.persistent) {
          useProfile.getState().unlockAchievement('persistent');
        }
      }
      
      // Check for marathoner achievement
      if (newStats.totalPlayTime >= 86400) { // 24 hours in seconds
        const profile = useProfile.getState().profile;
        if (profile && !profile.achievements.marathoner) {
          useProfile.getState().unlockAchievement('marathoner');
        }
      }
      
      saveStatistics(newStats);
      return newStats;
    });
  },

  getCompletionRate: (difficulty?: Difficulty) => {
    const state = get();
    
    if (difficulty) {
      const played = state.gamesPlayed[difficulty];
      const completed = state.gamesCompleted[difficulty];
      return played > 0 ? Math.round((completed / played) * 100) : 0;
    } else {
      const totalPlayed = state.gamesPlayed.mudah + state.gamesPlayed.sedang + state.gamesPlayed.sulit;
      const totalCompleted = state.gamesCompleted.mudah + state.gamesCompleted.sedang + state.gamesCompleted.sulit;
      return totalPlayed > 0 ? Math.round((totalCompleted / totalPlayed) * 100) : 0;
    }
  },

  getAverageTime: (difficulty: Difficulty) => {
    const state = get();
    const times = state.averageTimes[difficulty];
    if (times.length === 0) return 0;
    
    const sum = times.reduce((acc, time) => acc + time, 0);
    return Math.round(sum / times.length);
  },

  reset: () => {
    const resetStats = { ...defaultStatistics };
    set(resetStats);
    saveStatistics(resetStats);
  }
  })
));
