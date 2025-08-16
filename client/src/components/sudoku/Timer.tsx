import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../../utils/indonesian';

interface TimerProps {
  startTime: number;
  isPaused: boolean;
  isComplete: boolean;
  endTime?: number;
}

export default function Timer({ startTime, isPaused, isComplete, endTime }: TimerProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (isPaused || isComplete || startTime === 0) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isComplete, startTime]);

  const getElapsedTime = () => {
    if (startTime === 0) return 0;
    
    if (isComplete && endTime) {
      return Math.floor((endTime - startTime) / 1000);
    }
    if (isPaused) {
      return Math.floor((currentTime - startTime) / 1000);
    }
    return Math.floor((currentTime - startTime) / 1000);
  };

  const elapsedSeconds = getElapsedTime();

  return (
    <div className="flex items-center gap-2 text-lg font-mono">
      <Clock className="h-5 w-5 text-blue-600" />
      <span className={`${isPaused ? 'text-yellow-600' : startTime === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
        {formatTime(elapsedSeconds)}
      </span>
      {isPaused && (
        <span className="text-xs text-yellow-600 ml-1">JEDA</span>
      )}
    </div>
  );
}
