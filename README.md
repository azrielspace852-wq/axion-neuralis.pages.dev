# AXION Neuralis — Public Documentation Portal

Portal publik AXION untuk tiga dokumen inti: Company Bible, Company Blueprint, dan Company Roadmap.

Prinsip editorial situs: **dokumen publik adalah source-of-truth, bukan sekadar materi yang disalin ke halaman web**. File Markdown di `frontend/docs/*.md` dipertahankan sebagai source layer; HTML di `frontend/docs/*.html` menjadi documentation layer yang menambahkan metadata, konteks batas publik, dan pengalaman baca yang lebih terstruktur.

## Struktur

```text
frontend/
  index.html              # documentation hub + responsive document switcher
  css/style.css           # design system, responsive layout, accessibility
  js/tts.js               # client TTS
  docs/
    BIBLE.md              # source publik
    BLUEPRINT.md          # source publik
    ROADMAP.md            # source publik
    bible.html            # presentation layer
    blueprint.html        # presentation layer
    roadmap.html          # presentation layer
  _headers
  _redirects
  404.html
  robots.txt
  sitemap.xml

workers/axion-tts-worker/
  src/index.js
  wrangler.toml
  README.md
```

## UI changes

- Layout menggunakan fluid sizing, CSS Grid/Flexbox, `clamp()`, dan breakpoint bertahap agar nyaman dari ponsel kecil sampai desktop lebar.
- Header dan document switcher tetap usable pada layar sempit.
- Konten dokumen memiliki reading column, callout, metadata cards, table overflow, serta table-of-contents desktop.
- Deep-link `#bible`, `#blueprint`, dan `#roadmap` tetap didukung.
- TTS tetap menggunakan Worker yang sudah ada.
- Tidak ada library UI tambahan; situs tetap ringan dan mudah dideploy sebagai Cloudflare Pages.

## Deploy

### Workers
```bash
cd workers/axion-tts-worker
wrangler secret put GEMINI_API_KEY
wrangler deploy
```

### Pages
Deploy isi folder `frontend/` ke Cloudflare Pages dengan domain:
`https://axion-neuralis.axn.cc.cd`

Worker URL tetap:
`https://axion-neuralis-workers.axn.cc.cd`
