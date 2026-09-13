# AXION Neuralis — Updated Public Docs + TTS Read Feature

Paket berisi:

```
frontend/          → Cloudflare Pages (situs + dokumentasi publik)
workers/
  axion-tts-worker/ → Cloudflare Worker untuk fitur Read (TTS)
```

## 1. Frontend (Pages)

- Konten dokumentasi diganti dengan **versi publik** Company Bible, Blueprint, dan Roadmap.
- Halaman baru: `/docs.html` — tab Bible / Blueprint / Roadmap + tombol **Dengarkan**.
- File sumber publik: `frontend/docs/AXION_*.md` dan `section-*.html`.
- Client TTS: `frontend/js/tts.js`.

### Deploy Pages

1. Upload isi folder `frontend/` ke Cloudflare Pages (atau connect Git).
2. Setelah Worker di-deploy, set URL Worker di frontend:

   Buka `js/tts.js` dan ganti:

   ```js
   const DEFAULT_WORKER_URL = 'https://axion-tts-worker.YOUR_SUBDOMAIN.workers.dev';
   ```

   Atau inject di halaman sebelum `tts.js`:

   ```html
   <script>window.AXION_TTS_WORKER_URL = 'https://...workers.dev';</script>
   <script src="/js/tts.js"></script>
   ```

## 2. Backend (Workers) — Fitur Read / TTS

- Model: **gemini-3.1-flash-tts-preview**
- Voice: **Charon**
- Nada: santai, conversational, jeda natural (prompt + audio tags)

### Secret yang wajib diisi di Dashboard Cloudflare

| Name            | Type   | Keterangan                          |
|-----------------|--------|-------------------------------------|
| `GEMINI_API_KEY`| Secret | API key Google AI Studio / Gemini   |

Lihat `workers/axion-tts-worker/README.md` untuk detail deploy & API.

## 3. Alur TTS

```
Browser (docs.html / tombol Dengarkan)
    → POST /tts  { text, voice: "Charon" }
    → Worker (secret GEMINI_API_KEY)
    → Gemini generateContent (AUDIO + speechConfig Charon + style prompt)
    → JSON { audioBase64: PCM 24kHz }
    → Frontend konversi PCM → WAV → play
```

## 4. Catatan keamanan (sesuai Company Bible publik)

- API key **hanya** di Cloudflare Secret — tidak masuk ke repository / frontend.
- Teks yang dikirim ke TTS hanya konten publik dokumentasi (bukan secret / PII / data finansial).
