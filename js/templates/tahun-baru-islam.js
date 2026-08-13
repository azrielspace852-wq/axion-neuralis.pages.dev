/**
 * AXION Neuralis Islamic New Year Template Controller
 * Managed by AXION Event Engine Template Lifecycle System
 */

(function () {
  const templateKey = 'tahun-baru-islam';

  // Floating star particles vars
  let starsCanvas = null;
  let ctx = null;
  let animId = null;
  let particles = [];
  let width = 0;
  let height = 0;

  // Bilingual Active State
  let currentLanguage = 'en';

  /**
   * Starfield Ambient Particle Simulation Initialization
   */
  function initAmbientStars() {
    starsCanvas = document.getElementById('stars-canvas');
    if (!starsCanvas) return;

    ctx = starsCanvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    // Stop calculation loop if user prefers static layout
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery || mediaQuery.matches) {
      drawStaticStars();
      return;
    }

    particles = [];
    const maxParticles = Math.min(Math.floor((width * height) / 9000), 100);
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.05 + 0.01,
        increasing: Math.random() > 0.5
      });
    }

    animateAmbientStars();
  }

  function resizeCanvas() {
    if (!starsCanvas) return;
    const parent = starsCanvas.parentElement;
    width = parent.clientWidth;
    height = parent.clientHeight;
    starsCanvas.width = width;
    starsCanvas.height = height;
  }

  function drawStaticStars() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.5, 0, Math.PI * 2, true);
      ctx.fill();
    }
  }

  function animateAmbientStars() {
    if (!ctx || !starsCanvas) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, true);
      ctx.fill();

      // Twinkle alpha updates
      if (p.increasing) {
        p.alpha += p.speed;
        if (p.alpha >= 1) p.increasing = false;
      } else {
        p.alpha -= p.speed;
        if (p.alpha <= 0.2) p.increasing = true;
      }

      // Drift slightly to simulate dynamic system rotation
      p.x += Math.sin(p.alpha) * 0.05;
      if (p.x > width) p.x = 0;
    }

    animId = requestAnimationFrame(animateAmbientStars);
  }

  /**
   * Bilingual Layout Manager
   */
  function setLanguage(lang) {
    currentLanguage = lang;
    const elementsId = document.querySelectorAll('#islamic-ny-root .lang-id');
    const elementsEn = document.querySelectorAll('#islamic-ny-root .lang-en');

    if (lang === 'id') {
      elementsId.forEach(el => el.style.display = 'inline-block');
      elementsEn.forEach(el => el.style.display = 'none');
    } else {
      elementsId.forEach(el => el.style.display = 'none');
      elementsEn.forEach(el => el.style.display = 'inline-block');
    }
  }

  function setupBilingualToggle() {
    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      const targetLang = currentLanguage === 'en' ? 'id' : 'en';
      setLanguage(targetLang);
    });

    // Default configuration match language preference detection
    const userLanguage = navigator.language || navigator.userLanguage;
    if (userLanguage.startsWith('id')) {
      setLanguage('id');
    } else {
      setLanguage('en');
    }
  }

  /**
   * Spiritual Reflection Audio Integration
   */
  function setupAudioController() {
    const bgAudio = document.getElementById('spiritual-reflection-audio');
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (!bgAudio || !audioBtn) return;

    let isPlaying = false;

    audioBtn.addEventListener('click', function () {
      if (isPlaying) {
        bgAudio.pause();
        audioBtn.classList.remove('active');
        audioBtn.textContent = `<span class="icon-sound" aria-hidden="true">🔇</span>
          <span class="lang-id">Audio Spiritual: Nonaktif</span>
          <span class="lang-en" lang="en">Spiritual Audio: Off</span>`;
      } else {
        bgAudio.play()
          .then(() => {
            audioBtn.classList.add('active');
            audioBtn.textContent = `<span class="icon-sound" aria-hidden="true">🔊</span>
              <span class="lang-id">Audio Spiritual: Aktif</span>
              <span class="lang-en" lang="en">Spiritual Audio: On</span>`;
          })
          .catch((err) => {
            console.warn('Interaksi pengguna pertama kali diperlukan untuk memutar audio:', err.message);
          });
      }
      isPlaying = !isPlaying;
      setLanguage(currentLanguage); // Protect nested layouts render rules after textContent updates
    });
  }

  /**
   * User Commitments / Resolution Interactive Form
   */
  function setupResolutionForm() {
    const form = document.getElementById('spiritual-resolution-form');
    const input = document.querySelector('#spiritual-resolution-form .form-input');
    const screen = document.getElementById('resolution-projection-screen');

    if (!form || !input || !screen) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const rawText = input.value.trim();

      if (!rawText) return;

      // Escape dynamic string tags to ensure cross-site scripting security
      const cleanText = rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      screen.classList.remove('hidden');
      screen.setAttribute('aria-hidden', 'false');

      if (currentLanguage === 'id') {
        screen.textContent = `🕌 Bismillah, resolusi hijrah Anda "${cleanText}" terekam untuk kebaikan kemaslahatan bersama!`;
      } else {
        screen.textContent = `🕌 Bismillah, your hijra resolution "${cleanText}" has been logged to achieve public welfare!`;
      }

      input.value = '';
    });
  }

  /**
   * Lifecycle init Method required by Global Engine Router
   */
  function init() {
    initAmbientStars();
    setupBilingualToggle();
    setupAudioController();
    setupResolutionForm();
    console.log(`AXION Template LifeCycle: Islamic New Year [${templateKey}] Template Initialized.`);
  }

  /**
   * Lifecycle destroy Method required by Global Engine Router
   */
  function destroy() {
    if (animId) {
      cancelAnimationFrame(animId);
    }
    window.removeEventListener('resize', resizeCanvas);

    const bgAudio = document.getElementById('spiritual-reflection-audio');
    if (bgAudio) {
      bgAudio.pause();
    }
    console.log(`AXION Template LifeCycle: Islamic New Year [${templateKey}] Template Cleaned Up.`);
  }

  // Register directly to AXION Global Scope for dynamic router accessibility
  window.AXN_TEMPLATE_ACTIVE = {
    init: init,
    destroy: destroy
  };

  // Safe fallback self-initialization when running directly outside Router
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.AXN_ROUTER_ACTIVE) {
      init();
    }
  });

})();