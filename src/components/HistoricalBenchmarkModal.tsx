import React, { useState } from 'react';
import { HISTORICAL_BENCHMARKS } from '../data/snbpData';
import { X, Search, Award, TrendingUp, AlertCircle } from 'lucide-react';

interface HistoricalBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBenchmark?: (ptn: string, jurusan: string) => void;
}

export const HistoricalBenchmarkModal: React.FC<HistoricalBenchmarkModalProps> = ({
  isOpen,
  onClose,
  onApplyBenchmark,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPtn, setSelectedPtn] = useState<string>('Semua');

  if (!isOpen) return null;

  const ptnOptions = [
    'Semua',
    'Universitas Diponegoro (UNDIP)',
    'Universitas Negeri Semarang (UNNES / UNES)',
    'Universitas Jenderal Soedirman (UNSOED)',
    'Universitas Indonesia (UI)',
    'Universitas Gadjah Mada (UGM)',
    'Institut Teknologi Bandung (ITB)',
    'Universitas Airlangga (UNAIR)',
    'Universitas Brawijaya (UB)',
  ];

  const filtered = HISTORICAL_BENCHMARKS.filter((item) => {
    const matchSearch =
      item.jurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ptn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPtn = selectedPtn === 'Semua' || item.ptn.includes(selectedPtn);
    return matchSearch && matchPtn;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Acuan Rata-Rata Nilai Rapor Diterima SNBP
              </h3>
              <p className="text-xs text-slate-400">
                Data historis rata-rata nilai rapor lolos SNBP PTN (Slide 12-14 Panduan)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer alert */}
        <div className="mx-6 mt-4 p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <span>
            <strong>Disclaimer Resmi:</strong> Nilai di bawah ini merupakan rata-rata historis siswa yang berhasil lolos SNBP pada tahun sebelumnya. Rata-rata ini digunakan sebagai acuan aman minimum untuk memetakan tingkat persaingan jurusan target Anda.
          </span>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari jurusan atau PTN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
            {ptnOptions.slice(0, 7).map((ptn) => (
              <button
                key={ptn}
                onClick={() => setSelectedPtn(ptn)}
                className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
                  selectedPtn === ptn
                    ? 'bg-amber-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {ptn.replace('Universitas ', '').replace('Institut Teknologi ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Table content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-amber-500/50 hover:bg-slate-800 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[11px] font-medium text-slate-400 line-clamp-1">{item.ptn}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-200">
                      {item.jenjang}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {item.jurusan}
                  </h4>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rata-rata Rapor:</span>
                    <span className="text-base font-bold text-amber-400 flex items-center gap-1 font-mono">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {item.rataRataRapor.toFixed(2)}
                    </span>
                  </div>

                  {onApplyBenchmark && (
                    <button
                      onClick={() => {
                        onApplyBenchmark(item.ptn, item.jurusan);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs rounded bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-medium transition-colors"
                    >
                      Pilih Jurusan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-slate-400 text-[11px] flex items-center justify-between px-6">
          <span>Menampilkan {filtered.length} program studi berbobot SNBP.</span>
          <span className="text-amber-400 font-medium">Berdasarkan arsip seleksi & SNPMB</span>
        </div>
      </div>
    </div>
  );
};
