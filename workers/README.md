# AXION Neuralis — TTS Worker (Cloudflare Workers)

Fitur **Read** menggunakan **Gemini 3.1 Flash TTS** dengan suara **Charon**.

## Fitur

- Endpoint `POST /tts` (alias `/api/read`)
- Model: `gemini-3.1-flash-tts-preview`
- Voice default: **Charon** (informative, calm)
- Style prompt built-in: nada **santai**, conversational, **jeda natural** (`[short pause]`, `[medium pause]`)
- CORS terbuka (siap untuk Pages)
- Health: `GET /health`

## Setup (Dashboard Cloudflare)

1. Buat Worker baru (atau deploy lewat Wrangler).
2. Buka **Settings → Variables and Secrets**.
3. Tambahkan **Secret**:
   - Name: `GEMINI_API_KEY`
   - Value: API key dari [Google AI Studio](https://aistudio.google.com/apikey)
4. Deploy.

### CLI (opsional)

```bash
cd axion-tts-worker
npm i -g wrangler   # jika belum
wrangler login
wrangler secret put GEMINI_API_KEY
wrangler deploy
```

## Request contoh

```bash
curl -X POST https://axion-tts-worker.<subdomain>.workers.dev/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "AXION membangun infrastruktur digital yang aman dan berfokus pada masa depan manusia.",
    "voice": "Charon"
  }'
```

Respons (JSON):

```json
{
  "success": true,
  "voice": "Charon",
  "model": "gemini-3.1-flash-tts-preview",
  "mimeType": "audio/L16;codec=pcm;rate=24000",
  "audioBase64": "<base64 PCM s16le 24kHz mono>",
  "format": "pcm_s16le_24khz_mono"
}
```

Frontend (`js/tts.js`) mengonversi PCM → WAV dan memutar otomatis.

## Konfigurasi gaya (sudah di-hardcode di Worker)

```
Speak in a relaxed, calm, conversational Indonesian-friendly tone.
Use natural pacing with gentle pauses between sentences and clauses.
Sound informative yet approachable, never rushed or robotic.
Prefer a slightly slower tempo so listeners can follow comfortably.
```

Plus inline tag `[short pause]` / `[medium pause]` setelah tanda baca & paragraf.

## Batasan

- Maks. teks ±4000 karakter per request (sesuai model).
- API key **hanya** di secret Cloudflare, tidak pernah di frontend.
