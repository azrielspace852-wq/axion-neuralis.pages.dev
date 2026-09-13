# AXION Neuralis — Dokumentasi Publik + TTS Read (v2)

Dokumentasi publik yang dirancang ulang: **responsif penuh**, tampilan profesional dark-neural, dan konten disusun sebagai dokumentasi yang merujuk pada dokumen publik (bukan salinan mentah).

| Layanan  | Domain                              |
|----------|-------------------------------------|
| **Pages**   | `https://axion-neuralis.axn.cc.cd`        |
| **Workers** | `https://axion-neuralis-workers.axn.cc.cd` |

```
frontend/                     → Cloudflare Pages
  index.html                  → hub dokumentasi (sidebar + responsive)
  docs/bible.html             → Company Bible (dokumentasi terstruktur)
  docs/blueprint.html         → Blueprint (dokumentasi terstruktur)
  docs/roadmap.html           → Roadmap (dokumentasi terstruktur)
  docs/*.md                   → sumber markdown publik
  js/tts.js                   → client TTS
  css/style.css               → desain dark, fully responsive

workers/axion-tts-worker/     → Cloudflare Workers (tidak berubah)
```

## Perubahan utama (v2)

- **Fully responsive** — sidebar collapsible di mobile, layout menyesuaikan semua ukuran layar
- **Desain unik & profesional** — dark neural theme, principle cards, timeline, step list, TOC
- **Dokumentasi, bukan copy** — konten disusun ulang (cards, hierarchy, callout) dengan sumber dokumen publik
- **Navigasi lebih baik** — sidebar + TOC on-page + deep-link hash
- **TTS tetap** — tombol Dengarkan di setiap dokumen (Charon · Gemini TTS)

## Deploy

### 1. Workers
```bash
cd workers/axion-tts-worker
wrangler secret put GEMINI_API_KEY
wrangler deploy
```
Custom domain: `axion-neuralis-workers.axn.cc.cd`

### 2. Pages
Deploy isi folder `frontend/` ke Cloudflare Pages.  
Custom domain: `axion-neuralis.axn.cc.cd`
