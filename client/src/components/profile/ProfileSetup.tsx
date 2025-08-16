import { useState } from 'react';
import { useProfile } from '../../lib/stores/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { User, GamepadIcon, Trophy, Settings } from 'lucide-react';

export default function ProfileSetup() {
  const { createProfile } = useProfile();
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      createProfile(name);
    }
  };

  const handleSkip = () => {
    createProfile('Pemain Sudoku');
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <GamepadIcon className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-gray-800">
              Selamat Datang di Sudoku Indonesia!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Mari buat profile Anda untuk pengalaman bermain yang lebih personal
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Trophy className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Pencapaian & Level</p>
                  <p className="text-sm text-gray-600">Kumpulkan XP dan buka pencapaian</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">Profile Personal</p>
                  <p className="text-sm text-gray-600">Data tersimpan di device Anda</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-800">Pengaturan</p>
                  <p className="text-sm text-gray-600">Sesuaikan preferensi game</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(2)} className="flex-1">
                Buat Profile
              </Button>
              <Button onClick={handleSkip} variant="outline">
                Lewati
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-800">
            Buat Profile Anda
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Berikan nama untuk memulai perjalanan Sudoku Anda
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nama Pemain
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="text-center text-lg"
                maxLength={20}
                autoFocus
              />
              <p className="text-xs text-gray-500 text-center">
                Minimal 2 karakter, maksimal 20 karakter
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium text-gray-800">{name || 'Nama Anda'}</p>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">Level 1</Badge>
                    <span className="text-xs text-gray-500">0 XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full"
                disabled={name.trim().length < 2}
              >
                Mulai Bermain
              </Button>
              
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={() => setStep(1)}
              >
                Kembali
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}