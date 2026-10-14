import React from 'react';
import { X, Code2, Award, Mail, GraduationCap, CheckCircle2, Heart } from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/30 text-white font-bold text-2xl border-2 border-white/20">
              YH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">Yulianto Harsono</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold uppercase">
                  Pengembang
                </span>
              </div>
              <p className="text-xs text-cyan-300 font-medium mt-0.5">
                Lead Developer & EduTech Strategist
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href="mailto:yulihanto@gmail.com" className="hover:underline text-slate-300">
                  yulihanto@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              Tentang Aplikasi & Visi Pengembang
            </h4>
            <p className="leading-relaxed text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              Aplikasi ini dirancang dan dikembangkan oleh <strong>Yulianto Harsono</strong> untuk memberikan solusi berbasis data bagi siswa SMA/SMK/MA sederajat, orang tua, dan Guru Bimbingan Konseling (BK) di seluruh Indonesia dalam menyusun strategi pemilihan program studi di Perguruan Tinggi Negeri (PTN) melalui jalur SNBP.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Komponen & Algoritma yang Dikembangkan
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Formulasi 8 Faktor Penentu Kelolosan:</strong> Rata-rata Rapor (25%), Sertifikat (20%), Rekam Jejak Alumni (15%), Ranking Paralel (10%), Akreditasi Sekolah (10%), Domisili PTN (10%), Mapel Pendukung (15%), dan KKM (5%).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Integrasi Regulasi Resmi:</strong> Penyelarasan mata pelajaran pendukung dengan Keputusan Menteri Pendidikan Dasar dan Menengah Nomor 102/M/2025.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Simulasi Khusus Top PTN:</strong> Algoritma adaptif untuk IPB (50:50), UB (50:40:10), UNPAD, UNAIR, dan ITB.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Live Search Grounding:</strong> Pemanfaatan AI <code>gemini-3.8-flash</code> dengan Google Search untuk mengecek data kuota daya tampung dan tingkat keketatan terkini secara langsung.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> oleh Yulianto Harsono
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
