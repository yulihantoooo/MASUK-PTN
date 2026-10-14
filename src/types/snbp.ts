export type SchoolAccreditation = 'A' | 'B' | 'C' | 'Lainnya';
export type ParallelRankingBracket = '1-10' | '11-20' | '>20';
export type AlumniTrackBracket = '0' | '1' | '2-5' | '>5';
export type CurriculumType = 'Kurikulum Merdeka' | 'Kurikulum 2013 (IPA)' | 'Kurikulum 2013 (IPS)' | 'Kurikulum 2013 (Bahasa)' | 'SMK';

export interface SemesterGrades {
  sem1: number;
  sem2: number;
  sem3: number;
  sem4: number;
  sem5: number;
}

export interface SupportingSubjectGrade {
  subjectName: string;
  averageGrade: number;
}

export interface CertificateItem {
  id: string;
  name: string;
  category: 'OSN' | 'O2SN' | 'FLS2N' | 'LKTI/Esai' | 'Debat/Cerdas Cermat' | 'Kepengurusan OSIS/MPK' | 'Olahraga/Seni' | 'Lainnya';
  level: 'Internasional' | 'Nasional' | 'Provinsi' | 'Kabupaten/Kota' | 'Sekolah';
  ranking: 'Juara 1' | 'Juara 2' | 'Juara 3' | 'Finalis / Pengurus' | 'Peserta';
}

export interface PTNChoice {
  ptnName: string;
  province: string;
  prodiName: string;
  kelompokProdi: string;
  alumniCount: AlumniTrackBracket;
  hasBlacklistHistory: boolean;
  priorityOrder: 1 | 2;
}

export interface StudentInputData {
  studentName: string;
  schoolName: string;
  schoolProvince: string;
  accreditation: SchoolAccreditation;
  parallelRank: ParallelRankingBracket;
  schoolKKM: number;
  curriculum: CurriculumType;
  semesterGrades: SemesterGrades;
  supportingSubjects: SupportingSubjectGrade[];
  certificates: CertificateItem[];
  ptnChoice1: PTNChoice;
  ptnChoice2?: PTNChoice;
  ptnSpecificMode?: 'standard' | 'itb' | 'ipb' | 'unpad' | 'unair' | 'ub';
}

export interface FactorScoreBreakdown {
  name: string;
  maxPoints: number;
  score: number;
  percentage: number;
  description: string;
  status: 'optimal' | 'good' | 'warning' | 'danger';
}

export interface PredictionResult {
  totalScore: number;
  category: 'Sangat Tinggi' | 'Kompetitif' | 'Moderat' | 'Beresiko Tinggi';
  chancePercentage: number;
  summaryMessage: string;
  factors: FactorScoreBreakdown[];
  trendAnalysis: {
    type: 'meningkat' | 'stabil' | 'fluktuatif' | 'menurun';
    message: string;
    scoreChange: number;
  };
  recommendations: string[];
  risks: string[];
  ptnSpecificNotes?: string;
  consistencyWarning?: string;
}

export interface MapelPendukungRule {
  no: number;
  rumpun: string;
  kelompokProdi: string;
  kurikulumMerdeka: string;
  kurikulum2013IPA: string;
  kurikulum2013IPS: string;
  kurikulum2013Bahasa: string;
}

export interface HistoricalMajorBenchmark {
  ptn: string;
  jurusan: string;
  jenjang: 'S1' | 'D4' | 'D3';
  rataRataRapor: number;
  keketatanEstimasi?: string;
}
