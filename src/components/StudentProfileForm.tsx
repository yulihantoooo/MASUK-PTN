import React from 'react';
import {
  StudentInputData,
  SchoolAccreditation,
  ParallelRankingBracket,
  CurriculumType,
  AlumniTrackBracket,
  CertificateItem,
} from '../types/snbp';
import { PROVINCES_INDONESIA, POPULAR_PTNS, MAPEL_PENDUKUNG_KEPMEN } from '../data/snbpData';
import { GradeTrendVisualizer } from './GradeTrendVisualizer';
import {
  User,
  School,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Building2,
  Sparkles,
} from 'lucide-react';

interface StudentProfileFormProps {
  data: StudentInputData;
  onChange: (data: StudentInputData) => void;
  onOpenKepmenModal: () => void;
}

export const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  data,
  onChange,
  onOpenKepmenModal,
}) => {
  const updateData = (fields: Partial<StudentInputData>) => {
    onChange({ ...data, ...fields });
  };

  const handlePtn1Select = (ptnName: string) => {
    const found = POPULAR_PTNS.find((p) => p.name === ptnName);
    updateData({
      ptnChoice1: {
        ...data.ptnChoice1,
        ptnName,
        province: found ? found.province : data.ptnChoice1.province,
      },
    });
  };

  const handleAddCertificate = () => {
    if (data.certificates.length >= 3) return;
    const newCert: CertificateItem = {
      id: Date.now().toString(),
      name: '',
      category: 'OSN',
      level: 'Nasional',
      ranking: 'Juara 1',
    };
    updateData({ certificates: [...data.certificates, newCert] });
  };

  const handleRemoveCertificate = (id: string) => {
    updateData({ certificates: data.certificates.filter((c) => c.id !== id) });
  };

  const handleUpdateCertificate = (id: string, fields: Partial<CertificateItem>) => {
    updateData({
      certificates: data.certificates.map((c) => (c.id === id ? { ...c, ...fields } : c)),
    });
  };

  const handleAddSupportingSubject = () => {
    updateData({
      supportingSubjects: [
        ...data.supportingSubjects,
        { subjectName: 'Mata Pelajaran Pendukung', averageGrade: 88 },
      ],
    });
  };

  const handleRemoveSupportingSubject = (idx: number) => {
    const next = [...data.supportingSubjects];
    next.splice(idx, 1);
    updateData({ supportingSubjects: next });
  };

  const handleUpdateSupportingSubject = (idx: number, name: string, grade: number) => {
    const next = [...data.supportingSubjects];
    next[idx] = { subjectName: name, averageGrade: grade };
    updateData({ supportingSubjects: next });
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: PROFIL SISWA & SEKOLAH */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <School className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">1. Profil Siswa & Indeks Sekolah</h3>
            <p className="text-xs text-slate-400">Akreditasi, ranking eligible, KKM, dan asal provinsi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Nama Siswa</label>
            <input
              type="text"
              placeholder="Contoh: Aninda Permata"
              value={data.studentName}
              onChange={(e) => updateData({ studentName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Nama Asal Sekolah</label>
            <input
              type="text"
              placeholder="Contoh: SMAN 1 Surakarta"
              value={data.schoolName}
              onChange={(e) => updateData({ schoolName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Provinsi Asal Sekolah</label>
            <select
              value={data.schoolProvince}
              onChange={(e) => updateData({ schoolProvince: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              {PROVINCES_INDONESIA.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Akreditasi Sekolah (Bobot 10%)
            </label>
            <select
              value={data.accreditation}
              onChange={(e) => updateData({ accreditation: e.target.value as SchoolAccreditation })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value="A">Akreditasi A (Kuota Eligible 40% - Nilai 10%)</option>
              <option value="B">Akreditasi B (Kuota Eligible 25% - Nilai 7%)</option>
              <option value="C">Akreditasi C (Kuota Eligible 5% - Nilai 4%)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Ranking Paralel di Sekolah (Bobot 10%)
            </label>
            <select
              value={data.parallelRank}
              onChange={(e) => updateData({ parallelRank: e.target.value as ParallelRankingBracket })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value="1-10">Peringkat 01 s.d. 10 (Maksimal 10%)</option>
              <option value="11-20">Peringkat 11 s.d. 20 (Nilai 7%)</option>
              <option value=">20">Peringkat &gt; 20 (Nilai 4%)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              KKM / KKTP Sekolah (Bobot 5%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="60"
                max="95"
                value={data.schoolKKM}
                onChange={(e) => updateData({ schoolKKM: Number(e.target.value) || 75 })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
              <span className={`text-[11px] font-semibold whitespace-nowrap px-2 py-1 rounded ${data.schoolKKM >= 78 ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                {data.schoolKKM >= 78 ? '≥ 78 (5%)' : '< 78 (3%)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: NILAI RAPOR SEMESTER 1-5 & MAPEL PENDUKUNG */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">2. Nilai Rapor Semester 1 - 5 (Bobot 25%)</h3>
              <p className="text-xs text-slate-400">Rata-rata semua mata pelajaran per semester</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenKepmenModal}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium bg-cyan-950/40 px-2.5 py-1.5 rounded-lg border border-cyan-800/60 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Lihat Mapel Pendukung Kepmen
          </button>
        </div>

        {/* 5 Semesters Input */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {[
            { key: 'sem1', label: 'Semester 1', sub: 'Kelas X Ganjil' },
            { key: 'sem2', label: 'Semester 2', sub: 'Kelas X Genap' },
            { key: 'sem3', label: 'Semester 3', sub: 'Kelas XI Ganjil' },
            { key: 'sem4', label: 'Semester 4', sub: 'Kelas XI Genap' },
            { key: 'sem5', label: 'Semester 5', sub: 'Kelas XII Ganjil' },
          ].map(({ key, label, sub }) => (
            <div key={key} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <label className="block text-slate-200 font-semibold">{label}</label>
              <span className="text-[10px] text-slate-400 block mb-1.5">{sub}</span>
              <input
                type="number"
                step="0.1"
                min="50"
                max="100"
                value={data.semesterGrades[key as keyof typeof data.semesterGrades]}
                onChange={(e) =>
                  updateData({
                    semesterGrades: {
                      ...data.semesterGrades,
                      [key]: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Visualizer Graph */}
        <GradeTrendVisualizer grades={data.semesterGrades} kkm={data.schoolKKM} />

        {/* Supporting Subjects Section */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Mata Pelajaran Pendukung Prodi (Bobot 15% - Kepmendikdasmen No 102/M/2025)
              </h4>
              <p className="text-[11px] text-slate-400">
                Nilai mapel kunci (contoh: Biologi & Kimia untuk Kedokteran, Matematika Tingkat Lanjut untuk Informatika)
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSupportingSubject}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Mapel
            </button>
          </div>

          <div className="space-y-2">
            {data.supportingSubjects.map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={sub.subjectName}
                    onChange={(e) => handleUpdateSupportingSubject(idx, e.target.value, sub.averageGrade)}
                    placeholder="Nama Mapel Pendukung (contoh: Biologi / Matematika TL)"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-32 flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="50"
                    max="100"
                    value={sub.averageGrade}
                    onChange={(e) =>
                      handleUpdateSupportingSubject(idx, sub.subjectName, parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-400 text-[11px]">Rata²</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSupportingSubject(idx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: TARGET PTN & ALUMNI TRACK */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">3. Pilihan PTN & Track Record Alumni</h3>
            <p className="text-xs text-slate-400">Domisili wilayah (10%), alumni diterima (15%), dan prioritas pilihan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Pilih Perguruan Tinggi Negeri (PTN)</label>
            <select
              value={data.ptnChoice1.ptnName}
              onChange={(e) => handlePtn1Select(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              {POPULAR_PTNS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.province})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Program Studi Target</label>
            <input
              type="text"
              placeholder="Contoh: Kedokteran / Teknik Informatika"
              value={data.ptnChoice1.prodiName}
              onChange={(e) =>
                updateData({
                  ptnChoice1: { ...data.ptnChoice1, prodiName: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Track Record Alumni Diterima (Bobot 15%)
            </label>
            <select
              value={data.ptnChoice1.alumniCount}
              onChange={(e) =>
                updateData({
                  ptnChoice1: {
                    ...data.ptnChoice1,
                    alumniCount: e.target.value as AlumniTrackBracket,
                  },
                })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              <option value=">5">&gt; 5 Alumni diterima (Maksimal 15%)</option>
              <option value="2-5">2 - 5 Alumni diterima (Nilai 10%)</option>
              <option value="1">1 Alumni diterima (Nilai 5%)</option>
              <option value="0">0 Alumni / Belum pernah ada (Nilai 0%)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Urutan Pilihan SNBP</label>
            <select
              value={data.ptnChoice1.priorityOrder}
              onChange={(e) =>
                updateData({
                  ptnChoice1: {
                    ...data.ptnChoice1,
                    priorityOrder: Number(e.target.value) as 1 | 2,
                  },
                })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              <option value={1}>Pilihan 1 (Prioritas Utama - Direkomendasikan)</option>
              <option value={2}>Pilihan 2 (Persaingan Berlipat Ganda)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Provinsi Lokasi PTN</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={data.ptnChoice1.province}
                className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl text-slate-300 focus:outline-none"
              />
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded whitespace-nowrap ${
                  data.schoolProvince === data.ptnChoice1.province
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                    : 'bg-blue-950/60 text-blue-400 border border-blue-800'
                }`}
              >
                {data.schoolProvince === data.ptnChoice1.province
                  ? 'Dalam Provinsi (10%)'
                  : 'Luar Provinsi (5%)'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Mode Penilaian Khusus Top PTN
            </label>
            <select
              value={data.ptnSpecificMode || 'standard'}
              onChange={(e) => updateData({ ptnSpecificMode: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-amber-300 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="standard">Standar Nasional (8 Faktor Penentu)</option>
              <option value="ipb">IPB University (50% Rapor + 50% Mapel Pendukung)</option>
              <option value="ub">Universitas Brawijaya (50:40:10)</option>
              <option value="unpad">Universitas Padjadjaran (UNPAD)</option>
              <option value="unair">Universitas Airlangga (UNAIR)</option>
              <option value="itb">Institut Teknologi Bandung (ITB)</option>
            </select>
          </div>
        </div>

        {/* Blacklist Warning Checkbox */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/70 transition-colors">
            <input
              type="checkbox"
              checked={data.ptnChoice1.hasBlacklistHistory}
              onChange={(e) =>
                updateData({
                  ptnChoice1: {
                    ...data.ptnChoice1,
                    hasBlacklistHistory: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700 focus:ring-0"
            />
            <span className="text-xs text-rose-300 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              Peringatan Alumni: Sekolah ini memiliki riwayat alumni yang lolos SNBP tapi tidak mendaftar ulang / mengundurkan diri di PTN ini.
            </span>
          </label>
        </div>
      </div>

      {/* SECTION 4: SERTIFIKAT PRESTASI PENDUKUNG */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">4. Sertifikat Prestasi Pendukung (Bobot 20%)</h3>
              <p className="text-xs text-slate-400">
                1 Sertifikat = 6%, 2 Sertifikat = 14%, 3 Sertifikat = 20% (Maksimal 3 Sertifikat)
              </p>
            </div>
          </div>
          {data.certificates.length < 3 && (
            <button
              type="button"
              onClick={handleAddCertificate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Sertifikat ({data.certificates.length}/3)
            </button>
          )}
        </div>

        {data.certificates.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
            Belum ada sertifikat ditambahkan. Siswa tanpa sertifikat kehilangan bobot 20% poin prestasi.
          </div>
        ) : (
          <div className="space-y-3">
            {data.certificates.map((cert, index) => (
              <div
                key={cert.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-4">
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Nama Prestasi #{index + 1}
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    placeholder="Contoh: Juara 1 OSN Matematika / Ketua OSIS"
                    onChange={(e) => handleUpdateCertificate(cert.id, { name: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] text-slate-400 block mb-1">Kategori (Slide 25)</label>
                  <select
                    value={cert.category}
                    onChange={(e) => handleUpdateCertificate(cert.id, { category: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="OSN">OSN (Sains / Matematika)</option>
                    <option value="O2SN">O2SN (Olahraga)</option>
                    <option value="FLS2N">FLS2N (Seni / Budaya)</option>
                    <option value="LKTI/Esai">LKTI / Esai Ilmiah</option>
                    <option value="Debat/Cerdas Cermat">Debat / Cerdas Cermat</option>
                    <option value="Kepengurusan OSIS/MPK">Kepengurusan OSIS / MPK</option>
                    <option value="Olahraga/Seni">Seni / Olahraga Mandiri</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-1">Tingkat</label>
                  <select
                    value={cert.level}
                    onChange={(e) => handleUpdateCertificate(cert.id, { level: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Internasional">Internasional</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                    <option value="Sekolah">Sekolah</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-1">Capaian</label>
                  <select
                    value={cert.ranking}
                    onChange={(e) => handleUpdateCertificate(cert.id, { ranking: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Juara 1">Juara 1</option>
                    <option value="Juara 2">Juara 2</option>
                    <option value="Juara 3">Juara 3</option>
                    <option value="Finalis / Pengurus">Finalis / Pengurus</option>
                    <option value="Peserta">Peserta</option>
                  </select>
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveCertificate(cert.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
