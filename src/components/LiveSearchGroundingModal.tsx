import React, { useState } from 'react';
import { Sparkles, X, Globe, ExternalLink, Send, RefreshCw, AlertCircle, BookCheck } from 'lucide-react';
import { StudentInputData, PredictionResult } from '../types/snbp';

interface LiveSearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: StudentInputData;
  prediction: PredictionResult;
}

interface GroundingSource {
  title: string;
  url: string;
}

export const LiveSearchGroundingModal: React.FC<LiveSearchGroundingModalProps> = ({
  isOpen,
  onClose,
  studentData,
  prediction,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');

  if (!isOpen) return null;

  const handleFetchConsultation = async (overridePrompt?: string) => {
    setLoading(true);
    setError(null);

    const ptnName = studentData.ptnChoice1.ptnName || 'Universitas Indonesia';
    const prodiName = studentData.ptnChoice1.prodiName || 'Ilmu Komputer';

    const avg = (
      (studentData.semesterGrades.sem1 +
        studentData.semesterGrades.sem2 +
        studentData.semesterGrades.sem3 +
        studentData.semesterGrades.sem4 +
        studentData.semesterGrades.sem5) /
      5
    ).toFixed(2);

    const supportingNames = studentData.supportingSubjects
      .map((s) => `${s.subjectName} (${s.averageGrade})`)
      .join(', ');

    const studentSummary = `
- Siswa: ${studentData.studentName || 'Siswa'} (${studentData.schoolName || 'SMA/SMK'}, Akreditasi ${studentData.accreditation}, Provinsi ${studentData.schoolProvince})
- Ranking Paralel: ${studentData.parallelRank}
- Rata-rata Rapor (Sem 1-5): ${avg} (KKM: ${studentData.schoolKKM})
- Mapel Pendukung: ${supportingNames || 'Sesuai kurikulum'}
- Jumlah Sertifikat: ${studentData.certificates.length} prestasi
- Alumni di Prodi ini: ${studentData.ptnChoice1.alumniCount} orang
- Skor Prediksi SNBP Internal: ${prediction.totalScore}/100 (${prediction.category})
- Status Pilihan: Pilihan ke-${studentData.ptnChoice1.priorityOrder}
`;

    try {
      const res = await fetch('/api/snbp/live-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ptnName,
          prodiName,
          studentSummary,
          customPrompt: overridePrompt || customQuestion || undefined,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      setAnalysisText(data.text);
      setSearchQueries(data.webSearchQueries || []);
      setSources(data.sources || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gagal menghubungi server konsultasi AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Live Search Grounding SNBP</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  gemini-3.8-flash + Google Search
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Data aktual daya tampung, peminat resmi SNPMB, keketatan, dan strategi lolos terverifikasi
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

        {/* Target summary bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target Konsultasi:</span>
            <span className="font-semibold text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
              {studentData.ptnChoice1.ptnName || 'Pilih PTN'} &bull; {studentData.ptnChoice1.prodiName || 'Pilih Prodi'}
            </span>
            <span className="text-slate-400">
              (Pilihan {studentData.ptnChoice1.priorityOrder})
            </span>
          </div>

          <button
            onClick={() => handleFetchConsultation()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs shadow transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{analysisText ? 'Perbarui Analisis' : 'Mulai Analisis Grounding'}</span>
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong>Terjadi Kendala:</strong> {error}
                <div className="mt-1 text-slate-400">Pastikan koneksi internet aktif dan server dev menyala.</div>
              </div>
            </div>
          )}

          {!analysisText && !loading && (
            <div className="text-center py-12 px-4 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Hubungkan ke Data SNBP Aktual</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Fitur ini menggunakan model <code className="text-cyan-300">gemini-3.8-flash</code> dengan kemampuan
                  <strong> Google Search Grounding</strong> untuk menelusuri data kuota daya tampung SNPMB terbaru,
                  peminat tahun sebelumnya, dan akreditasi prodi secara real-time.
                </p>
              </div>
              <button
                onClick={() => handleFetchConsultation()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all"
              >
                Mulai Konsultasi & Pencarian Web
              </button>
            </div>
          )}

          {loading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-200">
                Sedang mencari data resmi PTN via Google Search...
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Mengecek kuota daya tampung, jumlah peminat prodi {studentData.ptnChoice1.prodiName}, dan menganalisis keselarasan profil nilai Anda...
              </p>
            </div>
          )}

          {analysisText && !loading && (
            <div className="space-y-4">
              {/* Queries used by Google Search */}
              {searchQueries.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-2">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Kata Kunci Google Search Grounding:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {searchQueries.map((q, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono"
                      >
                        "{q}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Markdown Content */}
              <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {analysisText}
              </div>

              {/* Grounding Source Links */}
              {sources.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <BookCheck className="w-4 h-4 text-emerald-400" />
                    Sumber Referensi Web yang Ditemukan:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-blue-400 hover:text-blue-300 flex items-center justify-between transition-colors group"
                      >
                        <span className="truncate pr-2 group-hover:underline text-slate-300 font-medium text-[11px]">
                          {src.title || src.url}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Question Input */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customQuestion.trim()) {
                handleFetchConsultation(customQuestion);
                setCustomQuestion('');
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tanyakan hal spesifik (contoh: Bagaimana jika nilai kimia saya 84 untuk kedokteran di sini?)..."
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !customQuestion.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Tanya AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
