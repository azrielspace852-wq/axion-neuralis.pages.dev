# AXION Neuralis — Audit & Repair Report

## Status

Audit dan perbaikan dilakukan terhadap `axion-neuralis.zip`.

**Catatan penting:** folder `docs/` ada di arsip, tetapi kosong. Tidak ada Bible/blueprint yang dapat dibaca dari arsip ini. Karena itu, perbaikan mengikuti kontrak dan pola yang sudah tersirat di kode, tanpa mengarang isi Bible yang tidak tersedia.

## Bug utama yang ditemukan dan diperbaiki

1. **Router merender HTML sebagai teks**
   - `appContainer.textContent = htmlContent` menyebabkan seluruh template tampil sebagai literal HTML.
   - Diperbaiki menjadi injeksi HTML yang benar.

2. **Global loader juga memasukkan markup sebagai teks**
   - Diperbaiki dari `textContent` ke `innerHTML`.

3. **Lifecycle template tidak konsisten**
   - Sebagian template memakai `currentTemplateInstance`, sebagian `activeTemplateLifecycle`, sebagian `AXION_TEMPLATE_ACTIVE`, sebagian `AXION_TEMPLATES`.
   - Semua template sekarang mendaftar ke `window.AXION_TEMPLATES[templateName]`.

4. **Router tidak pernah menjalankan lifecycle hasil load**
   - Sekarang router memanggil `lifecycle.init()` setelah HTML dan JS template berhasil dimuat.

5. **Lifecycle lama tidak dibersihkan dengan benar**
   - Router sekarang memanggil `destroy()` template aktif sebelum template baru dimuat.
   - Listener, animation frame, interval, dan audio tidak lagi dibiarkan menggantung.

6. **Template JS dimuat sebagai ES module padahal implementasinya bukan module**
   - Diganti menjadi classic script loading.

7. **Error JS template sebelumnya hanya diperingatkan dan dianggap sukses**
   - Sekarang kegagalan pemuatan JS menjadi error nyata dan masuk ke mekanisme fallback.

8. **Sistem bahasa memakai key storage berbeda**
   - Core memakai `axn_lang`, template tertentu memakai `axion_lang`.
   - Core sekarang melakukan migrasi kompatibilitas dan menyinkronkan keduanya.

9. **Event bahasa memiliki nama/detail payload yang tidak konsisten**
   - Core sekarang mengirim `axion:lang-changed` dengan `detail.lang` dan `detail.language`.
   - Event legacy `axion:language-changed` juga dipertahankan untuk kompatibilitas.

10. **Kontrol bahasa di shell tidak terhubung ke router**
    - `#language-selector` sekarang berfungsi sebagai toggle ID/EN.

11. **Template tertentu menentukan bahasa sendiri dari browser dan dapat mengabaikan bahasa global**
    - Template diarahkan ke state bahasa core.

12. **Beberapa controller mengubah `textContent` menjadi string HTML**
    - Ini menyebabkan markup icon/label tampil sebagai teks.
    - Diganti dengan pembaruan elemen DOM yang benar.

13. **Dua file JS diawali token literal `javascript`**
    - Dihapus.

14. **Dua file CSS diawali token literal `css`**
    - Dihapus.

15. **Dua template HTML diawali token literal `html`**
    - Dihapus.

16. **Label form Tahun Baru Hijriah menunjuk ke ID input yang salah**
    - Diperbaiki ke `user-wish`.

17. **Link email dan telepon di `index.html` menggunakan path URL yang salah**
    - `/mailto:` → `mailto:`
    - `/tel:` → `tel:`

18. **Visibilitas bilingual antar-template tidak seragam**
    - Ditambahkan mekanisme global berdasarkan `html[lang]` dan sinkronisasi `hidden`.

## Validasi

- Semua file JavaScript lolos `node --check`.
- Semua 7 template berhasil melakukan smoke-test registrasi lifecycle.
- Semua nama template pada `events.json` memiliki direktori template yang sesuai.
- Tidak ditemukan duplicate HTML IDs.
- Tidak ditemukan broken local `src`/`href` references.
- Tidak ditemukan lagi prefix korup `javascript`, `html`, atau `css`.

## Yang belum dapat diverifikasi

Validasi browser visual/interaktif end-to-end belum dilakukan karena environment ini tidak menyediakan `jsdom`, Playwright, atau Puppeteer.

Bible/blueprint di `docs/` juga belum dapat dijadikan sumber aturan karena folder tersebut kosong dalam arsip yang diberikan.
