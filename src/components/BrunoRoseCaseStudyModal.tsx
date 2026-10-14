import React from 'react';
import { X, AlertTriangle, CheckCircle2, XCircle, Info, Scale, HelpCircle } from 'lucide-react';

interface BrunoRoseCaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrunoRoseCaseStudyModal: React.FC<BrunoRoseCaseStudyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/80 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Mengapa Nilai Rapor Tinggi Bisa Gagal di SNBP?
              </h3>
              <p className="text-xs text-slate-400">
                Analisis Kasus Nyata Diskrepansi Nilai Rapor vs Asesmen / TKA (Slide 10-11 Panduan)
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          {/* Main takeaway badge */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 leading-relaxed">
              <strong>Kunci Rahasia Penilaian SNBP:</strong> Salah satu syarat utama lolos SNBP adalah{' '}
              <span className="text-amber-100 font-bold underline">kesesuaian & keselarasan</span> antara nilai rapor
              umum dengan nilai mata pelajaran pendukung serta kompetensi murni siswa. Nilai rapor 90+ yang melonjak
              namun mapel pendukungnya jeblok justru memicu kecurigaan indeks diskualifikasi panitia seleksi.
            </div>
          </div>

          {/* Table 1: Kasus Adit, Sopo, dan Jarwo */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-xs flex items-center justify-center text-cyan-400 border border-slate-700">1</span>
              Kasus Riil: Nilai Rapor 89 Kalah dari Nilai 85
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">Rata-Rata Rapor (Sem 1-5)</th>
                    <th className="p-3">Nilai Asesmen / TKA / Mapel Pendukung</th>
                    <th className="p-3 text-right">Hasil Seleksi SNBP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">Adit</td>
                    <td className="p-3 font-mono font-medium text-slate-200">88.00</td>
                    <td className="p-3 font-mono text-rose-400">425 (Sangat Rendah)</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Tidak Lolos
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">Sopo</td>
                    <td className="p-3 font-mono font-medium text-slate-200">89.00</td>
                    <td className="p-3 font-mono text-rose-400">571 (Rendah)</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Tidak Lolos
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-emerald-950/20 hover:bg-emerald-950/30">
                    <td className="p-3 font-semibold text-emerald-300">Jarwo</td>
                    <td className="p-3 font-mono font-medium text-slate-200">85.00</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">720 (Tinggi & Konsisten)</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Lolos SNBP
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparative Cards: Bruno vs Rose (Slide 11) */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-xs flex items-center justify-center text-cyan-400 border border-slate-700">2</span>
              Komparasi Profil: Bruno vs Rose (Siswa Eligible SNBP)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bruno Card */}
              <div className="p-4 rounded-xl bg-slate-800/70 border border-rose-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base text-white">Bruno</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700">
                      Peluang Lolos: RENDAH
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Rata-Rata Rapor:</span>
                      <span className="font-bold text-emerald-400">95.2 (Sangat Tinggi)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Nilai Mapel Uji / TKA:</span>
                      <span className="font-bold text-rose-400">328 (Kurang)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Matematika Wajib:</span>
                      <span className="font-mono text-slate-300">310</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Mapel Pilihan 1 & 2:</span>
                      <span className="font-mono text-slate-300">320 & 290</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-rose-950/40 text-[11px] text-rose-200 border border-rose-800/50">
                  ⚠️ <strong>Kesimpulan:</strong> Antara nilai rapor dengan nilai mapel pendukung Bruno tidak sesuai. Terdapat selisih mencolok sehingga sistem menilai integritas nilai rendah.
                </div>
              </div>

              {/* Rose Card */}
              <div className="p-4 rounded-xl bg-slate-800/70 border border-emerald-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base text-white">Rose</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                      Peluang Lolos: TINGGI
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Rata-Rata Rapor:</span>
                      <span className="font-bold text-cyan-300">88.6 (Baik & Stabil)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Nilai Mapel Uji / TKA:</span>
                      <span className="font-bold text-emerald-400">765 (Istimewa)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Matematika Wajib:</span>
                      <span className="font-mono text-slate-300">780</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Mapel Pilihan 1 & 2:</span>
                      <span className="font-mono text-slate-300">790 & 750</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/40 text-[11px] text-emerald-200 border border-emerald-800/50">
                  ✅ <strong>Kesimpulan:</strong> Antara nilai rapor dengan nilai mapel pendukung Rose sama-sama bagus dan selaras, sehingga peluang lolos di PTN tujuan sangat tinggi!
                </div>
              </div>
            </div>
          </div>

          {/* Key Checklist for Students & BK Teachers */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4" /> Checklist Guru BK & Siswa
            </h5>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Pastikan nilai mata pelajaran pendukung prodi (sesuai Kepmendikdasmen) selalu di atas rata-rata rapor Anda.</li>
              <li>Jangan hanya mengandalkan rata-rata rapor gabungan; perhatikan nilai mata pelajaran peminatan.</li>
              <li>Sertakan sertifikat yang linear dengan program studi yang didaftar agar bobot 20% maksimal.</li>
              <li>Cek apakah ada alumni sekolah Anda yang aktif berkuliah dengan IPK baik di program studi target.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-right px-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
