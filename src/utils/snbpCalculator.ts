import {
  StudentInputData,
  PredictionResult,
  FactorScoreBreakdown,
  PTNChoice,
} from '../types/snbp';

export function calculateAverageGrade(grades: { sem1: number; sem2: number; sem3: number; sem4: number; sem5: number }): number {
  const vals = [grades.sem1, grades.sem2, grades.sem3, grades.sem4, grades.sem5];
  const sum = vals.reduce((a, b) => a + b, 0);
  return Number((sum / vals.length).toFixed(2));
}

export function evaluateGradeTrend(grades: { sem1: number; sem2: number; sem3: number; sem4: number; sem5: number }) {
  const vals = [grades.sem1, grades.sem2, grades.sem3, grades.sem4, grades.sem5];
  const diff = vals[4] - vals[0];
  
  let isStrictlyIncreasing = true;
  let isStrictlyDecreasing = true;
  let hasSharpDrop = false;

  for (let i = 1; i < vals.length; i++) {
    if (vals[i] < vals[i - 1]) isStrictlyIncreasing = false;
    if (vals[i] > vals[i - 1]) isStrictlyDecreasing = false;
    if (vals[i - 1] - vals[i] >= 4) hasSharpDrop = true;
  }

  if (isStrictlyIncreasing && diff >= 2) {
    return {
      type: 'meningkat' as const,
      message: 'Tren nilai rapor sangat ideal (konsisten meningkat dari Semester 1 s.d. 5). Menjadi nilai tambah krusial di SNBP!',
      scoreChange: diff,
    };
  } else if (hasSharpDrop) {
    return {
      type: 'fluktuatif' as const,
      message: 'Terdapat penurunan nilai yang cukup tajam pada salah satu semester. Hal ini dapat menjadi catatan evaluasi panitia SNPMB.',
      scoreChange: diff,
    };
  } else if (isStrictlyDecreasing && diff <= -2) {
    return {
      type: 'menurun' as const,
      message: 'Tren nilai rapor mengalami penurunan. PTN sangat menghindari tren nilai yang merosot pada semester akhir.',
      scoreChange: diff,
    };
  } else {
    return {
      type: 'stabil' as const,
      message: 'Nilai rapor cenderung stabil dan konsisten sepanjang semester 1 hingga 5.',
      scoreChange: diff,
    };
  }
}

export function calculateSNBPPrediction(input: StudentInputData, targetChoice: PTNChoice = input.ptnChoice1): PredictionResult {
  const avgRapor = calculateAverageGrade(input.semesterGrades);
  const trend = evaluateGradeTrend(input.semesterGrades);
  const mode = input.ptnSpecificMode || 'standard';

  // 1. FAKTOR 1: Nilai Rapor Semester 1-5 (Bobot max 25%)
  let raporScore = 5;
  if (avgRapor >= 90) {
    raporScore = 25;
  } else if (avgRapor >= 85) {
    raporScore = 20;
  } else if (avgRapor >= 80) {
    raporScore = 15;
  } else if (avgRapor >= 75) {
    raporScore = 10;
  } else {
    raporScore = 5;
  }

  // 2. FAKTOR 2: Sertifikat Pendukung (Bobot max 20%)
  const certCount = Math.min(input.certificates.length, 3);
  let certScore = 0;
  if (certCount === 1) certScore = 6;
  else if (certCount === 2) certScore = 14;
  else if (certCount >= 3) certScore = 20;

  // 3. FAKTOR 3: Track Record Alumni (Bobot max 15%)
  let alumniScore = 0;
  if (targetChoice.alumniCount === '1') alumniScore = 5;
  else if (targetChoice.alumniCount === '2-5') alumniScore = 10;
  else if (targetChoice.alumniCount === '>5') alumniScore = 15;

  // 4. FAKTOR 4: Ranking Paralel di Sekolah (Bobot max 10%)
  let rankScore = 4;
  if (input.parallelRank === '1-10') rankScore = 10;
  else if (input.parallelRank === '11-20') rankScore = 7;
  else rankScore = 4;

  // 5. FAKTOR 5: Akreditasi Sekolah (Bobot max 10%)
  let accredScore = 4;
  if (input.accreditation === 'A') accredScore = 10;
  else if (input.accreditation === 'B') accredScore = 7;
  else accredScore = 4;

  // 6. FAKTOR 6: Domisili PTN (Bobot max 10%)
  const isSameProvince = Boolean(
    input.schoolProvince &&
    targetChoice.province &&
    input.schoolProvince.toLowerCase().trim() === targetChoice.province.toLowerCase().trim()
  );
  const domisiliScore = isSameProvince ? 10 : 5;

  // 7. FAKTOR 7: Lintas Jurusan & Kesesuaian Mapel Pendukung (Bobot max 15%)
  // Rata-rata nilai mapel pendukung
  const supportingAvg = input.supportingSubjects.length > 0
    ? input.supportingSubjects.reduce((acc, curr) => acc + curr.averageGrade, 0) / input.supportingSubjects.length
    : avgRapor;

  let mapelScore = 7;
  if (supportingAvg >= 88) {
    mapelScore = 15;
  } else if (supportingAvg >= 80) {
    mapelScore = 11;
  } else if (supportingAvg >= 75) {
    mapelScore = 7;
  } else {
    mapelScore = 3;
  }

  // 8. FAKTOR 8: KKM/KKTP Sekolah (Bobot max 5%)
  const kkmScore = input.schoolKKM >= 78 ? 5 : 3;

  // Base 8 Factors Calculation
  let baseScore = raporScore + certScore + alumniScore + rankScore + accredScore + domisiliScore + mapelScore + kkmScore;

  // PTN Specific Adjustments based on official guidelines in slides
  let ptnSpecificNotes = '';
  let finalScore = baseScore;

  if (mode === 'ipb') {
    // IPB: 50% Rata-rata Seluruh Rapor + 50% Mapel Pendukung + Prestasi
    const normalizedRapor = (avgRapor / 100) * 50;
    const normalizedMapel = (supportingAvg / 100) * 40;
    const normalizedPrestasi = (certScore / 20) * 10;
    finalScore = Number((normalizedRapor + normalizedMapel + normalizedPrestasi).toFixed(1));
    ptnSpecificNotes = 'Menggunakan Skema Khusus IPB: 50% Rata-rata Rapor + 50% Mapel Pendukung & Prestasi Tambahan.';
  } else if (mode === 'ub') {
    // UB: 50% Rapor Semua Mapel + 40% Mapel Pendukung + 10% Skor Prestasi
    const normalizedRapor = (avgRapor / 100) * 50;
    const normalizedMapel = (supportingAvg / 100) * 40;
    const normalizedPrestasi = (certScore / 20) * 10;
    finalScore = Number((normalizedRapor + normalizedMapel + normalizedPrestasi).toFixed(1));
    ptnSpecificNotes = 'Menggunakan Skema Khusus Universitas Brawijaya (UB): 50% Rapor + 40% Mapel Pendukung + 10% Prestasi.';
  } else if (mode === 'unpad') {
    // UNPAD: Min 50% Rapor Seluruh Mapel + Maks 50% Mapel Pendukung & Prestasi
    const normalizedRapor = (avgRapor / 100) * 50;
    const normalizedPendukung = (supportingAvg / 100) * 35 + (certScore / 20) * 15;
    finalScore = Number((normalizedRapor + normalizedPendukung).toFixed(1));
    ptnSpecificNotes = 'Menggunakan Skema Khusus UNPAD: Min 50% Rata-rata Rapor + Maks 50% Mapel Pendukung & Portofolio/Prestasi.';
  } else if (mode === 'unair') {
    // UNAIR: Urutan pilihan mutlak! Kalau di pilihan 2 untuk prodi favorit, penalti berat
    if (targetChoice.priorityOrder === 2) {
      finalScore = Math.max(20, finalScore - 15);
      ptnSpecificNotes = 'PERINGATAN UNAIR: UNAIR memprioritaskan Pilihan 1. Peluang di Pilihan 2 menurun drastis.';
    } else {
      ptnSpecificNotes = 'Menggunakan Skema UNAIR: Mengutamakan Pilihan 1, Rekam Jejak Sekolah, dan Prestasi.';
    }
  } else if (mode === 'itb') {
    // ITB: Penjurusan TPB (Tahap Persiapan Bersama), Rapor & Prestasi Utama
    ptnSpecificNotes = 'Menggunakan Skema ITB: Pemilihan berbasis Fakultas/Sekolah TPB, bukan prodi langsung. Prestasi dan konsistensi sains sangat menentukan.';
  }

  // Blacklist check
  if (targetChoice.hasBlacklistHistory) {
    finalScore = Math.max(10, finalScore - 30);
    ptnSpecificNotes += ' PERINGATAN KRITIS: Sekolah terdeteksi memiliki rekam jejak alumni yang mengundurkan diri (potensi blacklist PTN).';
  }

  // Bruno vs Rose disparity diagnostics (Slide 10-11)
  let consistencyWarning: string | undefined;
  if (avgRapor >= 92 && supportingAvg <= 78) {
    consistencyWarning = 'Peringatan Diskrepansi (Kasus Bruno): Rata-rata rapor sangat tinggi namun nilai mapel pendukung rendah. PTN mendeteksi ketidaksesuaian kompetensi bidang studi.';
    finalScore = Math.max(10, finalScore - 8);
  }

  // Categorize
  let category: PredictionResult['category'] = 'Moderat';
  let summaryMessage = '';
  if (finalScore >= 82) {
    category = 'Sangat Tinggi';
    summaryMessage = 'Profil Anda sangat kuat! Berpeluang besar lolos SNBP pada pilihan program studi ini.';
  } else if (finalScore >= 70) {
    category = 'Kompetitif';
    summaryMessage = 'Profil Anda cukup kompetitif. Sangat direkomendasikan ditempatkan pada Pilihan 1 SNBP.';
  } else if (finalScore >= 55) {
    category = 'Moderat';
    summaryMessage = 'Peluang berada di zona moderat/tengah. Pertimbangkan prodi serumpun dengan keketatan lebih bersahabat.';
  } else {
    category = 'Beresiko Tinggi';
    summaryMessage = 'Peluang berisiko tinggi di prodi ini. Disarankan menyiapkan prodi alternatif atau fokus strategi UTBK-SNBT.';
  }

  const factors: FactorScoreBreakdown[] = [
    {
      name: '1. Rata-Rata Rapor Semester 1-5',
      maxPoints: 25,
      score: raporScore,
      percentage: Math.round((raporScore / 25) * 100),
      description: `Rata-rata: ${avgRapor} (${avgRapor >= 90 ? 'Di atas 90' : avgRapor >= 85 ? '85 - 89' : avgRapor >= 80 ? '80 - 84' : avgRapor >= 75 ? '75 - 79' : 'Kurang dari 75'})`,
      status: raporScore >= 20 ? 'optimal' : raporScore >= 15 ? 'good' : 'warning',
    },
    {
      name: '2. Sertifikat Prestasi Pendukung',
      maxPoints: 20,
      score: certScore,
      percentage: Math.round((certScore / 20) * 100),
      description: `${certCount} sertifikat terlampir (${certCount >= 3 ? 'Maksimal 3 prestasi' : certCount + ' prestasi'})`,
      status: certScore >= 14 ? 'optimal' : certScore >= 6 ? 'good' : 'danger',
    },
    {
      name: '3. Track Record Alumni di PTN & Prodi',
      maxPoints: 15,
      score: alumniScore,
      percentage: Math.round((alumniScore / 15) * 100),
      description: `Alumni diterima di prodi/PTN ini: ${targetChoice.alumniCount} orang`,
      status: alumniScore >= 10 ? 'optimal' : alumniScore >= 5 ? 'good' : 'warning',
    },
    {
      name: '4. Ranking Paralel Siswa Eligible',
      maxPoints: 10,
      score: rankScore,
      percentage: Math.round((rankScore / 10) * 100),
      description: `Peringkat paralel sekolah: ${input.parallelRank}`,
      status: rankScore === 10 ? 'optimal' : rankScore === 7 ? 'good' : 'warning',
    },
    {
      name: '5. Akreditasi Sekolah',
      maxPoints: 10,
      score: accredScore,
      percentage: Math.round((accredScore / 10) * 100),
      description: `Akreditasi: ${input.accreditation} (Kuota eligible: ${input.accreditation === 'A' ? '40%' : input.accreditation === 'B' ? '25%' : '5%'})`,
      status: accredScore === 10 ? 'optimal' : accredScore === 7 ? 'good' : 'warning',
    },
    {
      name: '6. Domisili Wilayah PTN',
      maxPoints: 10,
      score: domisiliScore,
      percentage: Math.round((domisiliScore / 10) * 100),
      description: isSameProvince ? `Satu provinsi (${input.schoolProvince})` : `Luar provinsi (${targetChoice.province || 'Lainnya'})`,
      status: isSameProvince ? 'optimal' : 'good',
    },
    {
      name: '7. Lintas Jurusan & Mapel Pendukung',
      maxPoints: 15,
      score: mapelScore,
      percentage: Math.round((mapelScore / 15) * 100),
      description: `Rata-rata mapel pendukung Kepmen: ${supportingAvg.toFixed(1)}`,
      status: mapelScore >= 11 ? 'optimal' : mapelScore >= 7 ? 'good' : 'warning',
    },
    {
      name: '8. KKM / KKTP Sekolah',
      maxPoints: 5,
      score: kkmScore,
      percentage: Math.round((kkmScore / 5) * 100),
      description: `KKM Sekolah: ${input.schoolKKM} (${input.schoolKKM >= 78 ? '≥ 78 standar tinggi' : '< 78'})`,
      status: kkmScore === 5 ? 'optimal' : 'warning',
    },
  ];

  // Specific strategic recommendations
  const recommendations: string[] = [];
  const risks: string[] = [];

  if (targetChoice.priorityOrder === 1) {
    recommendations.push('Menjadikan prodi ini sebagai Pilihan 1 adalah strategi tepat untuk memaksimalkan peluang lolos.');
  } else {
    risks.push('Memilih prodi kompetitif di Pilihan 2 sangat berisiko, terutama di PTN favorit yang kuotanya habis diserap pendaftar Pilihan 1.');
  }

  if (isSameProvince) {
    recommendations.push(`Memanfaatkan kuota afirmasi domisili lokal di ${input.schoolProvince}. PTN cenderung mengalokasikan porsi besar untuk putra daerah.`);
  } else {
    risks.push('Memilih PTN luar provinsi tanpa didukung alumni kuat dapat memperketat persaingan dengan pendaftar lokal.');
  }

  if (targetChoice.alumniCount === '0') {
    risks.push('Belum ada track record alumni sekolah Anda di jurusan ini. Jurusan ini tergolong perintis untuk sekolah Anda.');
    recommendations.push('Jika memilih jurusan perintis tanpa alumni, pastikan nilai rapor Anda mendominasi dan memiliki sertifikat minimal tingkat provinsi.');
  } else {
    recommendations.push(`Adanya ${targetChoice.alumniCount} alumni di jurusan ini membuktikan jalur penerimaan sudah terbuka untuk sekolah Anda.`);
  }

  if (certCount === 0) {
    risks.push('Tidak melampirkan sertifikat prestasi (bobot 20% menjadi 0). Anda kehilangan poin signifikan dibanding kompetitor.');
    recommendations.push('Segera periksa kembali apakah ada sertifikat olimpiade, lomba esai, kepengurusan OSIS/MPK, atau kejuaraan ekstrakurikuler resmi.');
  }

  if (trend.type === 'meningkat') {
    recommendations.push('Grafik nilai yang terus menanjak memberikan sinyal positif bagi verifikator PTN bahwa performa akademik Anda sedang berada di puncak.');
  }

  return {
    totalScore: Math.round(finalScore),
    category,
    chancePercentage: Math.min(99, Math.max(5, Math.round(finalScore))),
    summaryMessage,
    factors,
    trendAnalysis: trend,
    recommendations,
    risks,
    ptnSpecificNotes,
    consistencyWarning,
  };
}
