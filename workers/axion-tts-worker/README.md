# AXION Neuralis — TTS Worker

**Domain:** `https://axion-neuralis-workers.axn.cc.cd`  
**Fitur:** Read (Text-to-Speech)  
**Model:** `gemini-3.1-flash-tts-preview`  
**Voice:** Charon  

## Setup

1. Deploy Worker (Wrangler atau Dashboard).
2. **Custom Domain:** `axion-neuralis-workers.axn.cc.cd`
3. **Secret** di Dashboard → Settings → Variables:

| Name             | Type   | Value                          |
|------------------|--------|--------------------------------|
| `GEMINI_API_KEY` | Secret | API key Google AI Studio       |

```bash
wrangler secret put GEMINI_API_KEY
wrangler deploy
```

## API

### Health
```
GET https://axion-neuralis-workers.axn.cc.cd/health
```

### TTS (Read)
```
POST https://axion-neuralis-workers.axn.cc.cd/tts
Content-Type: application/json

{
  "text": "Teks yang akan dibacakan…",
  "voice": "Charon"
}
```

**Response:**
```json
{
  "success": true,
  "voice": "Charon",
  "model": "gemini-3.1-flash-tts-preview",
  "mimeType": "audio/L16;rate=24000",
  "audioBase64": "<PCM s16le 24kHz mono>",
  "format": "pcm_s16le_24khz_mono"
}
```

## Gaya bicara (sudah di-hardcode)

- Nada **santai**, calm, conversational  
- **Jeda natural** antar kalimat (`[short pause]`, `[medium pause]`)  
- Tempo sedikit lebih lambat agar nyaman didengar  

API key **hanya** di Cloudflare Secret — tidak pernah di frontend.
