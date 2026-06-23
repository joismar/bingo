import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { getBingoLetter } from './HistoryList';

export default function DrawnDisplay({ 
  lastDrawn, 
  isRolling, 
  maxBalls, 
  onDraw, 
  onReset, 
  isGameOver,
  totalDrawn
}) {
  const [fakeNumber, setFakeNumber] = useState(1);

  // High-speed number oscillation during rolling to simulate a bingo cage spinning
  useEffect(() => {
    let interval;
    if (isRolling) {
      interval = setInterval(() => {
        setFakeNumber(Math.floor(Math.random() * maxBalls) + 1);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRolling, maxBalls]);

  const letter = lastDrawn ? getBingoLetter(lastDrawn) : '';

  return (
    <div className="glass-panel rounded-2xl p-8 border border-white/5 flex flex-col items-center justify-center glow-purple relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl -z-10" />

      {/* Counter of drawn balls */}
      <div className="absolute top-4 right-4 text-xs font-semibold text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
        Bolas: {totalDrawn} / {maxBalls}
      </div>

      {/* Main Ball Display */}
      <div className="h-72 flex items-center justify-center">
        {isRolling ? (
          // Rolling Ball State
          <div className="w-56 h-56 rounded-full bg-gradient-to-br from-violet-600/80 to-fuchsia-600/80 flex flex-col items-center justify-center border-4 border-white/20 animate-spin text-white shadow-xl">
            <span className="text-[14px] font-bold tracking-widest text-white/70 uppercase">Sorteando</span>
            <span className="text-6xl font-black">{fakeNumber}</span>
          </div>
        ) : isGameOver ? (
          // Game Over State
          <div className="text-center animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-gray-300">Todas as bolas sorteadas!</p>
            <p className="text-xs text-gray-500 mt-1">Reinicie o jogo para começar novamente.</p>
          </div>
        ) : lastDrawn ? (
          // Number Drawn State
          <div className="w-56 h-56 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex flex-col items-center justify-center border-4 border-white/10 text-white animate-ball-pop shadow-2xl relative">
            <div className="absolute inset-1 rounded-full border border-white/10" />
            {maxBalls === 75 && letter && (
              <span className="text-3xl font-black text-violet-300 leading-none -mt-2">
                {letter}
              </span>
            )}
            <span className="text-7xl font-black leading-tight tracking-tight mt-1">
              {lastDrawn}
            </span>
          </div>
        ) : (
          // Idle / Welcome State
          <div className="text-center py-4">
            <div className="w-36 h-36 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-violet-400 mb-4">
              <span className="text-4xl font-extrabold">?</span>
            </div>
            <p className="text-lg font-bold text-gray-300">Pronto para Sorteio</p>
            <p className="text-xs text-gray-500 mt-1">Clique no botão abaixo para começar.</p>
          </div>
        )}
      </div>

      {/* Main Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-3 mt-6 justify-center">
        <button
          onClick={onDraw}
          disabled={isRolling || isGameOver}
          className={`
            flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-300
            ${isRolling || isGameOver
              ? 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
        >
          <Play className="w-5 h-5 fill-current" />
          {isRolling ? 'Sorteando...' : 'Sortear Número'}
        </button>

        <button
          onClick={onReset}
          disabled={isRolling || totalDrawn === 0}
          className={`
            flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base border transition-all duration-300
            ${isRolling || totalDrawn === 0
              ? 'bg-transparent text-gray-600 border-white/5 cursor-not-allowed'
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 active:scale-[0.98]'
            }
          `}
        >
          <RotateCcw className="w-5 h-5" />
          Reiniciar
        </button>
      </div>
    </div>
  );
}
