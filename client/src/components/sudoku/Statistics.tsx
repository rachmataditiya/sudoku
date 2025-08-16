import { useStatistics } from '../../lib/stores/useStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BarChart3, 
  Clock, 
  Trophy, 
  Target, 
  RotateCcw,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  GAME_TEXTS, 
  DIFFICULTY_LABELS, 
  formatTime, 
  formatDuration, 
  formatDate 
} from '../../utils/indonesian';
import { Difficulty } from '../../types/sudoku';

export default function Statistics() {
  const stats = useStatistics();

  const totalGamesPlayed = stats.gamesPlayed.mudah + stats.gamesPlayed.sedang + stats.gamesPlayed.sulit;
  const totalGamesCompleted = stats.gamesCompleted.mudah + stats.gamesCompleted.sedang + stats.gamesCompleted.sulit;
  const overallCompletionRate = stats.getCompletionRate();

  const difficultyStats = (['mudah', 'sedang', 'sulit'] as Difficulty[]).map(difficulty => ({
    difficulty,
    played: stats.gamesPlayed[difficulty],
    completed: stats.gamesCompleted[difficulty],
    completionRate: stats.getCompletionRate(difficulty),
    bestTime: stats.bestTimes[difficulty],
    averageTime: stats.getAverageTime(difficulty)
  }));

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua statistik? Tindakan ini tidak dapat dibatalkan.')) {
      stats.reset();
    }
  };

  if (totalGamesPlayed === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {GAME_TEXTS.noGamesYet}
              </h3>
              <p className="text-gray-600">
                {GAME_TEXTS.playYourFirst}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{GAME_TEXTS.gamesPlayed}</p>
                <p className="text-xl font-bold text-gray-800">{totalGamesPlayed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{GAME_TEXTS.gamesCompleted}</p>
                <p className="text-xl font-bold text-gray-800">{totalGamesCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{GAME_TEXTS.completionRate}</p>
                <p className="text-xl font-bold text-gray-800">{overallCompletionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{GAME_TEXTS.totalPlayTime}</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatDuration(stats.totalPlayTime)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Played */}
      {stats.lastPlayed && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                {GAME_TEXTS.lastPlayed}: {formatDate(stats.lastPlayed)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Difficulty Breakdown */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Statistik per Tingkat Kesulitan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {difficultyStats.map(({ difficulty, played, completed, completionRate, bestTime, averageTime }) => (
            <div key={difficulty} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="min-w-0">
                    {DIFFICULTY_LABELS[difficulty]}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {played} dimainkan, {completed} selesai
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {completionRate}%
                </span>
              </div>
              
              <Progress value={completionRate} className="h-2" />
              
              {(bestTime || averageTime > 0) && (
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  {bestTime && (
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span>{GAME_TEXTS.bestTime}: {formatTime(bestTime)}</span>
                    </div>
                  )}
                  {averageTime > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{GAME_TEXTS.averageTime}: {formatTime(averageTime)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Reset Statistik</h4>
              <p className="text-sm text-gray-600">
                Hapus semua data statistik dan mulai dari awal
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
