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

// API endpoint with Google Search Grounding using gemini-3.8-flash
app.post('/api/snbp/live-consultation', async (req, res) => {
  try {
    const { ptnName, prodiName, studentSummary, customPrompt } = req.body;

    if (!ptnName || !prodiName) {
      return res.status(400).json({ error: 'PTN dan Program Studi wajib diisi' });
    }

    const prompt = `Anda adalah konsultan ahli SNBP (Seleksi Nasional Berdasarkan Prestasi) Kemendikbudristek & SNPMB di Indonesia.
Gunakan pencarian Google Search Grounding terbaru untuk mengecek informasi resmi & aktual mengenai PTN "${ptnName}" dan program studi "${prodiName}".

Data Profil Siswa:
${studentSummary || 'Tidak ada ringkasan'}

Pertanyaan / Kebutuhan Siswa:
${customPrompt || 'Berikan analisis daya tampung, peminat, tingkat keketatan terbaru, mata pelajaran pendukung wajib, rekomendasi sertifikat, dan strategi lolos spesifik untuk prodi ini.'}

Instruksi Analisis:
1. Cari data daya tampung SNBP terbaru, jumlah pendaftar/peminat tahun sebelumnya, dan persentase keketatan prodi "${prodiName}" di "${ptnName}".
2. Analisis keselarasan nilai rapor & mata pelajaran pendukung siswa berdasarkan Kepmendikdasmen No 102/M/2025.
3. Berikan saran realistis apakah prodi ini cocok sebagai Pilihan 1 atau Pilihan 2 (ingat kebijakan PTN seperti UNAIR/ITB sangat memprioritaskan Pilihan 1).
4. Berikan 3-4 rekomendasi alternatif program studi serumpun jika persaingan sangat ketat.
5. Format jawaban dengan markdown rapi, terstruktur dengan header, poin-poin tegas, dan bahasa Indonesia yang suportif, profesional, serta jelas.`;

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
      sources: searchChunks.map((chunk: any) => ({
        title: chunk.web?.title || 'Sumber Web',
        url: chunk.web?.uri || '',
      })).filter((s: any) => s.url),
    });
  } catch (error: any) {
    console.error('Error generating SNBP consultation:', error);
    return res.status(500).json({
      error: error?.message || 'Gagal melakukan konsultasi dengan Gemini Search Grounding',
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
