import React, { useState, useMemo } from 'react';
import { StudentInputData, PTNChoice } from './types/snbp';
import { calculateSNBPPrediction } from './utils/snbpCalculator';
import { Navbar } from './components/Navbar';
import { StudentProfileForm } from './components/StudentProfileForm';
import { PredictionResultCard } from './components/PredictionResultCard';
import { KepmenReferenceModal } from './components/KepmenReferenceModal';
import { HistoricalBenchmarkModal } from './components/HistoricalBenchmarkModal';
import { BrunoRoseCaseStudyModal } from './components/BrunoRoseCaseStudyModal';
import { LiveSearchGroundingModal } from './components/LiveSearchGroundingModal';
import { DeveloperModal } from './components/DeveloperModal';
import { PrintReportView } from './components/PrintReportView';
import { Sparkles, Compass, Lightbulb, Users, UserCheck } from 'lucide-react';

const INITIAL_STUDENT_DATA: StudentInputData = {
  studentName: 'Aninda Putri',
  schoolName: 'SMAN 1 Semarang',
  schoolProvince: 'Jawa Tengah',
  accreditation: 'A',
  parallelRank: '1-10',
  schoolKKM: 80,
  curriculum: 'Kurikulum Merdeka',
  semesterGrades: {
    sem1: 90.0,
    sem2: 91.5,
    sem3: 92.5,
    sem4: 95.0,
    sem5: 97.5,
  },
  supportingSubjects: [
    { subjectName: 'Biologi (Mapel Pendukung)', averageGrade: 95.0 },
    { subjectName: 'Kimia (Mapel Pendukung)', averageGrade: 93.5 },
  ],
  certificates: [
    {
      id: '1',
      name: 'Juara 2 OSN Biologi Tingkat Provinsi',
      category: 'OSN',
      level: 'Provinsi',
      ranking: 'Juara 2',
    },
    {
      id: '2',
      name: 'Ketua Umum OSIS SMAN 1 Semarang',
      category: 'Kepengurusan OSIS/MPK',
      level: 'Sekolah',
      ranking: 'Finalis / Pengurus',
    },
  ],
  ptnChoice1: {
    ptnName: 'Universitas Diponegoro (UNDIP)',
    province: 'Jawa Tengah',
    prodiName: 'Kedokteran',
    kelompokProdi: 'Kedokteran',
    alumniCount: '>5',
    hasBlacklistHistory: false,
    priorityOrder: 1,
  },
  ptnSpecificMode: 'standard',
};

export default function App() {
  const [studentData, setStudentData] = useState<StudentInputData>(INITIAL_STUDENT_DATA);

  // Modals state
  const [isKepmenOpen, setIsKepmenOpen] = useState(false);
  const [isBenchmarksOpen, setIsBenchmarksOpen] = useState(false);
  const [isBrunoRoseOpen, setIsBrunoRoseOpen] = useState(false);
  const [isLiveConsultationOpen, setIsLiveConsultationOpen] = useState(false);
  const [isDeveloperOpen, setIsDeveloperOpen] = useState(false);

  // Compute live prediction
  const prediction = useMemo(() => {
    return calculateSNBPPrediction(studentData, studentData.ptnChoice1);
  }, [studentData]);

  // Handle Preset Loads for quick testing
  const loadPreset = (preset: 'aninda' | 'bruno' | 'rose' | 'lintas' | 'unnes') => {
    if (preset === 'aninda') {
      setStudentData({
        ...INITIAL_STUDENT_DATA,
        studentName: 'Aninda Permata',
        schoolName: 'SMAN 1 Semarang',
        schoolProvince: 'Jawa Tengah',
        accreditation: 'A',
        parallelRank: '1-10',
        schoolKKM: 80,
        semesterGrades: { sem1: 90, sem2: 91, sem3: 92, sem4: 95, sem5: 98 },
        supportingSubjects: [
          { subjectName: 'Biologi', averageGrade: 96 },
          { subjectName: 'Kimia', averageGrade: 94 },
        ],
        ptnChoice1: {
          ptnName: 'Universitas Diponegoro (UNDIP)',
          province: 'Jawa Tengah',
          prodiName: 'Kedokteran',
          kelompokProdi: 'Kedokteran',
          alumniCount: '>5',
          hasBlacklistHistory: false,
          priorityOrder: 1,
        },
      });
    } else if (preset === 'bruno') {
      // Kasus Bruno (Slide 11): Rapor 95.2 tapi TKA/mapel pendukung jeblok (328/1000 ~ 65)
      setStudentData({
        ...INITIAL_STUDENT_DATA,
        studentName: 'Bruno (Simulasi Diskrepansi)',
        schoolName: 'SMA Harapan Bangsa',
        schoolProvince: 'Jawa Barat',
        accreditation: 'A',
        parallelRank: '1-10',
        schoolKKM: 75,
        semesterGrades: { sem1: 93, sem2: 94, sem3: 96, sem4: 96, sem5: 97 },
        supportingSubjects: [
          { subjectName: 'Matematika Tingkat Lanjut', averageGrade: 68 },
          { subjectName: 'Fisika', averageGrade: 65 },
        ],
        certificates: [],
        ptnChoice1: {
          ptnName: 'Institut Teknologi Bandung (ITB)',
          province: 'Jawa Barat',
          prodiName: 'STEI (Sekolah Teknik Elektro & Informatika)',
          kelompokProdi: 'Komputer / Informatika',
          alumniCount: '1',
          hasBlacklistHistory: false,
          priorityOrder: 1,
        },
      });
    } else if (preset === 'rose') {
      // Kasus Rose (Slide 11): Rapor 88.6 stabil dan mapel pendukung sangat tinggi
      setStudentData({
        ...INITIAL_STUDENT_DATA,
        studentName: 'Rose (Simulasi Konsisten)',
        schoolName: 'SMA Negeri Unggulan',
        schoolProvince: 'Jawa Timur',
        accreditation: 'A',
        parallelRank: '1-10',
        schoolKKM: 80,
        semesterGrades: { sem1: 87, sem2: 88, sem3: 89, sem4: 89, sem5: 90 },
        supportingSubjects: [
          { subjectName: 'Matematika Tingkat Lanjut', averageGrade: 93 },
          { subjectName: 'Bahasa Indonesia', averageGrade: 91 },
        ],
        certificates: [
          {
            id: '1',
            name: 'Juara 1 Lomba Cerdas Cermat Nasional',
            category: 'Debat/Cerdas Cermat',
            level: 'Nasional',
            ranking: 'Juara 1',
          },
          {
            id: '2',
            name: 'Finalis Olimpiade Sains Nasional (OSN)',
            category: 'OSN',
            level: 'Nasional',
            ranking: 'Finalis / Pengurus',
          },
        ],
        ptnChoice1: {
          ptnName: 'Universitas Airlangga (UNAIR)',
          province: 'Jawa Timur',
          prodiName: 'Farmasi',
          kelompokProdi: 'Farmasi',
          alumniCount: '2-5',
          hasBlacklistHistory: false,
          priorityOrder: 1,
        },
      });
    } else if (preset === 'lintas') {
      // Siswa Lintas Jurusan
      setStudentData({
        ...INITIAL_STUDENT_DATA,
        studentName: 'Bima Satria (Siswa Lintas Jurusan)',
        schoolName: 'SMA Kusuma Bangsa',
        schoolProvince: 'D.I. Yogyakarta',
        accreditation: 'B',
        parallelRank: '11-20',
        schoolKKM: 78,
        semesterGrades: { sem1: 82, sem2: 84, sem3: 85, sem4: 86, sem5: 87 },
        supportingSubjects: [
          { subjectName: 'Sosiologi', averageGrade: 84 },
          { subjectName: 'Pendidikan Pancasila', averageGrade: 88 },
        ],
        certificates: [
          {
            id: '1',
            name: 'Juara 2 Lomba Debat Hukum Tingkat Kota',
            category: 'Debat/Cerdas Cermat',
            level: 'Kabupaten/Kota',
            ranking: 'Juara 2',
          },
        ],
        ptnChoice1: {
          ptnName: 'Universitas Gadjah Mada (UGM)',
          province: 'D.I. Yogyakarta',
          prodiName: 'Hukum',
          kelompokProdi: 'Hukum',
          alumniCount: '2-5',
          hasBlacklistHistory: false,
          priorityOrder: 1,
        },
      });
    } else if (preset === 'unnes') {
      // Siswa Target UNNES (UNES Semarang)
      setStudentData({
        ...INITIAL_STUDENT_DATA,
        studentName: 'Fahri Pratama (Target UNNES)',
        schoolName: 'SMAN 3 Semarang',
        schoolProvince: 'Jawa Tengah',
        accreditation: 'A',
        parallelRank: '1-10',
        schoolKKM: 80,
        semesterGrades: { sem1: 89, sem2: 90.5, sem3: 92, sem4: 93.5, sem5: 95 },
        supportingSubjects: [
          { subjectName: 'Matematika Tingkat Lanjut', averageGrade: 94 },
          { subjectName: 'Bahasa Indonesia', averageGrade: 93 },
        ],
        certificates: [
          {
            id: '1',
            name: 'Juara 1 Lomba Karya Tulis Ilmiah (LKTI) Jawa Tengah',
            category: 'LKTI/Esai',
            level: 'Provinsi',
            ranking: 'Juara 1',
          },
          {
            id: '2',
            name: 'Pengurus OSIS Bidang Akademik',
            category: 'Kepengurusan OSIS/MPK',
            level: 'Sekolah',
            ranking: 'Finalis / Pengurus',
          },
        ],
        ptnChoice1: {
          ptnName: 'Universitas Negeri Semarang (UNNES / UNES)',
          province: 'Jawa Tengah',
          prodiName: 'PGSD (Pendidikan Guru Sekolah Dasar)',
          kelompokProdi: 'Pendidikan',
          alumniCount: '>5',
          hasBlacklistHistory: false,
          priorityOrder: 1,
        },
      });
    }
  };

  const handleApplyBenchmark = (ptn: string, jurusan: string) => {
    setStudentData((prev) => ({
      ...prev,
      ptnChoice1: {
        ...prev.ptnChoice1,
        ptnName: ptn,
        prodiName: jurusan,
      },
    }));
  };

  const handleSelectKelompokFromKepmen = (kelompok: string, mapel: string) => {
    setStudentData((prev) => ({
      ...prev,
      ptnChoice1: {
        ...prev.ptnChoice1,
        kelompokProdi: kelompok,
      },
      supportingSubjects: [
        { subjectName: `${mapel} (Mapel Pendukung Kepmen)`, averageGrade: 88 },
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navbar Header */}
      <Navbar
        onOpenKepmen={() => setIsKepmenOpen(true)}
        onOpenBenchmarks={() => setIsBenchmarksOpen(true)}
        onOpenBrunoRose={() => setIsBrunoRoseOpen(true)}
        onOpenLiveConsultation={() => setIsLiveConsultationOpen(true)}
        onOpenDeveloper={() => setIsDeveloperOpen(true)}
        onPrint={() => window.print()}
      />

      {/* Hero Quick Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-800">
                <Compass className="w-3.5 h-3.5" />
                Sistem Penilaian Resmi SNBP 2026/2027
              </span>
              <button
                onClick={() => setIsDeveloperOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-700 hover:text-white px-2.5 py-0.5 rounded-full border border-slate-700 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>Pengembang:</span>
                <span className="font-bold text-cyan-300">Yulianto Harsono</span>
              </button>
              <span className="text-xs text-slate-400">Total Bobot: 100 Poin</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Kalkulator & Analisis 8 Faktor Kelolosan Masuk PTN
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Dikembangkan oleh <strong>Yulianto Harsono</strong> dengan memadukan 8 faktor penentu resmi (Nilai Rapor, Prestasi Sertifikat, Alumni, Ranking Paralel, Akreditasi, Domisili, Mapel Pendukung Kepmen No 102/M/2025, KKM), serta konsultasi akurat dengan <strong>Gemini Google Search Grounding</strong>.
            </p>
          </div>

          {/* Quick Simulation Presets */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Contoh Profil:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => loadPreset('aninda')}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Aninda (Tinggi)
              </button>
              <button
                onClick={() => loadPreset('bruno')}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 transition-colors"
                title="Rapor tinggi tapi TKA/mapel pendukung rendah"
              >
                Bruno (Inkonsisten)
              </button>
              <button
                onClick={() => loadPreset('rose')}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 transition-colors"
                title="Nilai rapor dan prestasi selaras"
              >
                Rose (Selaras)
              </button>
              <button
                onClick={() => loadPreset('lintas')}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800 transition-colors"
              >
                Lintas Jurusan
              </button>
              <button
                onClick={() => loadPreset('unnes')}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-700 transition-colors flex items-center gap-1"
                title="Simulasi Target Universitas Negeri Semarang (UNNES)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                UNNES Semarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Input (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <StudentProfileForm
              data={studentData}
              onChange={setStudentData}
              onOpenKepmenModal={() => setIsKepmenOpen(true)}
            />
          </div>

          {/* Right Column: Prediction Score & Strategic Analysis (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <PredictionResultCard
              prediction={prediction}
              studentData={studentData}
              onOpenLiveConsultation={() => setIsLiveConsultationOpen(true)}
              onOpenBrunoRose={() => setIsBrunoRoseOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Printable Hidden View */}
      <PrintReportView data={studentData} prediction={prediction} />

      {/* Modals */}
      <KepmenReferenceModal
        isOpen={isKepmenOpen}
        onClose={() => setIsKepmenOpen(false)}
        onSelectKelompok={handleSelectKelompokFromKepmen}
      />

      <HistoricalBenchmarkModal
        isOpen={isBenchmarksOpen}
        onClose={() => setIsBenchmarksOpen(false)}
        onApplyBenchmark={handleApplyBenchmark}
      />

      <BrunoRoseCaseStudyModal
        isOpen={isBrunoRoseOpen}
        onClose={() => setIsBrunoRoseOpen(false)}
      />

      <LiveSearchGroundingModal
        isOpen={isLiveConsultationOpen}
        onClose={() => setIsLiveConsultationOpen(false)}
        studentData={studentData}
        prediction={prediction}
      />

      <DeveloperModal
        isOpen={isDeveloperOpen}
        onClose={() => setIsDeveloperOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 px-4 text-xs text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span className="text-slate-300">
              Dikembangkan oleh{' '}
              <button
                onClick={() => setIsDeveloperOpen(true)}
                className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
              >
                Yulianto Harsono
              </button>
            </span>
            <span className="hidden sm:inline text-slate-600">&bull;</span>
            <span className="text-slate-400">
              Aplikasi Prediksi SNBP PTN &copy; {new Date().getFullYear()} (Kepmendikdasmen No 102/M/2025)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsDeveloperOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Tentang Pengembang
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsKepmenOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              59 Mapel Kepmen
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsBenchmarksOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Acuan Nilai PTN
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsBrunoRoseOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Kasus Bruno vs Rose
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
