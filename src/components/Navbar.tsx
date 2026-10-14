import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  HelpCircle, 
  Sparkles,
  Printer
} from 'lucide-react';

interface NavbarProps {
  onOpenKepmen: () => void;
  onOpenBenchmarks: () => void;
  onOpenBrunoRose: () => void;
  onOpenLiveConsultation: () => void;
  onOpenDeveloper: () => void;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenKepmen,
  onOpenBenchmarks,
  onOpenBrunoRose,
  onOpenLiveConsultation,
  onOpenDeveloper,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                SNBP Predictor
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                8 Faktor Resmi
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Kepmendikdasmen No 102/M/2025 & Algoritma Seleksi PTN
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenKepmen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Daftar 59 Mapel Pendukung Kepmendikdasmen"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">59 Mapel Kepmen</span>
          </button>

          <button
            onClick={onOpenBenchmarks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Data Rata-Rata Rapor Diterima PTN (UNDIP, UNSOED, dll)"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Acuan Nilai PTN</span>
          </button>

          <button
            onClick={onOpenBrunoRose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Studi Kasus Bruno vs Rose (Inkonsistensi Nilai)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Kasus Bruno vs Rose</span>
          </button>

          <button
            onClick={onOpenLiveConsultation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Live Search Grounding</span>
          </button>

          <button
            onClick={onOpenDeveloper}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Profil Pengembang: Yulianto Harsono"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="hidden sm:inline">Pengembang:</span>
            <span className="font-semibold text-cyan-300">Yulianto Harsono</span>
          </button>

          <button
            onClick={onPrint}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Cetak Laporan Rapor & Hasil Prediksi"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
