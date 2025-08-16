import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface PlayerProfile {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  experience: number;
  createdAt: number;
  lastActiveAt: number;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    autoSave: boolean;
    showHints: boolean;
    animationsEnabled: boolean;
  };
  achievements: {
    firstWin: boolean;
    speedSolver: boolean; // Complete in under 5 minutes
    perfectionist: boolean; // Complete without hints
    persistent: boolean; // Complete 10 games
    expert: boolean; // Complete hard level
    dedicated: boolean; // Play for 7 consecutive days
    marathoner: boolean; // Play for total 24 hours
  };
  streaks: {
    current: number;
    longest: number;
    lastPlayDate?: string; // YYYY-MM-DD format
  };
}

interface ProfileStore {
  profile: PlayerProfile | null;
  isProfileSetup: boolean;
  
  // Actions
  createProfile: (name: string) => void;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  updatePreferences: (preferences: Partial<PlayerProfile['preferences']>) => void;
  addExperience: (amount: number) => void;
  updateStreak: () => void;
  unlockAchievement: (achievement: keyof PlayerProfile['achievements']) => void;
  resetProfile: () => void;
  
  // Getters
  getLevelFromExperience: (exp: number) => number;
  getExperienceForNextLevel: (currentLevel: number) => number;
}

const defaultPreferences: PlayerProfile['preferences'] = {
  theme: 'auto',
  soundEnabled: true,
  vibrationEnabled: true,
  autoSave: true,
  showHints: true,
  animationsEnabled: true,
};

const defaultAchievements: PlayerProfile['achievements'] = {
  firstWin: false,
  speedSolver: false,
  perfectionist: false,
  persistent: false,
  expert: false,
  dedicated: false,
  marathoner: false,
};

// Experience calculation: 100 XP per level, with increasing requirements
const calculateLevel = (experience: number): number => {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

const calculateExperienceForLevel = (level: number): number => {
  return Math.pow(level - 1, 2) * 100;
};

// Custom persistence for profile data
const loadProfile = (): { profile: PlayerProfile | null; isProfileSetup: boolean } => {
  try {
    const saved = localStorage.getItem('sudoku-player-profile');
    if (saved) {
      const data = JSON.parse(saved);
      return { profile: data, isProfileSetup: true };
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
  return { profile: null, isProfileSetup: false };
};

const saveProfile = (profile: PlayerProfile | null) => {
  try {
    if (profile) {
      localStorage.setItem('sudoku-player-profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('sudoku-player-profile');
    }
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

export const useProfile = create<ProfileStore>()(
  subscribeWithSelector((set, get) => ({
    ...loadProfile(),

      createProfile: (name: string) => {
        const newProfile: PlayerProfile = {
          id: crypto.randomUUID(),
          name: name.trim(),
          level: 1,
          experience: 0,
          createdAt: Date.now(),
          lastActiveAt: Date.now(),
          preferences: { ...defaultPreferences },
          achievements: { ...defaultAchievements },
          streaks: {
            current: 0,
            longest: 0,
          },
        };

        set({
          profile: newProfile,
          isProfileSetup: true,
        });
        saveProfile(newProfile);
      },

      updateProfile: (updates: Partial<PlayerProfile>) => {
        const { profile } = get();
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          ...updates,
          lastActiveAt: Date.now(),
        };

        set({ profile: updatedProfile });
        saveProfile(updatedProfile);
      },

      updatePreferences: (preferences: Partial<PlayerProfile['preferences']>) => {
        const { profile } = get();
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          preferences: {
            ...profile.preferences,
            ...preferences,
          },
          lastActiveAt: Date.now(),
        };

        set({ profile: updatedProfile });
        saveProfile(updatedProfile);
      },

      addExperience: (amount: number) => {
        const { profile } = get();
        if (!profile) return;

        const newExperience = profile.experience + amount;
        const newLevel = calculateLevel(newExperience);
        const levelUp = newLevel > profile.level;

        const updatedProfile = {
          ...profile,
          experience: newExperience,
          level: newLevel,
          lastActiveAt: Date.now(),
        };

        set({ profile: updatedProfile });
        saveProfile(updatedProfile);

        // Show level up notification if applicable
        if (levelUp && typeof window !== 'undefined') {
          // Could trigger a level up animation/notification
          console.log(`Naik level! Level ${newLevel}`);
        }
      },

      updateStreak: () => {
        const { profile } = get();
        if (!profile) return;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        let newCurrent = 1;
        
        if (profile.streaks.lastPlayDate === yesterday) {
          // Continue streak
          newCurrent = profile.streaks.current + 1;
        } else if (profile.streaks.lastPlayDate === today) {
          // Already played today
          newCurrent = profile.streaks.current;
        }
        // else: streak broken, start new

        const newLongest = Math.max(profile.streaks.longest, newCurrent);

        const updatedProfile = {
          ...profile,
          streaks: {
            current: newCurrent,
            longest: newLongest,
            lastPlayDate: today,
          },
          lastActiveAt: Date.now(),
        };

        set({ profile: updatedProfile });
        saveProfile(updatedProfile);

        // Check for streak achievements
        if (newCurrent >= 7) {
          get().unlockAchievement('dedicated');
        }
      },

      unlockAchievement: (achievement: keyof PlayerProfile['achievements']) => {
        const { profile } = get();
        if (!profile || profile.achievements[achievement]) return;

        const updatedProfile = {
          ...profile,
          achievements: {
            ...profile.achievements,
            [achievement]: true,
          },
          lastActiveAt: Date.now(),
        };

        set({ profile: updatedProfile });
        saveProfile(updatedProfile);

        // Show achievement notification
        if (typeof window !== 'undefined') {
          console.log(`Pencapaian baru: ${achievement}`);
        }
      },

      resetProfile: () => {
        set({
          profile: null,
          isProfileSetup: false,
        });
        saveProfile(null);
      },

      getLevelFromExperience: calculateLevel,
      getExperienceForNextLevel: calculateExperienceForLevel,
    })
  )
);