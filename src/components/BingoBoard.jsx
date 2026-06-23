import React from 'react';

export default function BingoBoard({ maxBalls, drawnNumbers }) {
  const lastDrawn = drawnNumbers[drawnNumbers.length - 1];
  const drawnSet = new Set(drawnNumbers);

  // Helper to check if a number is drawn
  const isDrawn = (num) => drawnSet.has(num);
  const isLast = (num) => num === lastDrawn;

  if (maxBalls === 75) {
    // 75-ball: group by B-I-N-G-O
    const rows = [
      { letter: 'B', min: 1, max: 15, color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' },
      { letter: 'I', min: 16, max: 30, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
      { letter: 'N', min: 31, max: 45, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
      { letter: 'G', min: 46, max: 60, color: 'text-sky-400 border-sky-500/20 bg-sky-500/5' },
      { letter: 'O', min: 61, max: 75, color: 'text-violet-400 border-violet-500/20 bg-violet-500/5' },
    ];

    return (
      <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider text-left">
          Quadro Geral (75 Bolas)
        </h3>
        <div className="flex flex-col gap-3 overflow-x-auto pb-2">
          {rows.map((row) => {
            const numbers = [];
            for (let i = row.min; i <= row.max; i++) {
              numbers.push(i);
            }

            return (
              <div key={row.letter} className="flex items-center gap-2 min-w-[640px]">
                {/* Letter Header Column */}
                <div className={`w-10 h-10 flex items-center justify-center font-black text-xl rounded-xl border ${row.color}`}>
                  {row.letter}
                </div>
                {/* Numbers for this letter */}
                <div className="flex-1 grid gap-1.5" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
                  {numbers.map((num) => {
                    const drawn = isDrawn(num);
                    const last = isLast(num);

                    return (
                      <div
                        key={num}
                        className={`
                          h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300
                          ${last 
                            ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-extrabold shadow-lg shadow-violet-500/30 scale-105 animate-pulse z-10' 
                            : drawn 
                              ? 'bg-violet-600/30 border border-violet-500/30 text-violet-200' 
                              : 'bg-white/5 border border-white/5 text-gray-500 hover:border-white/10'
                          }
                        `}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    // 90-ball: grid of 9 rows x 10 columns (1 to 90)
    const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

    return (
      <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider text-left">
          Quadro Geral (90 Bolas)
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {numbers.map((num) => {
            const drawn = isDrawn(num);
            const last = isLast(num);

            return (
              <div
                key={num}
                className={`
                  h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${last 
                    ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-extrabold shadow-lg shadow-violet-500/30 scale-105 animate-pulse z-10' 
                    : drawn 
                      ? 'bg-violet-600/30 border border-violet-500/30 text-violet-200' 
                      : 'bg-white/5 border border-white/5 text-gray-500 hover:border-white/10'
                  }
                `}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
