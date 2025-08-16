import { Difficulty } from '../types/sudoku';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  mudah: 'Mudah',
  sedang: 'Sedang',
  sulit: 'Sulit'
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  mudah: 'Untuk pemula - banyak angka yang sudah diisi',
  sedang: 'Tingkat menengah - keseimbangan tantangan dan kemudahan',
  sulit: 'Untuk ahli - sedikit petunjuk, banyak pemikiran'
};

export const GAME_TEXTS = {
  newGame: 'Permainan Baru',
  pause: 'Jeda',
  resume: 'Lanjutkan',
  restart: 'Ulang',
  hint: 'Petunjuk',
  solve: 'Selesaikan',
  check: 'Periksa',
  clear: 'Hapus',
  notes: 'Catatan',
  time: 'Waktu',
  difficulty: 'Tingkat Kesulitan',
  congratulations: 'Selamat!',
  gameCompleted: 'Permainan Selesai!',
  yourTime: 'Waktu Anda',
  newRecord: 'Rekor Baru!',
  statistics: 'Statistik',
  gamesPlayed: 'Permainan Dimainkan',
  gamesCompleted: 'Permainan Selesai',
  completionRate: 'Tingkat Penyelesaian',
  bestTime: 'Waktu Terbaik',
  averageTime: 'Waktu Rata-rata',
  totalPlayTime: 'Total Waktu Bermain',
  lastPlayed: 'Terakhir Dimainkan',
  noGamesYet: 'Belum ada permainan',
  playYourFirst: 'Mainkan permainan pertama Anda!',
  errors: 'Kesalahan',
  hintsUsed: 'Petunjuk Digunakan',
  invalidMove: 'Gerakan tidak valid',
  duplicateNumber: 'Angka sudah ada di baris, kolom, atau kotak',
  cellAlreadyFilled: 'Sel sudah terisi',
  gameNotStarted: 'Permainan belum dimulai',
  gamePaused: 'Permainan dijeda',
  selectDifficulty: 'Pilih tingkat kesulitan untuk memulai',
  loading: 'Memuat...',
  generating: 'Membuat puzzle...',
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}j ${mins}m ${secs}d`;
  } else if (mins > 0) {
    return `${mins}m ${secs}d`;
  } else {
    return `${secs}d`;
  }
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return 'Hari ini';
  } else if (days === 1) {
    return 'Kemarin';
  } else if (days < 7) {
    return `${days} hari yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};
