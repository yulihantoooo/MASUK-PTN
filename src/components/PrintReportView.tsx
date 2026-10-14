import React from 'react';
import { StudentInputData, PredictionResult } from '../types/snbp';
import { calculateAverageGrade } from '../utils/snbpCalculator';

interface PrintReportViewProps {
  data: StudentInputData;
  prediction: PredictionResult;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ data, prediction }) => {
  const avg = calculateAverageGrade(data.semesterGrades);

  return (
    <div className="hidden print:block p-8 bg-white text-slate-900 text-xs">
      {/* Official Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">
            Laporan Analisis & Prediksi Kelolosan SNBP PTN
          </h1>
          <p className="text-slate-600 text-xs">
            Berdasarkan 8 Faktor Penentu Resmi SNBP & Kepmendikdasmen No 102/M/2025
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Pengembang Aplikasi: <strong>Yulianto Harsono</strong> (yulihanto@gmail.com)
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-500">
          <div>Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</div>
          <div>Status: Evaluasi Mandiri & BK</div>
        </div>
      </div>

      {/* Student & School Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 border border-slate-300 rounded-lg">
        <div>
          <div className="font-bold text-slate-700 uppercase tracking-wider mb-2">Identitas Siswa</div>
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="w-32 py-1 text-slate-500">Nama Siswa:</td>
                <td className="py-1 font-semibold">{data.studentName || '-'}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Sekolah:</td>
                <td className="py-1 font-semibold">{data.schoolName || '-'}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Provinsi:</td>
                <td className="py-1">{data.schoolProvince}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Akreditasi:</td>
                <td className="py-1 font-semibold">
                  {data.accreditation} (Kuota: {data.accreditation === 'A' ? '40%' : '25%'})
                </td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Ranking Paralel:</td>
                <td className="py-1 font-semibold">{data.parallelRank}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div className="font-bold text-slate-700 uppercase tracking-wider mb-2">Target Pendaftaran PTN</div>
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="w-32 py-1 text-slate-500">PTN Pilihan 1:</td>
                <td className="py-1 font-semibold">{data.ptnChoice1.ptnName}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Program Studi:</td>
                <td className="py-1 font-bold">{data.ptnChoice1.prodiName}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Provinsi PTN:</td>
                <td className="py-1">{data.ptnChoice1.province}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Histori Alumni:</td>
                <td className="py-1 font-semibold">{data.ptnChoice1.alumniCount} orang</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Prioritas:</td>
                <td className="py-1 font-semibold">Pilihan ke-{data.ptnChoice1.priorityOrder}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Rapor & Summary */}
      <div className="mb-6">
        <h3 className="font-bold text-sm border-b border-slate-300 pb-1 mb-2">
          Nilai Rapor Semester 1 - 5 (Rata-rata: {avg})
        </h3>
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="p-2 border border-slate-200 rounded">
            <div className="text-[10px] text-slate-500">Semester 1</div>
            <div className="font-bold text-sm">{data.semesterGrades.sem1}</div>
          </div>
          <div className="p-2 border border-slate-200 rounded">
            <div className="text-[10px] text-slate-500">Semester 2</div>
            <div className="font-bold text-sm">{data.semesterGrades.sem2}</div>
          </div>
          <div className="p-2 border border-slate-200 rounded">
            <div className="text-[10px] text-slate-500">Semester 3</div>
            <div className="font-bold text-sm">{data.semesterGrades.sem3}</div>
          </div>
          <div className="p-2 border border-slate-200 rounded">
            <div className="text-[10px] text-slate-500">Semester 4</div>
            <div className="font-bold text-sm">{data.semesterGrades.sem4}</div>
          </div>
          <div className="p-2 border border-slate-200 rounded">
            <div className="text-[10px] text-slate-500">Semester 5</div>
            <div className="font-bold text-sm">{data.semesterGrades.sem5}</div>
          </div>
        </div>
      </div>

      {/* 8 Factors Breakdown */}
      <div className="mb-6">
        <h3 className="font-bold text-sm border-b border-slate-300 pb-1 mb-2">
          Rincian Nilai 8 Faktor Penentu (Total Skor: {prediction.totalScore}/100 - Kategori: {prediction.category})
        </h3>
        <table className="w-full text-xs border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-left font-bold">
              <th className="p-2">Faktor Penentu</th>
              <th className="p-2">Keterangan</th>
              <th className="p-2 text-right">Skor Diperoleh</th>
              <th className="p-2 text-right">Maksimal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {prediction.factors.map((f, i) => (
              <tr key={i}>
                <td className="p-2 font-semibold">{f.name}</td>
                <td className="p-2 text-slate-600">{f.description}</td>
                <td className="p-2 text-right font-mono font-bold">{f.score}</td>
                <td className="p-2 text-right font-mono text-slate-500">{f.maxPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-8 text-center pt-8 mt-8 border-t border-slate-300">
        <div>
          <div className="mb-14 text-slate-600">Siswa Pendaftar,</div>
          <div className="font-bold underline">{data.studentName || '(Nama Siswa)'}</div>
          <div className="text-[10px] text-slate-500">NISN Siswa</div>
        </div>

        <div>
          <div className="mb-14 text-slate-600">Orang Tua / Wali,</div>
          <div className="font-bold underline">(&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;)</div>
          <div className="text-[10px] text-slate-500">Tanda Tangan</div>
        </div>

        <div>
          <div className="mb-14 text-slate-600">Guru Bimbingan Konseling (BK),</div>
          <div className="font-bold underline">(&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;)</div>
          <div className="text-[10px] text-slate-500">NIP Guru BK</div>
        </div>
      </div>
    </div>
  );
};
