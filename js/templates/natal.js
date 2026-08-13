/**
 * AXION Neuralis Christmas (Natal) Template Controller
 * Managed by AXION Event Engine Template Lifecycle System
 */

(function () {
  const templateKey = 'natal';
  
  // Snow animation vars
  let snowCanvas = null;
  let ctx = null;
  let particles = [];
  let animId = null;
  let width = 0;
  let height = 0;

  // Language State Management
  let currentLanguage = 'en';

  /**
   * Initialize Snow Particle System
   */
  function initSnow() {
    snowCanvas = document.getElementById('snow-canvas');
    if (!snowCanvas) return;

    ctx = snowCanvas.getContext('2d');
    resizeCanvas();
    
    // Listen for resize
    window.addEventListener('resize', resizeCanvas);

    // Honor User Preferences for Reduced Motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery || mediaQuery.matches) {
      drawStaticSnow();
      return;
    }

    particles = [];
    const maxParticles = Math.min(Math.floor((width * height) / 8000), 120);
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1, // Snow radius
        d: Math.random() * maxParticles, // Density
        v: Math.random() * 0.8 + 0.2 // Velocity
      });
    }

    animateSnow();
  }

  function resizeCanvas() {
    if (!snowCanvas) return;
    const parent = snowCanvas.parentElement;
    width = parent.clientWidth;
    height = parent.clientHeight;
    snowCanvas.width = width;
    snowCanvas.height = height;
  }

  function drawStaticSnow() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3 + 1, 0, Math.PI * 2, true);
      ctx.fill();
    }
  }

  function animateSnow() {
    if (!ctx || !snowCanvas) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);

      // Speed configuration update
      p.y += p.v;
      p.x += Math.sin(p.y / 30) * 0.5;

      // Reset condition
      if (p.y > height) {
        particles[i] = {
          x: Math.random() * width,
          y: -10,
          r: p.r,
          d: p.d,
          v: p.v
        };
      }
    }
    ctx.fill();
    animId = requestAnimationFrame(animateSnow);
  }

  /**
   * Bilingual Manager Utility
   */
  function setLanguage(lang) {
    currentLanguage = lang;
    const elementsId = document.querySelectorAll('#natal-root .lang-id');
    const elementsEn = document.querySelectorAll('#natal-root .lang-en');

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

    // Detect browser default language preference
    const userLanguage = navigator.language || navigator.userLanguage;
    if (userLanguage.startsWith('id')) {
      setLanguage('id');
    } else {
      setLanguage('en');
    }
  }

  /**
   * Audio Engine Controller
   */
  function setupAudioController() {
    const bgAudio = document.getElementById('festive-bg-audio');
    const audioBtn = document.getElementById('music-toggle-btn');
    if (!bgAudio || !audioBtn) return;

    // Default configuration starts as muted due to browser autoplay safety
    let isPlaying = false;

    audioBtn.addEventListener('click', function () {
      if (isPlaying) {
        bgAudio.pause();
        audioBtn.classList.remove('active');
        audioBtn.textContent = `<span class="icon-sound" aria-hidden="true">🔇</span>
          <span class="lang-id">Musik: Nonaktif</span>
          <span class="lang-en" lang="en">Music: Off</span>`;
      } else {
        bgAudio.play().catch(err => console.warn('AXION Audio: Blocked or failed', err))
          .then(() => {
            audioBtn.classList.add('active');
            audioBtn.textContent = `<span class="icon-sound" aria-hidden="true">🔊</span>
              <span class="lang-id">Musik: Aktif</span>
              <span class="lang-en" lang="en">Music: On</span>`;
          })
          .catch((err) => {
            console.warn('Interaksi pengguna pertama kali diperlukan untuk memutar audio:', err.message);
          });
      }
      isPlaying = !isPlaying;
      setLanguage(currentLanguage); // Maintain visibility rules for nested tags inside button
    });
  }

  /**
   * Interactive Submission Form Handler
   */
  function setupWishForm() {
    const form = document.getElementById('festive-interactive-form');
    const input = document.getElementById('user-wish');
    const screen = document.getElementById('wish-projection-screen');

    if (!form || !input || !screen) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const rawText = input.value.trim();
      
      if (!rawText) return;

      // Basic protection against script injections
      const cleanText = rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      screen.classList.remove('hidden');
      screen.setAttribute('aria-hidden', 'false');

      if (currentLanguage === 'id') {
        screen.textContent = `🪐 Harapan Anda "${cleanText}" berhasil diproyeksikan ke sistem kognitif AXION!`;
      } else {
        screen.textContent = `🪐 Your wish "${cleanText}" has been projected successfully into the AXION cognitive system!`;
      }

      input.value = '';
    });
  }

  /**
   * Lifecycle init Method for Global Router Initialization
   */
  function init() {
    initSnow();
    setupBilingualToggle();
    setupAudioController();
    setupWishForm();
    console.log(`AXION Template LifeCycle: Christmas [${templateKey}] Template Initialized.`);
  }

  /**
   * Lifecycle destroy Method called before unloading template
   */
  function destroy() {
    if (animId) {
      cancelAnimationFrame(animId);
    }
    window.removeEventListener('resize', resizeCanvas);
    
    const bgAudio = document.getElementById('festive-bg-audio');
    if (bgAudio) {
      bgAudio.pause();
    }
    console.log(`AXION Template LifeCycle: Christmas [${templateKey}] Template Cleaned Up.`);
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