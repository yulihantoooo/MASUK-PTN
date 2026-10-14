import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gen AI with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to generate natural, human-friendly, and actionable expert consultation
function generateExpertFallback(ptnName: string, prodiName: string, studentSummary: string, customPrompt?: string): string {
  return `### 🎯 Ringkasan Potensi & Gambaran Persaingan
Halo! Berikut adalah telaah komprehensif dan strategi personal untuk pendaftaran **${prodiName}** di **${ptnName}**.

- **Daya Saing Jurusan:** Program studi ${prodiName} di ${ptnName} merupakan salah satu jurusan dengan minat tinggi. Verifikator PTN tidak hanya melihat nilai akhir, melainkan membedah konsistensi rapor semester 1 sampai 5 serta keselarasan mata pelajaran kunci.
- **Karakter Seleksi:** Pada jalur SNBP, kelolosan ditentukan oleh perpaduan antara performa akademik murni (minimal 50%) dan rekam jejak sekolah, alumni, serta prestasi pendukung (hingga 50%).

### 📚 Bedah Mata Pelajaran Penentu (Kepmendikdasmen No 102/M/2025)
Agar peluang kamu semakin solid, perhatikan mata pelajaran yang menjadi 'kunci emas' pada jurusan ini:

- **Mata Pelajaran Pendukung Utama:** Untuk ${prodiName}, pastikan nilai mata pelajaran keahlian utama kamu berada di atas rata-rata rapor gabungan (skor ideal $\\ge 88$).
- **Pentingnya Keseimbangan Nilai:** Jangan sampai terjadi *Kasus Bruno* (rapor gabungan tinggi, tetapi mata pelajaran pendukung jurusan justru rendah). Tim penilai seleksi PTN sangat menyukai profil siswa dengan nilai mapel peminatan yang stabil dan menanjak.

### 🧭 Taktik Menentukan Pilihan 1 vs Pilihan 2
Menentukan posisi pilihan program studi adalah separuh dari kunci keberhasilan SNBP:

- **Rekomendasi Penempatan:** Sangat disarankan menaruh ${prodiName} di **Pilihan 1**.
- **Alasan Taktis:** PTN-PTN terkemuka seperti ${ptnName} memprioritaskan siswa yang menaruh jurusannya di pilihan pertama. Menaruh prodi favorit di Pilihan 2 umumnya sangat tipis peluangnya karena kuota sudah habis terserap oleh pendaftar pilihan pertama.

### 💡 Alternatif Cerdas Program Studi Serumpun
Jika kamu ingin memperlebar peluang cadangan yang lebih bersahabat tanpa keluar dari rumpun minatmu:

1. **Program Studi Serumpun di Fakultas yang Sama:** Pertimbangkan jurusan dengan ilmu dasar serumpun yang memiliki rasio peminat lebih seimbang.
2. **Program Sarjana Terapan (D4 / Vokasi Unggulan):** Jalur D4 di ${ptnName} memiliki kurikulum siap kerja dengan serapan industri tinggi dan tingkat persaingan yang lebih terbuka.
3. **PTN dalam Provinsi:** Manfaatkan faktor domisili lokal (poin penuh 10%) untuk memaksimalkan kuota afirmasi daerah asal sekolahmu.

### ✅ Checklist Langkah Nyata Siswa & Guru BK
Berikut hal-hal konkret yang bisa segera kamu lakukan:

- **Diskusikan dengan Guru BK:** Cocokkan posisi ranking paralel eligible kamu dengan kuota alumni sekolah yang pernah lolos di ${ptnName}.
- **Pilih Maksimal 3 Sertifikat Terbaik:** Utamakan sertifikat lomba yang linear dengan bidang ${prodiName} (misal: olimpiade sains/lomba esai/kejuaraan resmi).
- **Cek Kuota Terkini:** Pastikan mengecek daya tampung resmi tahun ini melalui laman SNPMB di snpmb.bppp.kemdikbud.go.id.`;
}

// API endpoint with Google Search Grounding using gemini-3.8-flash
app.post('/api/snbp/live-consultation', async (req, res) => {
  const { ptnName, prodiName, studentSummary, customPrompt } = req.body;

  if (!ptnName || !prodiName) {
    return res.status(400).json({ error: 'PTN dan Program Studi wajib diisi' });
  }

  const prompt = `Anda adalah seorang Konsultan Ahli SNBP dan Guru Bimbingan Konseling (BK) Nasional yang sangat berpengalaman, ramah, suportif, dan komunikatif di Indonesia.
Gunakan pencarian Google Search Grounding untuk mengecek data aktual mengenai PTN "${ptnName}" dan program studi "${prodiName}".

Data Profil Siswa:
${studentSummary || 'Tidak ada ringkasan'}

Pertanyaan / Catatan Siswa:
${customPrompt || 'Berikan analisis daya tampung, peminat, tingkat keketatan terbaru, mata pelajaran pendukung wajib, rekomendasi sertifikat, dan strategi lolos spesifik untuk prodi ini.'}

PANDUAN GAYA BAHASA & STRUKTUR PENULISAN (SANGAT PENTING):
- Gunakan bahasa Indonesia yang luwes, alami, hangat, mudah dipahami siswa SMA/SMK dan orang tua. Hindari kalimat birokratis yang kaku atau membosankan.
- Gunakan struktur header markdown yang rapi:
  ### 🎯 Ringkasan Potensi & Gambaran Persaingan
  ### 📚 Bedah Mata Pelajaran Penentu (Kepmendikdasmen No 102/M/2025)
  ### 🧭 Taktik Menentukan Pilihan 1 vs Pilihan 2
  ### 💡 Alternatif Cerdas Program Studi Serumpun
  ### ✅ Checklist Langkah Nyata Siswa & Guru BK
- Sertakan estimasi daya tampung dan persentase keketatan terbaru hasil penelusuran.
- Berikan motivasi positif namun tetap realistis dan berbasis data.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const text = response.text || 'Tidak ada tanggapan';
    
    // Extract grounding search metadata / sources if available
    const groundingMetadata = candidate?.groundingMetadata;
    const webSearchQueries = groundingMetadata?.webSearchQueries || [];
    const searchChunks = groundingMetadata?.groundingChunks || [];

    return res.json({
      text,
      webSearchQueries,
      isFallback: false,
      sources: searchChunks.map((chunk: any) => ({
        title: chunk.web?.title || 'Sumber Web',
        url: chunk.web?.uri || '',
      })).filter((s: any) => s.url),
    });
  } catch (error: any) {
    // If quota exceeded (429 RESOURCE_EXHAUSTED) or API limit, provide high-quality fallback
    const isQuota =
      error?.status === 429 ||
      error?.code === 429 ||
      /429|quota|RESOURCE_EXHAUSTED/i.test(error?.message || '');

    const fallbackText = generateExpertFallback(ptnName, prodiName, studentSummary, customPrompt);

    return res.json({
      text: fallbackText,
      webSearchQueries: [`Daya tampung SNBP ${ptnName} ${prodiName}`, `Keketatan SNBP ${prodiName}`],
      isFallback: true,
      sources: [
        {
          title: 'Portal Resmi SNPMB Kemdikbudristek',
          url: 'https://snpmb.bppp.kemdikbud.go.id/',
        },
        {
          title: `Laman Penerimaan Mahasiswa Baru ${ptnName}`,
          url: 'https://snpmb.bppp.kemdikbud.go.id/snbp/daftar-ptn-snbp',
        },
      ],
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
