import React from 'react';

export const getBingoLetter = (num) => {
  if (num >= 1 && num <= 15) return 'B';
  if (num >= 16 && num <= 30) return 'I';
  if (num >= 31 && num <= 45) return 'N';
  if (num >= 46 && num <= 60) return 'G';
  if (num >= 61 && num <= 75) return 'O';
  return '';
};

export default function HistoryList({ drawnNumbers, maxBalls }) {
  // Get all previously drawn numbers (excluding the very last one, which is shown on the main display)
  const history = drawnNumbers.slice(0, -1).reverse();

  if (history.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center min-h-[140px] text-gray-500 border border-white/5">
        <p className="text-sm font-medium">Nenhum histórico ainda</p>
        <p className="text-xs text-gray-600 mt-1">Os números anteriores aparecerão aqui</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-left">
        Histórico de Sorteio
      </h3>
      <div className="flex gap-3 justify-start items-center overflow-x-auto py-1">
        {history.map((num, idx) => {
          const letter = maxBalls === 75 ? getBingoLetter(num) : '';
          return (
            <div
              key={num}
              style={{ opacity: Math.max(0.4, 1 - idx * 0.04) }}
              className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-gray-300 transform hover:scale-105 transition-all duration-300"
            >
              {letter && (
                <span className="text-[10px] font-bold text-violet-400 leading-none -mt-1">
                  {letter}
                </span>
              )}
              <span className="text-sm font-extrabold leading-tight">
                {num}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
