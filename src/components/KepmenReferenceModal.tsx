import React, { useState } from 'react';
import { MAPEL_PENDUKUNG_KEPMEN } from '../data/snbpData';
import { X, Search, BookOpen, Layers } from 'lucide-react';

interface KepmenReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKelompok?: (kelompok: string, mapel: string) => void;
}

export const KepmenReferenceModal: React.FC<KepmenReferenceModalProps> = ({
  isOpen,
  onClose,
  onSelectKelompok,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRumpun, setSelectedRumpun] = useState<string>('Semua');

  if (!isOpen) return null;

  const rumpunList = ['Semua', 'Humaniora', 'Ilmu Sosial', 'Ilmu Alam', 'Ilmu Formal', 'Ilmu Terapan'];

  const filtered = MAPEL_PENDUKUNG_KEPMEN.filter((item) => {
    const matchSearch =
      item.kelompokProdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kurikulumMerdeka.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kurikulum2013IPA.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRumpun = selectedRumpun === 'Semua' || item.rumpun === selectedRumpun;
    return matchSearch && matchRumpun;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Daftar Mata Pelajaran Pendukung Resmi SNBP
              </h3>
              <p className="text-xs text-slate-400">
                Salinan Lampiran Keputusan Menteri Pendidikan Dasar dan Menengah Nomor 102/M/2025
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

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari prodi atau mapel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
            {rumpunList.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRumpun(r)}
                className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
                  selectedRumpun === r
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Table content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3">Rumpun</th>
                  <th className="py-2.5 px-3">Kelompok Program Studi</th>
                  <th className="py-2.5 px-3 text-cyan-300">Mapel Pendukung (Kurikulum Merdeka)</th>
                  <th className="py-2.5 px-3 text-amber-300">Mapel (K13 IPA)</th>
                  <th className="py-2.5 px-3 text-emerald-300">Mapel (K13 IPS)</th>
                  <th className="py-2.5 px-3 text-purple-300">Mapel (K13 Bahasa)</th>
                  {onSelectKelompok && <th className="py-2.5 px-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((item) => (
                  <tr key={item.no} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono">{item.no}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                        {item.rumpun}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white">{item.kelompokProdi}</td>
                    <td className="py-2.5 px-3 text-cyan-200 font-medium bg-cyan-950/10">
                      {item.kurikulumMerdeka}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{item.kurikulum2013IPA}</td>
                    <td className="py-2.5 px-3 text-slate-300">{item.kurikulum2013IPS}</td>
                    <td className="py-2.5 px-3 text-slate-300">{item.kurikulum2013Bahasa}</td>
                    {onSelectKelompok && (
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            onSelectKelompok(item.kelompokProdi, item.kurikulumMerdeka);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] transition-colors"
                        >
                          Pilih
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-slate-400 text-[11px] flex items-center justify-between px-6">
          <span>Menampilkan {filtered.length} dari {MAPEL_PENDUKUNG_KEPMEN.length} kelompok program studi resmi.</span>
          <span className="text-blue-400">Aturan Bobot Mapel Pendukung: Hingga 50% di SNBP</span>
        </div>
      </div>
    </div>
  );
};
