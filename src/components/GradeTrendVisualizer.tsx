import React from 'react';
import { SemesterGrades } from '../types/snbp';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface GradeTrendVisualizerProps {
  grades: SemesterGrades;
  kkm: number;
}

export const GradeTrendVisualizer: React.FC<GradeTrendVisualizerProps> = ({ grades, kkm }) => {
  const semesters = [
    { label: 'Sem 1 (Kls 10)', val: grades.sem1 },
    { label: 'Sem 2 (Kls 10)', val: grades.sem2 },
    { label: 'Sem 3 (Kls 11)', val: grades.sem3 },
    { label: 'Sem 4 (Kls 11)', val: grades.sem4 },
    { label: 'Sem 5 (Kls 12)', val: grades.sem5 },
  ];

  const values = semesters.map((s) => s.val);
  const minVal = Math.min(...values, kkm - 2);
  const maxVal = Math.max(...values, 100);
  const range = Math.max(maxVal - minVal, 10);

  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const delta = values[4] - values[0];

  const isAscending = delta > 0 && values[4] >= values[3] && values[3] >= values[2];
  const isDescending = delta < 0;

  return (
    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            Progresi Rapor Semester 1 - 5
            {isAscending ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <TrendingUp className="w-3 h-3" /> Tren Naik (+{delta.toFixed(1)})
              </span>
            ) : isDescending ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800">
                <TrendingDown className="w-3 h-3" /> Tren Menurun ({delta.toFixed(1)})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-800">
                <Minus className="w-3 h-3" /> Tren Stabil
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Rata-rata 5 Semester: <span className="font-bold text-white">{avg}</span> (KKM: {kkm})
          </p>
        </div>

        <div className="text-right text-xs">
          {isAscending ? (
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Nilai meningkat disukai verifikator</span>
            </div>
          ) : isDescending ? (
            <div className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Perlu waspada penurunan nilai</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* SVG Sparkline & Bars */}
      <div className="relative pt-4 pb-2">
        <div className="grid grid-cols-5 gap-2 items-end h-28 border-b border-slate-700/80 px-2">
          {semesters.map((s, idx) => {
            const heightPercent = Math.max(15, Math.min(100, ((s.val - (minVal - 2)) / range) * 100));
            const isLatest = idx === 4;
            const diffPrev = idx > 0 ? s.val - semesters[idx - 1].val : 0;

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                {/* Floating tooltip */}
                <div className="text-xs font-semibold mb-1.5 transition-all text-slate-200 group-hover:text-cyan-400">
                  {s.val}
                  {idx > 0 && diffPrev !== 0 && (
                    <span className={`text-[10px] ml-1 ${diffPrev > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {diffPrev > 0 ? `+${diffPrev}` : diffPrev}
                    </span>
                  )}
                </div>

                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[42px] rounded-t-md transition-all duration-500 relative ${
                    isLatest
                      ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-md shadow-cyan-500/20'
                      : s.val >= 90
                      ? 'bg-gradient-to-t from-indigo-700 to-indigo-500'
                      : s.val >= 80
                      ? 'bg-gradient-to-t from-slate-700 to-blue-500'
                      : 'bg-gradient-to-t from-slate-700 to-amber-600'
                  }`}
                >
                  <div className="absolute top-1 left-0 right-0 h-0.5 bg-white/30 rounded" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Labels below */}
        <div className="grid grid-cols-5 gap-2 text-center mt-2">
          {semesters.map((s, idx) => (
            <div key={idx} className="text-[11px] text-slate-400 truncate">
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
