import React, { useState, useEffect, useCallback } from 'react';
import { useBeep } from './hooks/useBeep';
import { PlusIcon, ResetIcon, LockIcon } from './components/icons';

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<string>('');
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const { play: playBeep, unlockAudio } = useBeep(523.25, 150, 80); // C5 note

  const targetValue = target === '' ? NaN : parseInt(target, 10);
  const isTargetReached = !isNaN(targetValue) && count === targetValue;

  useEffect(() => {
    if (isTargetReached) {
      playBeep();
    }
  }, [isTargetReached, playBeep]);

  const handleInteraction = useCallback(() => {
    if (!isAudioUnlocked) {
      unlockAudio();
      setIsAudioUnlocked(true);
    }
  }, [isAudioUnlocked, unlockAudio]);

  const handleIncrement = () => {
    handleInteraction();
    if (isTargetReached) {
      playBeep(); // Play beep but don't increment if target is already reached
    } else {
      setCount(prev => prev + 1);
    }
  };

  const handleReset = () => {
    handleInteraction();
    setCount(0);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allow digits
        setTarget(value);
    }
  };

  const counterTextColor = isTargetReached ? 'text-emerald-400' : 'text-slate-100';
  const counterShadow = isTargetReached ? 'shadow-[0_0_30px_theme(colors.emerald.500/0.7)]' : '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 font-sans">
      <div className="relative w-full max-w-sm mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 text-center space-y-8">
        <button
            onClick={handleReset}
            aria-label="Reset count"
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-10"
        >
            <ResetIcon className="w-6 h-6" />
        </button>

        <header>
          <h1 className="text-3xl font-bold text-slate-100">Beep Counter</h1>
          <p className="text-slate-400 mt-1">Stops and beeps at target</p>
        </header>

        <div className={`relative w-48 h-48 mx-auto flex items-center justify-center bg-slate-900 rounded-full border-4 border-slate-700 transition-all duration-300 ${counterShadow}`}>
          <span className={`text-7xl font-bold tracking-tighter transition-colors duration-300 ${counterTextColor}`}>
            {count}
          </span>
          {isTargetReached && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg animate-pulse">
                <LockIcon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <div className="space-y-6">
            <div>
                <label htmlFor="target" className="block text-sm font-medium text-slate-400 mb-2">Beep and lock at value</label>
                <input
                    id="target"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={target}
                    onChange={handleTargetChange}
                    placeholder="e.g., 50"
                    className="w-full bg-slate-700 text-slate-100 text-center text-lg rounded-md px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
            </div>

            <div className="pt-4">
                <button
                    onClick={handleIncrement}
                    aria-label="Increment count"
                    className="w-full h-24 flex items-center justify-center bg-emerald-600 text-white rounded-2xl hover:bg-emerald-500 active:bg-emerald-700 transition-all duration-200 transform hover:scale-105 active:scale-100 shadow-lg shadow-emerald-600/30"
                >
                    <PlusIcon className="w-12 h-12" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
