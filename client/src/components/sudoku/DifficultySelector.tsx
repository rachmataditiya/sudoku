import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Loader2, Zap, Target, Flame } from 'lucide-react';
import { Difficulty } from '../../types/sudoku';
import { GAME_TEXTS, DIFFICULTY_LABELS, DIFFICULTY_DESCRIPTIONS } from '../../utils/indonesian';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  isLoading: boolean;
}

const difficultyConfigs = [
  {
    level: 'mudah' as Difficulty,
    icon: Zap,
    color: 'bg-green-500 hover:bg-green-600',
    description: DIFFICULTY_DESCRIPTIONS.mudah,
    cellsShown: '40-45 angka'
  },
  {
    level: 'sedang' as Difficulty,
    icon: Target,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    description: DIFFICULTY_DESCRIPTIONS.sedang,
    cellsShown: '30-35 angka'
  },
  {
    level: 'sulit' as Difficulty,
    icon: Flame,
    color: 'bg-red-500 hover:bg-red-600',
    description: DIFFICULTY_DESCRIPTIONS.sulit,
    cellsShown: '20-25 angka'
  }
];

export default function DifficultySelector({ onSelect, isLoading }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const handleSelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    onSelect(difficulty);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {GAME_TEXTS.generating}
              </h3>
              <p className="text-gray-600 mt-2">
                Membuat puzzle {selectedDifficulty ? DIFFICULTY_LABELS[selectedDifficulty].toLowerCase() : ''}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gray-800">
          {GAME_TEXTS.selectDifficulty}
        </CardTitle>
        <p className="text-gray-600">
          Pilih tingkat kesulitan untuk memulai permainan Sudoku
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-4 max-w-2xl mx-auto">
          {difficultyConfigs.map(({ level, icon: Icon, color, description, cellsShown }) => (
            <Card
              key={level}
              className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-2 hover:border-blue-300"
              onClick={() => handleSelect(level)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full text-white ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {DIFFICULTY_LABELS[level]}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {cellsShown}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {description}
                    </p>
                  </div>
                  
                  <Button className={color}>
                    Pilih
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 Tips: Mulai dengan tingkat Mudah jika Anda baru mengenal Sudoku</p>
        </div>
      </CardContent>
    </Card>
  );
}
