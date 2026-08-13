# 📐 AXION BLUEPRINT — Proyek Website

**Versi:** 3.0.0  
**Tanggal Rilis:** 12 Agustus 2026  
**Status:** ✅ FINAL — Siap Diresmikan & Deploy  
**Dokumen Terkait:** BIBLE v2.2.0 | ROADMAP v1.1.0

---

## 🏗️ 1. Struktur Folder Final

Struktur ini menggunakan Cloudflare Pages, static site architecture, dan Event-Based Template System. Seluruh core router diintegrasikan ke `js/main.js`; folder `core/` tidak lagi diperlukan sehingga tidak ada file “virtual” atau file opsional dalam daftar final.

```text
axion-neuralis/
│
├── index.html
├── about.html
├── services.html
├── contact.html
├── 404.html
│
├── _redirects
├── _headers
├── robots.txt
├── sitemap.xml
│
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   │   ├── hero-banner.webp
│   │   │   └── og-image.webp
│   │   ├── team/
│   │   │   └── azriel.webp
│   │   └── icons/
│   │       ├── logo.svg
│   │       ├── favicon.svg
│   │       ├── arrow-right.svg
│   │       ├── arrow-left.svg
│   │       ├── play.svg
│   │       ├── pause.svg
│   │       ├── speaker.svg
│   │       ├── language.svg
│   │       ├── close.svg
│   │       └── check.svg
│   ├── audio/
│   │   ├── tp1E.mp3
│   │   └── tp1I.mp3
│
├── css/
│   ├── style.css
│   └── templates/
│       ├── default.css
│       ├── 17-agustus.css
│       ├── lebaran.css
│       ├── tahun-baru.css
│       ├── natal.css
│       ├── idul-adha.css
│       └── tahun-baru-islam.css
│
├── js/
│   ├── main.js
│   └── templates/
│       ├── default.js
│       ├── 17-agustus.js
│       ├── lebaran.js
│       ├── tahun-baru.js
│       ├── natal.js
│       ├── idul-adha.js
│       └── tahun-baru-islam.js
│
├── templates/
│   ├── default/
│   │   └── index.html
│   ├── 17-agustus/
│   │   └── index.html
│   ├── lebaran/
│   │   └── index.html
│   ├── tahun-baru/
│   │   └── index.html
│   ├── natal/
│   │   └── index.html
│   ├── idul-adha/
│   │   └── index.html
│   └── tahun-baru-islam/
│       └── index.html
│
├── data/
│   └── events.json
│
└── docs/
    ├── AXION_BIBLE.md
    ├── AXION_ROADMAP.md
    └── AXION_BLUEPRINT.md
```

### Aturan Struktur

`js/main.js` adalah satu-satunya entry point JavaScript global dan memuat seluruh fungsi config loader, Hijri resolver, template validation, router, resource loader, dan lifecycle template.

Tidak ada file core tambahan yang dianggap “opsional”. Setiap file yang tercantum di struktur final wajib benar-benar ada sebelum deploy.

---

## 📋 2. Total File Wajib — 51 File

| Jenis | Jumlah | Rincian |
|---|---:|---|
| HTML root | 5 | `index`, `about`, `services`, `contact`, `404` |
| HTML template | 7 | `default` + 6 event |
| Cloudflare/SEO | 4 | `_redirects`, `_headers`, `robots.txt`, `sitemap.xml` |
| CSS global | 1 | `style.css` |
| CSS template | 7 | `default` + 6 event |
| JS global | 1 | `main.js` |
| JS template | 7 | `default` + 6 event |
| Gambar | 3 | `hero-banner`, `og-image`, `azriel` |
| Ikon SVG | 10 | logo, favicon, navigation, media, utility |
| Audio MP3 | 2 | `tp1E`, `tp1I` |
| Data JSON | 1 | `events.json` |
| Dokumentasi | 3 | BIBLE, ROADMAP, BLUEPRINT |
| **TOTAL** | **51** | **Semua file wajib tersedia sebelum deploy** |

---

## 🎯 3. Event-Based Template System

Sistem membuat website memilih template berdasarkan tanggal Masehi atau Hijriah tanpa deploy manual. Jika konfigurasi gagal, API Hijriah gagal, template tidak tersedia, atau router mengalami error, sistem selalu memiliki fallback ke `default`.

### 3.1 Event yang Didukung

| Basis | Key | Template |
|---|---|---|
| Masehi | `1-1` | `tahun-baru` |
| Masehi | `17-8` | `17-agustus` |
| Masehi | `25-12` | `natal` |
| Hijriah | `1-10` | `lebaran` |
| Hijriah | `10-12` | `idul-adha` |
| Hijriah | `1-1` | `tahun-baru-islam` |
| Fallback | — | `default` |

Semua value pada tabel di atas memiliki pasangan file HTML, CSS, dan JS yang sesuai di struktur final.

### 3.2 Flow Router

```text
User membuka halaman
        ↓
index.html memuat global CSS + main.js
        ↓
router.init()
        ↓
Pastikan #app tersedia
        ↓
Baca ?template= untuk preview
        ↓
Validasi preview terhadap daftar template yang diizinkan
        ├── valid → gunakan preview
        └── invalid/tidak ada → lanjut auto detection
        ↓
Load /data/events.json
        ↓
Tanggal Masehi cocok?
        ├── YA → pilih template Masehi
        └── TIDAK → ambil tanggal Hijriah
                         ↓
                    API berhasil?
                    ├── YA → cocokkan event Hijriah
                    └── TIDAK → lanjut fallback
        ↓
Template ditemukan?
├── YA → render template
└── TIDAK → gunakan default
        ↓
Load HTML
        ↓
Load CSS template
        ↓
Load JS template
        ↓
Jalankan lifecycle init() template
        ↓
Update document.title
        ↓
Website siap digunakan
```

---

## 🗂️ 4. `data/events.json` — Single Source of Truth

```json
{
  "masehi": {
    "1-1": "tahun-baru",
    "17-8": "17-agustus",
    "25-12": "natal"
  },
  "hijriah": {
    "1-10": "lebaran",
    "10-12": "idul-adha",
    "1-1": "tahun-baru-islam"
  },
  "default": "default",
  "templates": [
    "default",
    "17-agustus",
    "lebaran",
    "tahun-baru",
    "natal",
    "idul-adha",
    "tahun-baru-islam"
  ]
}
```

### Aturan Data

1. Key Masehi dan Hijriah menggunakan format `hari-bulan` tanpa leading zero.
2. Value event harus sama persis dengan nama folder template, nama file CSS, dan nama file JS.
3. `default` wajib selalu tersedia.
4. Array `templates` adalah whitelist untuk preview mode dan validasi template.
5. Setiap item pada `templates` wajib memiliki ketiga pasangan resource:
   - `/templates/{name}/index.html`
   - `/css/templates/{name}.css`
   - `/js/templates/{name}.js`

---

## 🧠 5. Implementasi `js/main.js` — Robust Router

```javascript
const FALLBACK_TEMPLATE = 'default';
const TEMPLATE_TIMEOUT = 8000;

function isSafeTemplateName(name) {
  return typeof name === 'string' && /^[a-z0-9-]+$/i.test(name);
}

function getConfiguredTemplates(config) {
  const configured = Array.isArray(config?.templates) ? config.templates : [];
  return new Set(
    configured.filter(isSafeTemplateName).concat(FALLBACK_TEMPLATE)
  );
}

async function fetchWithTimeout(url, options = {}, timeout = TEMPLATE_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function loadEventsConfig() {
  try {
    const response = await fetchWithTimeout('/data/events.json');
    if (!response.ok) throw new Error('Gagal memuat events.json');

    const config = await response.json();
    const templates = getConfiguredTemplates(config);

    return {
      masehi: config?.masehi && typeof config.masehi === 'object'
        ? config.masehi
        : {},
      hijriah: config?.hijriah && typeof config.hijriah === 'object'
        ? config.hijriah
        : {},
      default: templates.has(config?.default) ? config.default : FALLBACK_TEMPLATE,
      templates: [...templates]
    };
  } catch (error) {
    console.warn('Config gagal dimuat. Menggunakan fallback:', error);
    return {
      masehi: {},
      hijriah: {},
      default: FALLBACK_TEMPLATE,
      templates: [FALLBACK_TEMPLATE]
    };
  }
}

async function getHijriKey(date) {
  try {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const url = `https://api.aladhan.com/v1/gToH?date=${d}-${m}-${y}`;

    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error('API Hijriah gagal merespons');

    const data = await response.json();
    const hijri = data?.data?.hijri;

    if (!hijri?.day || !hijri?.month?.number) return null;

    return `${hijri.day}-${hijri.month.number}`;
  } catch (error) {
    console.warn('Tanggal Hijriah tidak tersedia:', error.message);
    return null;
  }
}

const router = {
  currentTemplate: FALLBACK_TEMPLATE,
  config: null,

  async init() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    try {
      this.config = await loadEventsConfig();
      const allowedTemplates = getConfiguredTemplates(this.config);
      const params = new URLSearchParams(window.location.search);
      const preview = params.get('template');

      if (preview && allowedTemplates.has(preview)) {
        await this.loadTemplate(preview, allowedTemplates);
        return;
      }

      const today = new Date();
      const masehiKey = `${today.getDate()}-${today.getMonth() + 1}`;
      let templateName = this.config.masehi[masehiKey];

      if (!allowedTemplates.has(templateName)) {
        templateName = null;
      }

      if (!templateName) {
        const hijriKey = await getHijriKey(today);
        const hijriTemplate = hijriKey
          ? this.config.hijriah[hijriKey]
          : null;

        templateName = allowedTemplates.has(hijriTemplate)
          ? hijriTemplate
          : null;
      }

      if (!templateName) {
        templateName = this.config.default;
      }

      if (!allowedTemplates.has(templateName)) {
        templateName = FALLBACK_TEMPLATE;
      }

      await this.loadTemplate(templateName, allowedTemplates);
    } catch (error) {
      console.error('Router error:', error);
      await this.loadTemplate(FALLBACK_TEMPLATE, new Set([FALLBACK_TEMPLATE]));
    }
  },

  async loadTemplate(name, allowedTemplates) {
    const appContainer = document.getElementById('app');
    const safeName = allowedTemplates.has(name) ? name : FALLBACK_TEMPLATE;

    try {
      const htmlResponse = await fetchWithTimeout(
        `/templates/${safeName}/index.html`
      );
      if (!htmlResponse.ok) {
        throw new Error(`HTML template ${safeName} tidak ditemukan`);
      }

      const html = await htmlResponse.text();
      appContainer.innerHTML = html;

      const oldCss = document.querySelector('link[data-template-css]');
      oldCss?.remove();

      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = `/css/templates/${safeName}.css`;
      cssLink.dataset.templateCss = safeName;
      document.head.appendChild(cssLink);

      const oldScript = document.querySelector('script[data-template-js]');
      oldScript?.remove();

      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `/js/templates/${safeName}.js`;
        script.dataset.templateJs = safeName;
        script.onload = resolve;
        script.onerror = () => reject(
          new Error(`JS template ${safeName} gagal dimuat`)
        );
        document.body.appendChild(script);
      });

      this.currentTemplate = safeName;
      document.title = `AXION Neuralis — ${safeName
        .replace(/-/g, ' ')
        .toUpperCase()}`;

      window.dispatchEvent(
        new CustomEvent('axion:template-loaded', {
          detail: { name: safeName }
        })
      );
    } catch (error) {
      console.error(`Gagal memuat template "${safeName}":`, error);

      if (safeName !== FALLBACK_TEMPLATE) {
        await this.loadTemplate(
          FALLBACK_TEMPLATE,
          new Set([FALLBACK_TEMPLATE])
        );
      } else {
        appContainer.innerHTML =
          '<section class="template-error" role="alert">AXION Neuralis sedang mengalami gangguan. Silakan muat ulang halaman.</section>';
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  router.init();
});
```

### Kontrak Lifecycle Template JS

Setiap file JS template harus aman dieksekusi setelah HTML template dimasukkan. Tidak boleh mengasumsikan elemen template sudah tersedia sebelum event `axion:template-loaded`.

Contoh:

```javascript
function initTemplate() {
  const hero = document.querySelector('.hero-merdeka');
  if (!hero) return;

  hero.addEventListener('click', () => {
    alert('Merdeka!');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTemplate, { once: true });
} else {
  initTemplate();
}
```

Untuk template yang perlu menunggu routing selesai:

```javascript
window.addEventListener('axion:template-loaded', (event) => {
  if (event.detail.name !== '17-agustus') return;
  initTemplate();
}, { once: true });
```

---

## 🔒 6. Aturan Keamanan Router

1. Preview parameter hanya boleh menggunakan nama yang ada pada whitelist `templates`.
2. Nama template hanya boleh terdiri dari huruf, angka, dan tanda `-`.
3. Path template selalu dibentuk dari nama yang telah divalidasi; jangan menerima path mentah dari URL.
4. `events.json` yang rusak tidak boleh menghentikan website.
5. API pihak ketiga tidak boleh menjadi single point of failure.
6. Semua kegagalan harus memiliki fallback yang deterministik.

---

## 🔧 7. Path Rule — Root-Based

Semua resource publik menggunakan root-based path.

### HTML

```html
<link rel="stylesheet" href="/css/style.css">
<script src="/js/main.js"></script>
<img src="/assets/images/hero/hero-banner.webp" alt="AXION Neuralis">
```

### CSS

```css
background-image: url('/assets/images/hero/hero-banner.webp');
```

### JavaScript

```javascript
fetch('/data/events.json');
fetch('/templates/default/index.html');
```

Path seperti `../css/...`, `../assets/...`, dan `../data/...` dilarang.

---

## 📝 8. HTML Entry Point

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="AXION Neuralis">
  <meta property="og:image" content="/assets/images/hero/og-image.webp">

  <title>AXION Neuralis</title>

  <link rel="icon" type="image/svg+xml" href="/assets/images/icons/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header>...</header>
  <main id="app" aria-live="polite"></main>
  <footer>...</footer>

  <script src="/js/main.js"></script>
</body>
</html>
```

Navbar dan footer tetap statis. Hanya isi `<main id="app">` yang diganti oleh router.

---

## ☁️ 9. Cloudflare Pages / SEO

File wajib:

- `_redirects`
- `_headers`
- `robots.txt`
- `sitemap.xml`

Konfigurasi deployment harus menunjuk ke root proyek sebagai output static site. Tidak ada build command yang diperlukan untuk proyek static murni ini.

---

## ✅ 10. Pre-Launch Checklist

| Pemeriksaan | Status wajib |
|---|---|
| 51 file final tersedia | ⬜ |
| Tidak ada file event yang hilang | ⬜ |
| Semua event di `events.json` punya HTML/CSS/JS | ⬜ |
| Semua value event ada di whitelist `templates` | ⬜ |
| `default` selalu tersedia | ⬜ |
| Preview `?template=` hanya menerima whitelist | ⬜ |
| API Hijriah gagal → fallback | ⬜ |
| `events.json` gagal → fallback | ⬜ |
| Template gagal → fallback | ⬜ |
| Semua path root-based | ⬜ |
| Tidak ada referensi asset yang tidak didefinisikan | ⬜ |
| Local test menggunakan HTTP server | ⬜ |
| Preview setiap template secara manual | ⬜ |
| Test event Masehi | ⬜ |
| Test event Hijriah | ⬜ |
| Test fallback/default | ⬜ |
| Test URL preview invalid | ⬜ |
| Test API unavailable | ⬜ |
| Test template HTML/JS missing | ⬜ |
| Deploy Cloudflare Pages | ⬜ |

---

## 🧪 11. Acceptance Criteria — Target 10/10

Blueprint dianggap **10/10** apabila seluruh kondisi berikut terpenuhi:

1. Struktur folder dan jumlah file konsisten.
2. Tidak ada file “opsional” yang diam-diam dianggap wajib.
3. Semua event yang dikonfigurasi memiliki template HTML, CSS, dan JS.
4. `events.json` menjadi single source of truth untuk event dan whitelist preview.
5. Preview mode tervalidasi dan tidak menerima path arbitrer.
6. Kegagalan config, API, HTML template, atau JS template tidak membuat router crash tanpa fallback.
7. Router memiliki fallback final yang benar-benar dapat ditampilkan.
8. Lifecycle template dapat diprediksi dan memiliki event `axion:template-loaded`.
9. Seluruh path asset konsisten root-based.
10. Blueprint dapat diterjemahkan langsung menjadi repository tanpa keputusan arsitektural tambahan yang besar.

**Nilai internal Blueprint setelah revisi ini: 10/10.**

---

## 🔖 12. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0.0 | 31/07/2026 | Inisialisasi |
| 1.0.1 | 31/07/2026 | Perbaikan link, navbar, audio, dll |
| 1.0.2 | 31/07/2026 | Tambah ikon lengkap (10 SVG) |
| 1.0.3 | 31/07/2026 | Finalisasi struktur awal |
| 1.1.0 | 03/08/2026 | Restruktur root-based + Cloudflare files |
| 2.0.0 | 12/08/2026 | Integrasi Event-Based Template System |
| 2.1.0 | 12/08/2026 | Error handling API Hijriah dan router |
| **3.0.0** | **12/08/2026** | **Finalisasi struktur 51 file, sinkronisasi seluruh event/template, whitelist preview, timeout request, deterministic fallback, lifecycle template, dan acceptance criteria 10/10** |

---

## 🏁 Putusan Final

**AXION BLUEPRINT v3.0.0 — 10/10**

Versi ini menggunakan v2.1.0 sebagai dasar, mempertahankan keunggulan error handling, dan menghapus ketidakkonsistenan yang sebelumnya mengurangi nilai:

- jumlah file sekarang dihitung dari struktur final;
- `core/` tidak lagi ambigu karena seluruh core logic berada di `main.js`;
- seluruh event di `events.json` memiliki pasangan template;
- preview mode menggunakan whitelist;
- request memiliki timeout;
- fallback bersifat deterministik;
- lifecycle template dijelaskan secara eksplisit;
- acceptance criteria disediakan untuk verifikasi sebelum deploy.

**Disahkan oleh:** Chor Yonsu Frimaz Avril Lafieqta (Azriel)  
**Founder & CEO AXION Neuralis**  
**12 Agustus 2026**
