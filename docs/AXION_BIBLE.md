# 📘 AXION BIBLE — Proyek Website AXION Neuralis

**Versi:** 3.0.0  
**Tanggal Berlaku:** 12 Agustus 2026  
**Jenis Dokumen:** Konstitusi / Single Source of Truth  
**Status:** ✅ FINAL — 10/10  
**Berlaku Untuk:** Desain, konten, kode, aset, event system, testing, deployment, dan maintenance.

---

# 0. HIERARKI DOKUMEN

AXION menggunakan tiga dokumen resmi:

```text
AXION BIBLE
     ↓
AXION BLUEPRINT
     ↓
AXION ROADMAP
```

### Fungsi

| Dokumen | Pertanyaan |
|---|---|
| AXION BIBLE | APA yang boleh/tidak boleh |
| AXION BLUEPRINT | BAGAIMANA implementasinya |
| AXION ROADMAP | KAPAN dan dalam urutan apa dikerjakan |

### Aturan Konflik

Jika ada ketidaksesuaian:

1. Bible menentukan prinsip dan aturan.
2. Blueprint harus menyesuaikan diri dengan Bible.
3. Roadmap harus menyesuaikan diri dengan Bible + Blueprint.
4. Implementasi kode tidak boleh menjadi sumber aturan baru.

Perubahan terhadap aturan inti harus tercermin pada dokumen yang relevan dan dicatat di changelog.

---

# 1. FILOSOFI AXION

Website AXION Neuralis harus terasa:

**modern, profesional, human-centered, intelligent, clean, trustworthy, dan adaptable.**

Website bukan sekadar halaman perusahaan. Website adalah:

- profil resmi;
- dokumentasi publik;
- pusat informasi;
- media presentasi;
- sistem event-driven;
- representasi identitas AXION Neuralis.

### Prinsip inti

1. **Clarity over decoration** — desain tidak boleh mengalahkan informasi.
2. **Consistency over novelty** — event boleh berbeda, tetapi tetap AXION.
3. **Accessibility by default** — fitur visual tidak boleh menghilangkan akses informasi.
4. **Graceful failure** — kegagalan API, asset, atau template tidak boleh membuat website kosong.
5. **Performance is a feature** — animasi dan dekorasi tidak boleh mengorbankan performa.
6. **Content integrity** — informasi harus konsisten dan tidak mengarang klaim perusahaan.
7. **Reversible change** — perubahan besar harus dapat dikembalikan.
8. **Single source of truth** — konfigurasi event berasal dari data yang ditetapkan proyek.

---

# 2. TUJUAN WEBSITE

Tujuan yang tidak boleh berubah:

| Tujuan | Aturan |
|---|---|
| Profil perusahaan | Menampilkan identitas, visi, misi, dan struktur AXION Neuralis |
| Dokumentasi publik | Menyediakan informasi yang dapat dipahami publik |
| Pusat informasi | Menjadi rujukan resmi tentang website/perusahaan |
| Branding | Membangun identitas profesional dan inovatif |
| Event experience | Menyesuaikan pengalaman visual dengan event yang aktif |
| Accessibility | Informasi tetap tersedia tanpa ketergantungan pada animasi |

---

# 3. IDENTITAS MEREK GLOBAL

## 3.1 Warna Core Brand

| Token | Nilai | Fungsi |
|---|---|---|
| Background | `#f6f8fa` | Latar utama |
| Card | `#ffffff` | Card/container |
| Nav | `rgba(255,255,255,0.92)` | Navbar |
| Text Primary | `#1a1a2e` | Heading / teks utama |
| Text Secondary | `#3d3d5c` | Paragraph |
| Text Muted | `#6b6b8a` | Secondary info |
| Accent | `#2d2d5e` | CTA, active state, link |
| Accent Light | `#4a4a7a` | Hover/interaksi |
| Accent Secondary | `#00D4FF` | Neuralis / dark accent |
| Border | `#e2e6ed` | Divider |

### Aturan Global Brand

- `#2d2d5e` adalah accent utama dan tidak boleh diganti tanpa persetujuan CEO.
- Event theme **tidak boleh menghapus identitas AXION**.
- Event color adalah **theme layer**, bukan pengganti brand layer.
- Logo tetap AXION Neuralis pada semua event.
- Typography global tetap mengikuti brand kecuali ada aturan event yang benar-benar diperlukan untuk keterbacaan.
- Konten bisnis inti tetap menggunakan hierarchy global.

---

# 4. TIPOGRAFI

Font utama:

**Inter**

Weights:

`300, 400, 500, 600, 700, 800`

Fallback:

```text
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Heading

| Level | Desktop | Mobile | Weight |
|---|---:|---:|---:|
| h1 | 40px | 32px | 800 |
| h2 | 32px | 24px | 700 |
| h3 | 24px | 20px | 600 |
| h4 | 20px | 18px | 600 |
| h5 | 18px | 16px | 600 |
| h6 | 16px | 14px | 600 |

Body:

- Desktop 16px
- Mobile 14px
- Line-height body 1.7

---

# 5. SPACING SYSTEM

```text
--space-xs  = 4px
--space-sm  = 8px
--space-md  = 16px
--space-lg  = 24px
--space-xl  = 40px
--space-2xl = 60px
```

Event template tidak boleh membuat spacing liar yang merusak consistency.

---

# 6. LOGO

Nama resmi:

**AXION Neuralis**

Singkatan:

**AXN**

Aturan:

- Logo selalu tersedia.
- Minimum clear space 16px.
- Tidak boleh diputar.
- Tidak boleh diregangkan.
- Tidak boleh diberi efek yang membuatnya tidak terbaca.
- Event tidak boleh mengganti logo dengan simbol event.
- Pada dark background:

```text
AXION     #FFFFFF
Neuralis  #00D4FF
```

---

# 7. STRUKTUR WEBSITE FINAL

Halaman root:

```text
index.html
about.html
services.html
contact.html
404.html
```

Event templates:

```text
default/
17-agustus/
lebaran/
tahun-baru/
natal/
idul-adha/
tahun-baru-islam/
```

### Rule

Semua template event harus mempunyai pasangan:

```text
HTML + CSS + JS
```

Tidak boleh ada event configuration yang tidak mempunyai template.

---

# 8. SINGLE SOURCE OF TRUTH EVENT

File:

```text
/data/events.json
```

Adalah sumber konfigurasi event.

Konfigurasi tidak boleh diduplikasi secara manual di banyak file JavaScript.

### Konsep

```text
events.json
   ↓
main.js
   ↓
event resolver
   ↓
template
   ↓
theme layer
```

---

# 9. ATURAN EVENT ENGINE

## 9.1 Urutan Resolusi

Website menggunakan urutan:

```text
1. Preview parameter yang valid
2. Event Masehi
3. Event Hijriah
4. Default
```

### Penjelasan

**Preview valid**
→ pengguna meminta template tertentu melalui URL dan template tersebut termasuk whitelist.

Jika tidak ada preview valid:

**Masehi**
→ sistem memeriksa tanggal Masehi.

Jika tidak ditemukan:

**Hijriah**
→ sistem mencoba memperoleh tanggal Hijriah.

Jika tidak ditemukan:

**Default**
→ website menggunakan tema default.

---

# 10. PRIORITAS KONFLIK EVENT

Jika pada satu tanggal terdapat lebih dari satu kandidat:

### Prioritas resmi

```text
Valid Preview
    >
Masehi
    >
Hijriah
    >
Default
```

### Aturan tambahan

- Preview hanya untuk testing/presentasi.
- Preview tidak boleh mengubah data produksi.
- Event Masehi tidak boleh tiba-tiba menghilang karena API Hijriah.
- Jika API Hijriah gagal, website tetap menggunakan event Masehi bila ada.
- Jika semua resolver gagal, default harus tampil.
- Tidak boleh ada kondisi `#app` kosong tanpa state/fallback.

---

# 11. DEFAULT EVENT — NON-EVENT MODE

Template:

```text
default
```

## Identitas

Nama mode:

**AXION Neuralis — Standard Mode**

## Tema

**Clean Intelligent Corporate**

## Visual

- background: `#f6f8fa`
- card: `#ffffff`
- accent: `#2d2d5e`
- secondary accent: `#00D4FF`
- gradient ringan diperbolehkan
- tidak menggunakan dekorasi event
- tidak menggunakan confetti
- tidak menggunakan seasonal ornament

## Mood

```text
calm
professional
intelligent
trustworthy
minimal
```

## Animasi

- subtle;
- cepat;
- tidak mengganggu;
- `prefers-reduced-motion` wajib dihormati.

## Konten

Default harus berisi identitas utama:

1. AXION Neuralis.
2. Ringkasan perusahaan.
3. Vision.
4. Mission.
5. Services.
6. CTA.
7. Contact.
8. Footer.

### Aturan default

Default adalah **baseline paling stabil**.

Setiap event template yang gagal dimuat harus dapat kembali ke default.

---

# 12. EVENT: TAHUN BARU MASEHI

Key:

```text
1-1
```

Template:

```text
tahun-baru
```

Nama:

**New Year / Tahun Baru**

## Tema

**Future Reset**

## Mood

```text
optimistic
forward-looking
premium
fresh
```

## Visual

- dark-to-light futuristic gradient diperbolehkan;
- bintang/partikel sangat ringan;
- garis cahaya;
- angka tahun boleh ditonjolkan;
- warna accent AXION tetap hadir.

## Tidak boleh

- visual alkohol;
- visual berbahaya;
- ledakan realistis;
- dekorasi berlebihan;
- mengubah website menjadi halaman pesta.

## Copy tone

Fokus:

**new beginning + innovation + future**

Contoh arah pesan:

> New year. New ideas. New possibilities.

Bukan klaim bisnis baru yang belum disahkan.

---

# 13. EVENT: 17 AGUSTUS

Key:

```text
17-8
```

Template:

```text
17-agustus
```

Nama:

**Hari Kemerdekaan Republik Indonesia**

## Tema

**Independence / Merah Putih Modern**

## Mood

```text
proud
energetic
respectful
modern
```

## Visual

Warna event:

- merah;
- putih;
- AXION purple sebagai anchor.

Elemen yang diperbolehkan:

- red-white gradient;
- flag-inspired shapes;
- geometric red/white sections;
- subtle particle/ribbon.

## Wajib

- identitas AXION tetap terlihat;
- tema harus terasa nasional tetapi profesional;
- konten tidak boleh berubah menjadi propaganda politik.

## Tidak boleh

- simbol politik partisan;
- klaim sejarah yang tidak terverifikasi;
- visual kekerasan;
- dekorasi berlebihan.

## Copy tone

**patriotic + innovation + future**

Contoh arah:

> Membangun masa depan melalui teknologi, kreativitas, dan kolaborasi.

---

# 14. EVENT: IDUL FITRI / LEBARAN

Key:

```text
1-10
```

Template:

```text
lebaran
```

Nama:

**Idul Fitri**

## Tema

**Harmony & Renewal**

## Mood

```text
peaceful
warm
respectful
renewal
```

## Visual

Preferensi:

- emerald;
- soft gold;
- cream;
- white;
- deep AXION accent.

Elemen:

- geometric Islamic pattern sederhana;
- crescent geometry sederhana;
- lantern motif;
- soft glow.

## Tidak boleh

- representasi ibadah yang tidak tepat;
- simbol agama digunakan sebagai dekorasi berlebihan;
- humor yang merendahkan agama;
- klaim keagamaan yang tidak diverifikasi.

## Copy tone

**reflection + gratitude + renewal**

Bahasa harus sopan dan tidak memaksakan praktik keagamaan tertentu kepada seluruh pengunjung.

---

# 15. EVENT: IDUL ADHA

Key:

```text
10-12
```

Template:

```text
idul-adha
```

## Tema

**Sacrifice, Compassion & Giving**

## Mood

```text
respectful
calm
compassionate
meaningful
```

## Visual

- emerald;
- gold;
- cream;
- AXION accent.

## Konten

Fokus pada nilai universal:

- compassion;
- generosity;
- community;
- reflection.

## Tidak boleh

- visual darah/penyembelihan;
- visual kekerasan;
- menyampaikan fatwa;
- mengklaim ritual tertentu sebagai kewajiban teknis website.

---

# 16. EVENT: TAHUN BARU ISLAM

Key:

```text
1-1
```

Hijriah

Template:

```text
tahun-baru-islam
```

## Tema

**Reflection & New Journey**

## Mood

```text
calm
reflective
hopeful
respectful
```

## Visual

- deep navy;
- emerald;
- muted gold;
- subtle crescent/geometric patterns.

## Konten

Fokus:

- reflection;
- improvement;
- intention;
- new journey.

Hindari klaim agama yang tidak diverifikasi.

---

# 17. EVENT: NATAL

Key:

```text
25-12
```

Template:

```text
natal
```

## Tema

**Warmth, Light & Giving**

## Mood

```text
warm
peaceful
joyful
elegant
```

## Visual

- evergreen;
- warm gold;
- white;
- AXION accent.

Elemen yang diperbolehkan:

- subtle stars;
- lights;
- ornaments;
- snow-inspired shapes.

## Tidak boleh

- visual konsumsi alkohol;
- representasi agama yang menyesatkan;
- konten penghinaan agama;
- mengubah halaman korporat menjadi halaman komersial Natal.

---

# 18. EXTENSIBLE EVENT CATALOG

Event berikut boleh ditambahkan pada versi berikutnya, tetapi harus melalui approval dan memiliki template lengkap.

| Event | Candidate Key | Suggested Theme |
|---|---|---|
| Ramadan | `1-9` Hijriah | Reflection & Discipline |
| Nuzulul Quran | `17-9` Hijriah | Knowledge & Reflection |
| Isra Mi'raj | `27-7` Hijriah | Journey & Reflection |
| Maulid Nabi | `12-3` Hijriah | Character & Compassion |
| Hari Pahlawan | `10-11` Masehi | Courage & Service |
| Hari Pendidikan Nasional | `2-5` Masehi | Knowledge & Future |
| Hari Sumpah Pemuda | `28-10` Masehi | Unity & Collaboration |
| Hari Kartini | `21-4` Masehi | Education & Empowerment |
| Hari Pancasila | `1-6` Masehi | Unity & Civic Values |

### Aturan Penting

Tanggal Hijriah digunakan sebagai **rule key**, bukan hard-coded Gregorian date.

Konversi Masehi ↔ Hijriah harus berasal dari resolver yang telah disetujui proyek.

---

# 19. EVENT YANG BELUM DIIMPLEMENTASIKAN

Event yang ada di Section 18 adalah **extension catalog**, bukan automatic production event sebelum:

1. dibuat di `events.json`;
2. dibuat HTML;
3. dibuat CSS;
4. dibuat JS;
5. dibuat theme specification;
6. dibuat accessibility review;
7. dibuat content review;
8. lulus QA.

Tidak boleh menambahkan key ke `events.json` sebelum template benar-benar tersedia.

---

# 20. EVENT THEME ARCHITECTURE

Setiap event terdiri dari empat lapisan:

```text
CORE BRAND
    ↓
GLOBAL UI
    ↓
EVENT THEME
    ↓
EVENT CONTENT
```

### Core Brand

Tidak berubah:

- logo;
- perusahaan;
- typography;
- accessibility;
- brand accent;
- navigation;
- footer.

### Global UI

Tidak berubah tanpa alasan:

- button behavior;
- form behavior;
- language system;
- audio player;
- responsive rules.

### Event Theme

Boleh berubah:

- background treatment;
- decorative graphics;
- accent secondary;
- hero atmosphere;
- seasonal microcopy;
- subtle animation.

### Event Content

Boleh berubah:

- hero title;
- event message;
- supporting sections;
- seasonal CTA.

---

# 21. ATURAN TEMA EVENT

Setiap event wajib menentukan:

1. nama event;
2. resolver key;
3. template name;
4. mood;
5. primary theme;
6. secondary theme;
7. permitted visual elements;
8. prohibited visual elements;
9. animation policy;
10. copy tone;
11. accessibility constraints;
12. fallback behavior.

Tidak boleh membuat event hanya dengan mengganti warna.

---

# 22. EVENT TRANSITION

Saat event berganti:

- halaman harus tetap stabil;
- navbar tidak boleh berubah struktur;
- footer tidak boleh hilang;
- global content tidak boleh rusak;
- CSS event lama harus dibersihkan;
- JS event lama harus dilepas sesuai lifecycle;
- theme baru harus diterapkan;
- title harus diperbarui;
- aksesibilitas tetap aktif.

---

# 23. EVENT ANIMATION POLICY

Default:

**No excessive animation.**

Event animation:

- maksimal subtle;
- tidak mengganggu reading;
- tidak memblokir input;
- tidak memutar audio tanpa tindakan pengguna;
- tidak menyebabkan layout shift besar;
- harus menghormati:

```css
@media (prefers-reduced-motion: reduce)
```

Pada reduced-motion:

- confetti dimatikan;
- particle animation dikurangi/dimatikan;
- transition dipersingkat;
- layout tetap sama.

---

# 24. EVENT AUDIO RULE

Audio tidak boleh otomatis diputar tanpa tindakan pengguna.

Event template tidak boleh mengganti sistem audio global tanpa persetujuan.

Audio event baru membutuhkan:

- file asset;
- nama file;
- bahasa;
- transcript;
- fallback;
- accessibility label;
- size check.

---

# 25. BAHASA DAN LOKALISASI

Bahasa wajib:

- Indonesia (`id`) — utama.
- English (`en`) — pendukung.

Event harus menyediakan minimal:

- event title;
- subtitle;
- CTA;
- accessibility labels;
- image alt;
- document title;

dalam bahasa yang tersedia.

Tidak boleh mencampur bahasa secara tidak sengaja.

---

# 26. ATURAN KONTEN

Konten harus:

- jelas;
- faktual;
- sopan;
- tidak menyesatkan;
- tidak membuat klaim finansial/legal/teknis yang tidak disahkan;
- tidak merendahkan kelompok tertentu;
- tidak menggunakan plagiarisme.

Event religious content harus:

- respectful;
- non-inflammatory;
- tidak mengarang ajaran;
- tidak menggunakan klaim agama yang tidak diverifikasi.

---

# 27. ATURAN VISUAL EVENT

Event theme **boleh berbeda**.

Event theme **tidak boleh mengambil alih brand**.

### Contoh yang benar

```text
AXION purple
   +
red/white 17 Agustus
   +
clean geometry
```

### Contoh yang salah

```text
100% red-white
AXION logo hilang
layout berubah total
CTA tidak konsisten
```

---

# 28. ATURAN ACCESSIBILITY EVENT

Setiap event wajib lulus:

- keyboard navigation;
- visible focus;
- semantic headings;
- contrast;
- alt;
- ARIA;
- skip link;
- reduced motion.

Dekorasi event tidak boleh menjadi satu-satunya penyampai informasi.

Misalnya:

❌ “warna merah = ada event”

✅ “Ada heading tekstual + metadata event + warna sebagai pendukung”

---

# 29. ATURAN PERFORMANCE EVENT

Event template tidak boleh menyebabkan:

- asset besar tanpa alasan;
- blocking script;
- giant background image;
- endless animation;
- layout shift;
- excessive DOM.

Target global tetap:

- image WebP;
- lazy-load bila relevan;
- FCP < 1.5s;
- Lighthouse Performance ≥ 90.

---

# 30. SECURITY EVENT

Query parameter preview:

```text
?template=
```

hanya boleh menerima template whitelist.

Tidak boleh:

- memasukkan URL langsung;
- memuat path arbitrer;
- mengeksekusi inline payload dari parameter;
- menggunakan input pengguna sebagai script.

Event API harus:

- memiliki timeout;
- memiliki error handling;
- memiliki null-safe parsing;
- mempunyai fallback.

---

# 31. DEFAULT FALLBACK MATRIX

| Kondisi | Hasil |
|---|---|
| Tidak ada event | `default` |
| Masehi match | Event Masehi |
| Masehi tidak match, Hijriah match | Event Hijriah |
| API Hijriah error | `default` |
| `events.json` error | `default` |
| Template missing | `default` |
| Template JS error | safe state / default recovery |
| Invalid preview | `default` atau normal resolver |
| `#app` tidak ditemukan | router berhenti aman |
| Unknown event key | `default` |

**Prinsip:** website lebih baik tampil normal daripada tampil kosong.

---

# 32. CONTENT IMMUTABILITY RULE

Event boleh mengubah:

- hero theme;
- event copy;
- decorative UI;
- seasonal sections.

Event tidak boleh mengubah tanpa approval:

- company name;
- core company identity;
- official contact;
- legal/copyright;
- global navigation structure;
- accessibility contract;
- security policy.

---

# 33. NAVBAR

Navbar global wajib:

- logo;
- Beranda;
- Profil;
- Layanan;
- Kontak;
- Azriel Space;
- language selector;
- Play All.

Event tidak boleh menghapus navigasi utama.

Event dapat:

- menambahkan small seasonal badge;
- menambahkan event indicator;
- mengubah accent visual.

---

# 34. FOOTER

Footer tetap konsisten pada semua event.

Minimal:

- copyright;
- perusahaan;
- official links;
- contact.

Event tidak boleh menghapus footer.

---

# 35. RESPONSIVE

Breakpoints:

```text
Mobile: 0–640px
Tablet: 641–1024px
Desktop: 1025px+
```

Setiap event wajib diuji pada tiga kelas tersebut.

Tidak boleh ada event yang hanya bagus di desktop.

---

# 36. BROWSER SUPPORT

Wajib mendukung:

- Chrome 2 versi terakhir;
- Firefox 2 versi terakhir;
- Safari 2 versi terakhir;
- Edge 2 versi terakhir.

---

# 37. SEO

Setiap page/event view yang relevan harus memiliki:

- title;
- description;
- canonical strategy bila diterapkan;
- Open Graph;
- accessible heading hierarchy;
- valid lang.

Event title tidak boleh merusak identitas AXION.

Contoh:

```text
AXION Neuralis — Hari Kemerdekaan Indonesia
```

bukan:

```text
17 AGUSTUS!!! MERDEKA!!!
```

---

# 38. ACCESSIBILITY GLOBAL

Wajib:

- alt;
- aria-label;
- semantic HTML;
- keyboard access;
- visible focus;
- contrast minimal 4.5:1 untuk normal text;
- skip-to-content;
- reduced-motion;
- no information conveyed by color alone.

---

# 39. PERFORMANCE GLOBAL

Target:

- semua gambar WebP;
- gambar event tetap dioptimalkan;
- lazy-loading di bawah fold;
- maksimal 200KB per image jika memungkinkan/ditetapkan asset budget;
- FCP < 1.5s;
- Lighthouse Performance ≥ 90.

Event baru tidak boleh menurunkan standar global.

---

# 40. CLOUDflare / DEPLOYMENT

Static site.

Build:

```text
Framework: None
Build command: kosong
Output directory: root
```

Wajib:

```text
_redirects
_headers
robots.txt
sitemap.xml
```

Cloudflare deployment harus diverifikasi sebelum production.

---

# 41. ASSET RULE

Tidak boleh menggunakan asset yang tidak terdaftar.

Setiap asset event baru harus mempunyai:

- path;
- format;
- size budget;
- license/source;
- alt usage;
- owner/PIC.

Asset tanpa lisensi jelas tidak boleh masuk production.

---

# 42. CODE RULE

JavaScript core:

```text
js/main.js
```

Harus:

- modular secara fungsi;
- error-safe;
- tidak mengandalkan global mutable state berlebihan;
- memiliki event resolver;
- memiliki config loader;
- memiliki template loader;
- memiliki fallback;
- memiliki validation.

Template JS:

- hanya bertanggung jawab atas perilaku template;
- tidak boleh menduplikasi router;
- tidak boleh mengubah global system tanpa kontrak.

---

# 43. TEMPLATE CONTRACT

Semua template harus menerima lifecycle:

```text
load
→ inject
→ style
→ script
→ init
→ ready
```

Template tidak boleh menganggap halaman selalu berada pada state tertentu tanpa memeriksa DOM yang diperlukan.

---

# 44. EVENT QA CHECKLIST

Sebelum event dianggap READY:

- [ ] Mapping key benar.
- [ ] Folder benar.
- [ ] HTML ada.
- [ ] CSS ada.
- [ ] JS ada.
- [ ] Preview bekerja.
- [ ] Auto detection bekerja.
- [ ] Fallback bekerja.
- [ ] Mobile bekerja.
- [ ] Tablet bekerja.
- [ ] Desktop bekerja.
- [ ] Keyboard bekerja.
- [ ] Reduced motion bekerja.
- [ ] EN bekerja.
- [ ] ID bekerja.
- [ ] Title benar.
- [ ] Alt benar.
- [ ] No console blocker.
- [ ] No missing assets.

---

# 45. EVENT RELEASE CRITERIA

Event baru hanya boleh masuk production jika:

**100% item event QA lulus.**

Jika satu item critical gagal:

**STATUS = NOT READY**

Event tersebut harus fallback ke default sampai diperbaiki.

---

# 46. ATURAN PERUBAHAN EVENT

Penambahan event membutuhkan:

1. event specification;
2. theme definition;
3. content review;
4. asset review;
5. HTML/CSS/JS;
6. `events.json` update;
7. QA;
8. Blueprint update bila struktur berubah;
9. Roadmap update bila pekerjaan memengaruhi timeline;
10. changelog.

---

# 47. HARD RESTRICTIONS

Dilarang:

1. Menghapus `default`.
2. Menghapus fallback.
3. Membypass error handling.
4. Membypass preview whitelist.
5. Memuat template arbitrary dari query parameter.
6. Menghapus brand AXION dari event.
7. Mengubah accent brand tanpa approval.
8. Menghapus accessibility.
9. Menambahkan audio autoplay.
10. Menambahkan asset tanpa lisensi.
11. Menggunakan event theme untuk konten politik partisan.
12. Menggunakan visual agama secara tidak hormat.
13. Menyebarkan data sensitif.
14. Deploy tanpa testing.
15. Mengubah struktur final tanpa Blueprint update.
16. Menambah event ke config tanpa template.
17. Membiarkan event template lebih berat dari batas performa tanpa persetujuan.
18. Menjadikan warna event satu-satunya pembawa informasi.

---

# 48. MUST-HAVE GLOBAL

- [ ] 5 root HTML.
- [ ] 7 event templates.
- [ ] `main.js`.
- [ ] `events.json`.
- [ ] fallback default.
- [ ] preview validation.
- [ ] error handling.
- [ ] navbar.
- [ ] footer.
- [ ] bilingual.
- [ ] audio.
- [ ] transcript.
- [ ] loading.
- [ ] onboarding.
- [ ] accessibility.
- [ ] responsive.
- [ ] SEO.
- [ ] WebP.
- [ ] Cloudflare files.
- [ ] 404.
- [ ] QA.

---

# 49. DEFINITION OF 10/10

AXION Bible dinilai **10/10** hanya apabila:

### Governance
- aturan jelas;
- hierarchy dokumen jelas;
- perubahan terkontrol.

### Brand
- brand immutable;
- event layer jelas.

### Event System
- default jelas;
- event list jelas;
- theme rules jelas;
- conflict rules jelas;
- fallback jelas;
- extension rules jelas.

### Content
- tone jelas;
- event content boundaries jelas;
- religious/political restrictions jelas.

### Technical Contract
- router contract jelas;
- template contract jelas;
- security contract jelas.

### Quality
- accessibility;
- performance;
- SEO;
- QA;
- release criteria.

### Deployment
- Cloudflare requirements;
- asset rules;
- production gates.

**Tidak ada bagian penting yang boleh bergantung pada asumsi developer.**

---

# 50. PENILAIAN INTERNAL

| Area | Bobot |
|---|---:|
| Governance & scope | 10% |
| Brand system | 10% |
| Event architecture | 20% |
| Event theme definitions | 15% |
| Content & ethics rules | 10% |
| Accessibility | 10% |
| Performance | 5% |
| Security | 5% |
| QA & release | 10% |
| Documentation consistency | 5% |
| **TOTAL** | **100%** |

Status target:

**10/10 — PASS**

Syarat: tidak ada critical rule yang ambigu.

---

# 51. HUBUNGAN DENGAN BLUEPRINT v3.0.0

Blueprint harus mengimplementasikan minimal:

- struktur 51 file;
- 7 template;
- `events.json`;
- `main.js`;
- preview whitelist;
- fallback;
- lifecycle template;
- root-based paths.

Bible menentukan bahwa semua itu adalah **kontrak**, bukan opsi.

---

# 52. HUBUNGAN DENGAN ROADMAP v3.0.0

Roadmap harus memastikan:

- event system dikerjakan sebelum launch;
- seluruh event QA;
- fallback QA;
- browser testing;
- staging;
- production smoke test.

Roadmap tidak boleh menghapus gate yang ditetapkan Bible.

---

# 53. CHANGE CONTROL

Siapa yang dapat menyetujui perubahan inti:

| Role | Hak |
|---|---|
| CEO | Full approval |
| Team Lead | Usulan + review |
| Member | Usulan |
| External contributor | Usulan melalui review |

Perubahan harus:

1. dicatat;
2. direview;
3. diberi versi;
4. masuk changelog;
5. disinkronkan dengan Blueprint/Roadmap bila relevan.

---

# 54. DEFINITION OF FAILURE

Project dianggap gagal secara governance jika:

- event tampil tetapi tidak terdefinisi;
- event tidak punya fallback;
- template missing dibiarkan;
- event merusak global UI;
- website kosong ketika API error;
- preview dapat memuat path arbitrary;
- event menghapus identity AXION;
- event melanggar accessibility;
- production deploy dilakukan tanpa QA.

---

# 55. SIGN-OFF

**Dokumen:** AXION BIBLE  
**Versi:** 3.0.0  
**Tanggal Berlaku:** 12 Agustus 2026  
**Status:** FINAL — 10/10

**Disahkan oleh:**

Chor Yonsu Frimaz Avril Lafieqta (Azriel)  
Founder & CEO AXION Neuralis

---

# 56. CHANGELOG

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0.0 | 31/07/2026 | Inisialisasi AXION BIBLE |
| 1.1.0 | 31/07/2026 | Tambah struktur tim, aturan 404, beta testing |
| 2.0.0 | 31/07/2026 | Fokus penuh pada proyek website |
| 2.1.0 | 31/07/2026 | Font, spacing, logo, SEO, accessibility, performance, form |
| 2.1.1 | 31/07/2026 | Accent secondary, dynamic lang, mailto, analytics clarification |
| 2.2.0 | 03/08/2026 | Cloudflare Pages, root-based structure, deployment rules |
| **3.0.0** | **12/08/2026** | **Final governance rewrite: event constitution, default/event themes, event priority, fallback matrix, content boundaries, security, accessibility, performance, release criteria, document hierarchy, dan 10/10 quality gate** |

---

# 57. STATUS RESMI

**AXION BIBLE v3.0.0 = CONSTITUTION**

Dokumen ini adalah sumber kebenaran untuk:

```text
Brand
Content
Rules
Event
Accessibility
Security
Quality
Governance
```

Tidak ada implementasi yang boleh bertentangan dengan dokumen ini tanpa perubahan versi yang disahkan.

**AXION Neuralis — Build with Intelligence.**
