import { useState } from 'react';
import { useProfile } from '../../lib/stores/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { 
  User, 
  Trophy, 
  Settings, 
  Star, 
  Target,
  Flame,
  Calendar,
  Award,
  Edit3,
  RotateCcw
} from 'lucide-react';
import { formatDate } from '../../utils/indonesian';

export default function Profile() {
  const { 
    profile, 
    updateProfile, 
    updatePreferences, 
    resetProfile,
    getLevelFromExperience,
    getExperienceForNextLevel
  } = useProfile();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.name || '');

  if (!profile) return null;

  const currentLevel = getLevelFromExperience(profile.experience);
  const nextLevelExp = getExperienceForNextLevel(currentLevel + 1);
  const currentLevelExp = getExperienceForNextLevel(currentLevel);
  const progressToNext = ((profile.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;

  const achievementLabels = {
    firstWin: 'Kemenangan Pertama',
    speedSolver: 'Solver Cepat',
    perfectionist: 'Perfeksionis',
    persistent: 'Gigih',
    expert: 'Ahli Sudoku',
    dedicated: 'Berdedikasi',
    marathoner: 'Marathoner',
  };

  const achievementDescriptions = {
    firstWin: 'Selesaikan permainan pertama Anda',
    speedSolver: 'Selesaikan dalam waktu kurang dari 5 menit',
    perfectionist: 'Selesaikan tanpa menggunakan petunjuk',
    persistent: 'Selesaikan 10 permainan',
    expert: 'Selesaikan tingkat sulit',
    dedicated: 'Bermain selama 7 hari berturut-turut',
    marathoner: 'Total waktu bermain 24 jam',
  };

  const handleNameEdit = () => {
    if (editingName && newName.trim().length >= 2) {
      updateProfile({ name: newName.trim() });
    }
    setEditingName(!editingName);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset profile? Semua data akan hilang.')) {
      resetProfile();
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-xl font-bold bg-transparent border-b border-gray-300 outline-none"
                      maxLength={20}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleNameEdit}>
                      Simpan
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                    <Button size="sm" variant="ghost" onClick={handleNameEdit}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-blue-600">Level {currentLevel}</Badge>
                <span className="text-sm text-gray-600">{profile.experience} XP</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress ke Level {currentLevel + 1}</span>
                  <span>{nextLevelExp - profile.experience} XP lagi</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Pencapaian
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Statistik
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Pengaturan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Pencapaian Anda
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              {Object.entries(achievementLabels).map(([key, label]) => {
                const achieved = profile.achievements[key as keyof typeof profile.achievements];
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      achieved 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      achieved ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${achieved ? 'text-gray-800' : 'text-gray-500'}`}>
                        {label}
                      </p>
                      <p className={`text-sm ${achieved ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievementDescriptions[key as keyof typeof achievementDescriptions]}
                      </p>
                    </div>
                    {achieved && <Badge variant="secondary" className="bg-yellow-100">Tercapai</Badge>}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Streak & Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{profile.streaks.current}</p>
                  <p className="text-sm text-gray-600">Streak Saat Ini</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{profile.streaks.longest}</p>
                  <p className="text-sm text-gray-600">Streak Terpanjang</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Bergabung</p>
                  <p className="text-sm text-gray-600">{formatDate(profile.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Terakhir Aktif</p>
                  <p className="text-sm text-gray-600">{formatDate(profile.lastActiveAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferensi Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="text-sm font-medium">
                  Suara Game
                </Label>
                <Switch
                  id="sound"
                  checked={profile.preferences.soundEnabled}
                  onCheckedChange={(checked) => 
                    updatePreferences({ soundEnabled: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="vibration" className="text-sm font-medium">
                  Getaran
                </Label>
                <Switch
                  id="vibration"
                  checked={profile.preferences.vibrationEnabled}
                  onCheckedChange={(checked) => 
                    updatePreferences({ vibrationEnabled: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="hints" className="text-sm font-medium">
                  Tampilkan Petunjuk
                </Label>
                <Switch
                  id="hints"
                  checked={profile.preferences.showHints}
                  onCheckedChange={(checked) => 
                    updatePreferences({ showHints: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="animations" className="text-sm font-medium">
                  Animasi
                </Label>
                <Switch
                  id="animations"
                  checked={profile.preferences.animationsEnabled}
                  onCheckedChange={(checked) => 
                    updatePreferences({ animationsEnabled: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autosave" className="text-sm font-medium">
                  Auto Save
                </Label>
                <Switch
                  id="autosave"
                  checked={profile.preferences.autoSave}
                  onCheckedChange={(checked) => 
                    updatePreferences({ autoSave: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-600">Zona Bahaya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Reset Profile</p>
                  <p className="text-sm text-gray-600">
                    Hapus semua data profile dan mulai dari awal
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}