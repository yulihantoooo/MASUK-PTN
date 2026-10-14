import React from 'react';
import { PredictionResult, StudentInputData } from '../types/snbp';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  ShieldAlert,
  Building,
  Target,
  FileText,
} from 'lucide-react';

interface PredictionResultCardProps {
  prediction: PredictionResult;
  studentData: StudentInputData;
  onOpenLiveConsultation: () => void;
  onOpenBrunoRose: () => void;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  prediction,
  studentData,
  onOpenLiveConsultation,
  onOpenBrunoRose,
}) => {
  const getCategoryTheme = (cat: PredictionResult['category']) => {
    switch (cat) {
      case 'Sangat Tinggi':
        return {
          bg: 'from-emerald-950/80 to-slate-900',
          border: 'border-emerald-600/40',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          glow: 'shadow-emerald-500/20',
        };
      case 'Kompetitif':
        return {
          bg: 'from-blue-950/80 to-slate-900',
          border: 'border-blue-600/40',
          text: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          glow: 'shadow-blue-500/20',
        };
      case 'Moderat':
        return {
          bg: 'from-amber-950/80 to-slate-900',
          border: 'border-amber-600/40',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          glow: 'shadow-amber-500/20',
        };
      case 'Beresiko Tinggi':
      default:
        return {
          bg: 'from-rose-950/80 to-slate-900',
          border: 'border-rose-600/40',
          text: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          glow: 'shadow-rose-500/20',
        };
    }
  };

  const theme = getCategoryTheme(prediction.category);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div
        className={`rounded-2xl p-6 border ${theme.border} bg-gradient-to-br ${theme.bg} shadow-xl ${theme.glow} relative overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs uppercase font-bold px-3 py-1 rounded-full border ${theme.badge} tracking-wider`}
              >
                Peluang {prediction.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Pilihan {studentData.ptnChoice1.priorityOrder} &bull; {studentData.ptnChoice1.ptnName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {studentData.ptnChoice1.prodiName || 'Program Studi Target'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {prediction.summaryMessage}
            </p>

            {prediction.ptnSpecificNotes && (
              <p className="text-xs text-amber-300/90 font-medium pt-1">
                📌 {prediction.ptnSpecificNotes}
              </p>
            )}
          </div>

          {/* Score Circle Indicator */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 w-full md:w-44 text-center shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Skor 8 Faktor
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white my-1 font-mono tracking-tight">
              {prediction.totalScore}
              <span className="text-lg text-slate-500 font-normal">/100</span>
            </div>
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <span>Estimasi Peluang:</span>
              <span className={`font-bold ${theme.text}`}>{prediction.chancePercentage}%</span>
            </div>
          </div>
        </div>

        {/* Consistency / Bruno Warning Banner */}
        {prediction.consistencyWarning && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{prediction.consistencyWarning}</span>
            </div>
            <button
              onClick={onOpenBrunoRose}
              className="text-[11px] underline text-cyan-300 hover:text-cyan-200 shrink-0 font-medium cursor-pointer"
            >
              Lihat Kasus Bruno
            </button>
          </div>
        )}

        {/* Live Search Grounding CTA Button */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ingin data daya tampung & keketatan resmi terupdate?</span>
          </div>

          <button
            onClick={onOpenLiveConsultation}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Analisis Mendalam dengan Live Google Search Grounding</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8 Factors Breakdown Grid */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Rincian Perolehan 8 Faktor Penentu SNBP
            </h3>
            <p className="text-xs text-slate-400">
              Evaluasi persentase skor berdasarkan slide panduan seleksi
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800">
            Total: {prediction.totalScore} Poin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {prediction.factors.map((factor, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between hover:bg-slate-800/80 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-200">{factor.name}</span>
                  <span className="font-mono text-cyan-400">
                    {factor.score} / {factor.maxPoints} Poin
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-2.5">{factor.description}</p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full h-2 rounded-full bg-slate-700/80 overflow-hidden">
                  <div
                    style={{ width: `${factor.percentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      factor.status === 'optimal'
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                        : factor.status === 'good'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-400'
                        : factor.status === 'warning'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-rose-600 to-rose-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Insights & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rekomendasi Positif */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/50 space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Kekuatan & Rekomendasi Strategis
          </h4>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            {prediction.recommendations.map((rec, i) => (
              <li key={i} className="leading-relaxed">
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Peringatan Risiko */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/50 space-y-2">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Faktor Risiko yang Perlu Diwaspadai
          </h4>
          {prediction.risks.length === 0 ? (
            <p className="text-xs text-slate-300">
              Tidak ada faktor risiko mayor yang terdeteksi. Profil pendaftaran sangat aman!
            </p>
          ) : (
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              {prediction.risks.map((risk, i) => (
                <li key={i} className="leading-relaxed">
                  {risk}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
