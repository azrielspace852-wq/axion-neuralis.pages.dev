/**
 * AXION Neuralis Core System - main.js
 * Version: 3.0.0
 * Date: August 12, 2026
 * Description: Robust Event-Based Router & Shell Controller
 */

(function () {
  'use strict';

  const FALLBACK_TEMPLATE = 'default';
  const TEMPLATE_TIMEOUT = 8000;
  const STORAGE_LANG_KEY = 'axn_lang';
  
  const appContainer = document.getElementById('app');
  let currentActiveScript = null;

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
        masehi: config?.masehi && typeof config.masehi === 'object' ? config.masehi : {},
        hijriah: config?.hijriah && typeof config.hijriah === 'object' ? config.hijriah : {},
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
      if (!response.ok) throw new Error('API Hijriah tidak merespons');
      const data = await response.json();
      const hijri = data?.data?.hijri;
      if (!hijri?.day || !hijri?.month?.number) return null;
      return `${parseInt(hijri.day, 10)}-${parseInt(hijri.month.number, 10)}`;
    } catch (error) {
      console.warn('Tanggal Hijriah tidak tersedia:', error.message);
      return null;
    }
  }

  const router = {
    currentTemplate: FALLBACK_TEMPLATE,
    config: null,
    
    async init() {
      if (!appContainer) {
        console.error('Element #app tidak ditemukan!');
        return;
      }
      this.config = await loadEventsConfig();
      langSystem.init();
      await this.resolveAndRender();
      this.bindEvents();
    },

    bindEvents() {
      window.addEventListener('popstate', () => this.resolveAndRender());
    },

    async resolveAndRender() {
      this.showLoader();
      const urlParams = new URLSearchParams(window.location.search);
      const preview = urlParams.get('template');
      let resolvedTemplate = FALLBACK_TEMPLATE;

      if (preview && this.config.templates.includes(preview) && isSafeTemplateName(preview)) {
        resolvedTemplate = preview;
        console.log(`[Router] Preview Mode Active: ${resolvedTemplate}`);
      } else {
        const today = new Date();
        const masehiKey = `${today.getDate()}-${today.getMonth() + 1}`;
        
        if (this.config.masehi[masehiKey]) {
          resolvedTemplate = this.config.masehi[masehiKey];
          console.log(`[Router] Event Masehi Detected: ${resolvedTemplate}`);
        } else {
          const hijriKey = await getHijriKey(today);
          if (hijriKey && this.config.hijriah[hijriKey]) {
            resolvedTemplate = this.config.hijriah[hijriKey];
            console.log(`[Router] Event Hijriah Detected: ${resolvedTemplate}`);
          } else {
            resolvedTemplate = this.config.default;
            console.log(`[Router] No Event Active. Defaulting to: ${resolvedTemplate}`);
          }
        }
      }

      if (!this.config.templates.includes(resolvedTemplate)) {
        resolvedTemplate = FALLBACK_TEMPLATE;
      }

      await this.loadTemplate(resolvedTemplate);
    },

    async loadTemplate(templateName) {
      try {
        const htmlPath = `/templates/${templateName}/index.html`;
        const cssPath = `/css/templates/${templateName}.css`;
        const jsPath = `/js/templates/${templateName}.js`;

        const response = await fetchWithTimeout(htmlPath);
        if (!response.ok) throw new Error(`HTML template tidak ditemukan: ${htmlPath}`);
        const htmlContent = await response.text();

        this.cleanupResources();

        this.injectCSS(templateName, cssPath);
        appContainer.textContent = htmlContent;
        this.currentTemplate = templateName;

        this.updateDocumentTitle(templateName);
        langSystem.translateDOM();

        await this.injectJS(templateName, jsPath);

        const loadedEvent = new CustomEvent('axion:template-loaded', {
          detail: { template: templateName }
        });
        window.dispatchEvent(loadedEvent);

      } catch (error) {
        console.error(`Gagal memuat template ${templateName}:`, error);
        if (templateName !== FALLBACK_TEMPLATE) {
          console.warn('Melakukan fallback otomatis ke default...');
          await this.loadTemplate(FALLBACK_TEMPLATE);
        } else {
          this.renderCriticalError();
        }
      } finally {
        this.hideLoader();
      }
    },

    injectCSS(templateName, href) {
      let linkElement = document.getElementById('axion-template-css');
      if (linkElement) {
        linkElement.href = href;
      } else {
        linkElement = document.createElement('link');
        linkElement.id = 'axion-template-css';
        linkElement.rel = 'stylesheet';
        linkElement.href = href;
        document.head.appendChild(linkElement);
      }
    },

    async injectJS(templateName, src) {
      return new Promise((resolve) => {
        const scriptId = 'axion-template-js';
        let scriptElement = document.getElementById(scriptId);
        if (scriptElement) {
          scriptElement.remove();
        }

        scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'module';
        scriptElement.src = `${src}?v=${Date.now()}`;
        
        scriptElement.onload = () => {
          console.log(`[Router] Script template ${templateName} berhasil dieksekusi.`);
          resolve();
        };

        scriptElement.onerror = (err) => {
          console.warn(`[Router] Gagal mengunduh modul JS untuk ${templateName}, menjalankan inline fallback if available.`, err);
          resolve();
        };

        document.body.appendChild(scriptElement);
        currentActiveScript = scriptElement;
      });
    },

    cleanupResources() {
      if (currentActiveScript) {
        currentActiveScript.remove();
        currentActiveScript = null;
      }
      const eventStyles = document.querySelectorAll('style[data-event-dynamic]');
      eventStyles.forEach(style => style.remove());
    },

    updateDocumentTitle(templateName) {
      const activeLang = langSystem.getCurrentLang();
      const baseTitle = "AXION Neuralis";
      let suffix = "";

      const titleMap = {
        'default': { id: 'Corporate Intelligent', en: 'Corporate Intelligent' },
        'tahun-baru': { id: 'Selamat Tahun Baru Masehi', en: 'Happy New Year' },
        '17-agustus': { id: 'Hari Kemerdekaan RI', en: 'Indonesia Independence Day' },
        'natal': { id: 'Selamat Hari Natal', en: 'Merry Christmas' },
        'lebaran': { id: 'Selamat Idul Fitri', en: 'Eid Mubarak' },
        'idul-adha': { id: 'Hari Raya Idul Adha', en: 'Eid Al-Adha' },
        'tahun-baru-islam': { id: 'Tahun Baru Hijriah', en: 'Islamic New Year' }
      };

      if (titleMap[templateName]) {
        suffix = titleMap[templateName][activeLang] || titleMap[templateName]['id'];
      }

      document.title = suffix ? `${baseTitle} — ${suffix}` : baseTitle;
    },

    showLoader() {
      let loader = document.getElementById('global-loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'axn-loader';
        loader.textContent = '<div class="axn-loader-spinner"></div>';
        document.body.appendChild(loader);
      }
      loader.classList.add('is-visible');
    },

    hideLoader() {
      const loader = document.getElementById('global-loader');
      if (loader) {
        loader.classList.remove('is-visible');
      }
    },

    renderCriticalError() {
      appContainer.textContent = `
        <main class="critical-error-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 70vh; padding: 24px; text-align: center;">
          <h1 style="color: #2d2d5e; font-size: 2rem; margin-bottom: 16px;">System Error</h1>
          <p style="color: #6b6b8a; max-width: 480px; margin-bottom: 24px;">Core System gagal memuat template halaman dasar. Silakan segarkan halaman atau hubungi Administrator AXION.</p>
          <button onclick="window.location.reload()" style="background-color: #2d2d5e; color: #ffffff; border: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; cursor: pointer;">Segarkan Halaman</button>
        </main>
      `;
    }
  };

  const langSystem = {
    currentLang: 'id',

    init() {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'id' || saved === 'en') {
        this.currentLang = saved;
      } else {
        const browserLang = navigator.language || navigator.userLanguage;
        this.currentLang = browserLang.startsWith('id') ? 'id' : 'en';
      }
      this.updateHtmlLang();
      this.bindControls();
    },

    bindControls() {
      document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-lang-toggle]');
        if (toggleBtn) {
          const targetLang = toggleBtn.getAttribute('data-lang-toggle');
          this.setLang(targetLang);
        }
      });
    },

    setLang(lang) {
      if (lang !== 'id' && lang !== 'en') return;
      this.currentLang = lang;
      localStorage.setItem(STORAGE_LANG_KEY, lang);
      this.updateHtmlLang();
      this.translateDOM();
      router.updateDocumentTitle(router.currentTemplate);
      
      const langEvent = new CustomEvent('axion:lang-changed', {
        detail: { language: this.currentLang }
      });
      window.dispatchEvent(langEvent);
    },

    getCurrentLang() {
      return this.currentLang;
    },

    updateHtmlLang() {
      document.documentElement.setAttribute('lang', this.currentLang);
    },

    translateDOM() {
      const elements = document.querySelectorAll('[data-id], [data-en]');
      elements.forEach(el => {
        const translation = el.getAttribute(`data-${this.currentLang}`);
        if (translation !== null) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            if (el.hasAttribute('placeholder')) {
              el.setAttribute('placeholder', translation);
            }
          } else {
            el.textContent = translation;
          }
        }
      });

      const langButtons = document.querySelectorAll('[data-lang-toggle]');
      langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang-toggle') === this.currentLang) {
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-pressed', 'false');
        }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    router.init();
  });

  window.AXION_CORE = {
    router,
    langSystem
  };

})();