import React, { useState, useCallback } from 'react';
import { Volume2, VolumeX, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { useAudio } from './hooks/useAudio';
import BingoBoard from './components/BingoBoard';
import DrawnDisplay from './components/DrawnDisplay';
import HistoryList from './components/HistoryList';

export default function App() {
  const [maxBalls, setMaxBalls] = useState(75);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [isRolling, setIsRolling] = useState(false);

  const { soundEnabled, setSoundEnabled, playClick, playDraw } = useAudio();

  const isGameOver = drawnNumbers.length >= maxBalls;

  const handleModeChange = (mode) => {
    if (isRolling) return;
    playClick();
    setMaxBalls(mode);
    setDrawnNumbers([]);
  };

  const handleDraw = () => {
    if (isRolling || isGameOver) return;

    setIsRolling(true);

    playDraw(() => {
      setDrawnNumbers((prev) => {
        // Find remaining numbers
        const allNumbers = Array.from({ length: maxBalls }, (_, i) => i + 1);
        const available = allNumbers.filter((n) => !prev.includes(n));
        
        if (available.length === 0) {
          setIsRolling(false);
          return prev;
        }

        // Select a random number
        const randomIndex = Math.floor(Math.random() * available.length);
        const nextNumber = available[randomIndex];

        setIsRolling(false);
        return [...prev, nextNumber];
      });
    });
  };

  const handleReset = () => {
    if (isRolling) return;
    playClick();
    // Ask for simple confirmation if many numbers were drawn
    if (drawnNumbers.length > 5) {
      if (!window.confirm('Tem certeza de que deseja reiniciar o jogo atual?')) {
        return;
      }
    }
    setDrawnNumbers([]);
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    // If enabling sound, play a click to confirm
    if (nextState) {
      setTimeout(() => {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(600, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
      }, 50);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/5">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
              BINGO <span className="text-violet-400 font-medium text-sm px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20">Sorteador</span>
            </h1>
          </div>
        </div>

        {/* Global Settings & Toggles */}
        <div className="flex items-center gap-4">
          
          {/* Game Mode Select */}
          <div className="bg-white/5 p-1 rounded-xl border border-white/5 flex gap-1">
            <button
              onClick={() => handleModeChange(75)}
              disabled={isRolling}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                maxBalls === 75
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-gray-400 hover:text-white cursor-pointer'
              }`}
            >
              75 Bolas
            </button>
            <button
              onClick={() => handleModeChange(90)}
              disabled={isRolling}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                maxBalls === 90
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-gray-400 hover:text-white cursor-pointer'
              }`}
            >
              90 Bolas
            </button>
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              soundEnabled
                ? 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/25'
                : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
            }`}
            title={soundEnabled ? 'Desativar som' : 'Ativar som'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sorter Display & History */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <DrawnDisplay
              lastDrawn={drawnNumbers[drawnNumbers.length - 1]}
              isRolling={isRolling}
              maxBalls={maxBalls}
              onDraw={handleDraw}
              onReset={handleReset}
              isGameOver={isGameOver}
              totalDrawn={drawnNumbers.length}
            />

            <HistoryList
              drawnNumbers={drawnNumbers}
              maxBalls={maxBalls}
            />
          </div>

          {/* Right Column: Bingo Board */}
          <div className="lg:col-span-7">
            <BingoBoard
              maxBalls={maxBalls}
              drawnNumbers={drawnNumbers}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-6 border-t border-white/5 text-center text-xs text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="flex items-center gap-1">
          Criado com <Sparkles className="w-3 h-3 text-amber-500" /> para diversão em família.
        </p>
        <p>
          React + Tailwind CSS v4 &bull; Web Audio API
        </p>
      </footer>
    </div>
  );
}
