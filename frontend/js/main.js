/**
 * AXION Neuralis Core System
 * AXION BLUEPRINT v3.0.0 / BIBLE v2.2.0
 * Global router, event resolver, lifecycle manager, language system and fallback.
 */
(function () {
  'use strict';

  const FALLBACK_TEMPLATE = 'default';
  const TEMPLATE_TIMEOUT = 8000;
  const STORAGE_LANG_KEY = 'axn_lang';

  let appContainer = null;
  let currentActiveScript = null;
  let currentLifecycle = null;
  let renderSequence = 0;

  function isSafeTemplateName(name) {
    return typeof name === 'string' && /^[a-z0-9-]+$/i.test(name);
  }

  function getConfiguredTemplates(config) {
    const configured = Array.isArray(config?.templates) ? config.templates : [];
    return new Set(
      configured
        .filter(isSafeTemplateName)
        .concat(FALLBACK_TEMPLATE)
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
      if (!response.ok) throw new Error(`events.json HTTP ${response.status}`);

      const config = await response.json();
      const templates = getConfiguredTemplates(config);

      return {
        masehi: config?.masehi && typeof config.masehi === 'object'
          ? config.masehi
          : {},
        hijriah: config?.hijriah && typeof config.hijriah === 'object'
          ? config.hijriah
          : {},
        default: templates.has(config?.default)
          ? config.default
          : FALLBACK_TEMPLATE,
        templates: [...templates]
      };
    } catch (error) {
      console.warn('[AXION Router] Config gagal dimuat. Fallback default digunakan.', error);
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
      const d = date.getDate();
      const m = date.getMonth() + 1;
      const y = date.getFullYear();
      const url = `https://api.aladhan.com/v1/gToH?date=${d}-${m}-${y}`;

      const response = await fetchWithTimeout(url);
      if (!response.ok) throw new Error(`Hijri API HTTP ${response.status}`);

      const data = await response.json();
      const hijri = data?.data?.hijri;
      if (!hijri?.day || !hijri?.month?.number) return null;

      const day = Number.parseInt(hijri.day, 10);
      const month = Number.parseInt(hijri.month.number, 10);
      if (!Number.isInteger(day) || !Number.isInteger(month)) return null;

      return `${day}-${month}`;
    } catch (error) {
      console.warn('[AXION Router] Tanggal Hijriah tidak tersedia:', error.message);
      return null;
    }
  }

  function waitForStylesheet(link) {
    return new Promise((resolve, reject) => {
      if (link.sheet) {
        resolve();
        return;
      }
      const onLoad = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error(`CSS template gagal dimuat: ${link.href}`));
      };
      const cleanup = () => {
        link.removeEventListener('load', onLoad);
        link.removeEventListener('error', onError);
      };
      link.addEventListener('load', onLoad, { once: true });
      link.addEventListener('error', onError, { once: true });
    });
  }

  function resolveTemplateLifecycle(templateName) {
    const lifecycle = window.AXION_TEMPLATE_LIFECYCLE;
    if (!lifecycle || typeof lifecycle.init !== 'function') {
      throw new Error(`Lifecycle template "${templateName}" tidak terdaftar.`);
    }
    return lifecycle;
  }

  const router = {
    currentTemplate: FALLBACK_TEMPLATE,
    config: null,

    async init() {
      appContainer = document.getElementById('app');

      // Language is global and must work on both routed and static pages.
      langSystem.init();

      if (!appContainer) {
        return;
      }

      this.config = await loadEventsConfig();
      this.bindEvents();
      await this.resolveAndRender();
    },

    bindEvents() {
      window.addEventListener('popstate', () => {
        if (appContainer) {
          this.resolveAndRender();
        }
      });
    },

    async resolveAndRender() {
      const token = ++renderSequence;
      this.showLoader();

      try {
        const params = new URLSearchParams(window.location.search);
        const preview = params.get('template');
        const allowedTemplates = getConfiguredTemplates(this.config || {});

        let resolvedTemplate = FALLBACK_TEMPLATE;

        if (
          preview &&
          isSafeTemplateName(preview) &&
          allowedTemplates.has(preview)
        ) {
          resolvedTemplate = preview;
        } else {
          const today = new Date();
          const masehiKey = `${today.getDate()}-${today.getMonth() + 1}`;
          const masehiTemplate = this.config?.masehi?.[masehiKey];

          if (
            isSafeTemplateName(masehiTemplate) &&
            allowedTemplates.has(masehiTemplate)
          ) {
            resolvedTemplate = masehiTemplate;
          } else {
            const hijriKey = await getHijriKey(today);
            const hijriTemplate = hijriKey
              ? this.config?.hijriah?.[hijriKey]
              : null;

            if (
              isSafeTemplateName(hijriTemplate) &&
              allowedTemplates.has(hijriTemplate)
            ) {
              resolvedTemplate = hijriTemplate;
            } else {
              resolvedTemplate = this.config?.default || FALLBACK_TEMPLATE;
            }
          }
        }

        if (!allowedTemplates.has(resolvedTemplate)) {
          resolvedTemplate = FALLBACK_TEMPLATE;
        }

        await this.loadTemplate(resolvedTemplate, token);
      } catch (error) {
        console.error('[AXION Router] Resolution error:', error);
        if (token === renderSequence) {
          await this.loadTemplate(FALLBACK_TEMPLATE, token, true);
        }
      } finally {
        if (token === renderSequence) {
          this.hideLoader();
        }
      }
    },

    async loadTemplate(templateName, token, isFallbackAttempt = false) {
      if (token !== renderSequence || !appContainer) return;

      const allowedTemplates = getConfiguredTemplates(this.config || {});
      const safeName = allowedTemplates.has(templateName)
        ? templateName
        : FALLBACK_TEMPLATE;

      try {
        const htmlPath = `/templates/${safeName}/index.html`;
        const cssPath = `/css/templates/${safeName}.css`;
        const jsPath = `/js/templates/${safeName}.js`;

        const htmlResponse = await fetchWithTimeout(htmlPath);
        if (!htmlResponse.ok) {
          throw new Error(`HTML template tidak ditemukan: ${htmlPath}`);
        }
        const htmlContent = await htmlResponse.text();

        if (token !== renderSequence) return;

        await this.cleanupResources();

        // Blueprint order: HTML → CSS → JS → init → ready.
        appContainer.innerHTML = htmlContent;

        const cssLink = document.createElement('link');
        cssLink.id = 'axion-template-css';
        cssLink.rel = 'stylesheet';
        cssLink.href = cssPath;
        cssLink.dataset.templateCss = safeName;
        document.head.appendChild(cssLink);
        await waitForStylesheet(cssLink);

        if (token !== renderSequence) return;

        await this.injectJS(safeName, jsPath);

        if (token !== renderSequence) return;

        const lifecycle = resolveTemplateLifecycle(safeName);
        await Promise.resolve(lifecycle.init());
        currentLifecycle = lifecycle;
        this.currentTemplate = safeName;
        this.updateDocumentTitle(safeName);
        langSystem.translateDOM();

        window.dispatchEvent(new CustomEvent('axion:template-loaded', {
          detail: { name: safeName, template: safeName }
        }));
      } catch (error) {
        console.error(`[AXION Router] Gagal memuat template "${safeName}":`, error);

        if (token !== renderSequence) return;

        if (!isFallbackAttempt && safeName !== FALLBACK_TEMPLATE) {
          await this.loadTemplate(FALLBACK_TEMPLATE, token, true);
        } else {
          await this.cleanupResources();
          this.renderCriticalError();
        }
      }
    },

    async injectJS(templateName, src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'axion-template-js';
        script.src = `${src}?v=${Date.now()}`;
        script.async = false;
        script.dataset.templateJs = templateName;

        script.addEventListener('load', () => {
          currentActiveScript = script;
          resolve();
        }, { once: true });

        script.addEventListener('error', () => {
          script.remove();
          reject(new Error(`JS template gagal dimuat: ${src}`));
        }, { once: true });

        document.body.appendChild(script);
      });
    },

    async cleanupResources() {
      if (currentLifecycle && typeof currentLifecycle.destroy === 'function') {
        try {
          await Promise.resolve(currentLifecycle.destroy());
        } catch (error) {
          console.warn('[AXION Router] Template destroy() gagal:', error);
        }
      }

      currentLifecycle = null;

      if (currentActiveScript) {
        currentActiveScript.remove();
        currentActiveScript = null;
      }

      document.querySelectorAll('link[data-template-css]').forEach((link) => {
        link.remove();
      });

      document.querySelectorAll('style[data-event-dynamic]').forEach((style) => {
        style.remove();
      });

      delete window.AXION_TEMPLATE_LIFECYCLE;
      delete window.currentTemplateInstance;
      delete window.activeTemplateLifecycle;
      delete window.AXN_TEMPLATE_ACTIVE;
    },

    updateDocumentTitle(templateName) {
      const lang = langSystem.getCurrentLang();
      const titleMap = {
        default: { id: 'Mode Standar', en: 'Standard Mode' },
        'tahun-baru': { id: 'Tahun Baru Masehi', en: 'New Year' },
        '17-agustus': { id: 'Hari Kemerdekaan Republik Indonesia', en: 'Indonesia Independence Day' },
        lebaran: { id: 'Idul Fitri', en: 'Eid al-Fitr' },
        natal: { id: 'Natal', en: 'Christmas' },
        'idul-adha': { id: 'Idul Adha', en: 'Eid al-Adha' },
        'tahun-baru-islam': { id: 'Tahun Baru Islam', en: 'Islamic New Year' }
      };

      const suffix = titleMap[templateName]?.[lang] || titleMap.default[lang];
      document.title = `AXION Neuralis — ${suffix}`;
    },

    showLoader() {
      let loader = document.getElementById('global-loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'axn-loader';
        loader.setAttribute('role', 'status');
        loader.setAttribute('aria-live', 'polite');
        loader.setAttribute('aria-label', 'Loading AXION Neuralis');

        const spinner = document.createElement('div');
        spinner.className = 'axn-loader-spinner';
        spinner.setAttribute('aria-hidden', 'true');
        loader.appendChild(spinner);

        document.body.appendChild(loader);
      }
      loader.classList.add('is-visible');
    },

    hideLoader() {
      document.getElementById('global-loader')?.classList.remove('is-visible');
    },

    renderCriticalError() {
      appContainer.replaceChildren();

      const section = document.createElement('section');
      section.className = 'critical-error-container';
      section.setAttribute('role', 'alert');
      section.innerHTML = '';

      const heading = document.createElement('h1');
      heading.textContent = 'AXION Neuralis';
      const message = document.createElement('p');
      message.textContent = 'Sistem gagal memuat template halaman dasar. Silakan muat ulang halaman.';
      const reload = document.createElement('button');
      reload.type = 'button';
      reload.className = 'button button-primary';
      reload.textContent = 'Muat Ulang';
      reload.addEventListener('click', () => window.location.reload());

      section.append(heading, message, reload);
      appContainer.appendChild(section);
    }
  };

  const langSystem = {
    currentLang: 'id',

    init() {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'id' || saved === 'en') {
        this.currentLang = saved;
      } else {
        const browserLang = navigator.language || navigator.userLanguage || 'id';
        this.currentLang = browserLang.toLowerCase().startsWith('id') ? 'id' : 'en';
      }
      this.updateHtmlLang();
      this.bindControls();
      this.translateDOM();
    },

    bindControls() {
      if (this._bound) return;

      document.addEventListener('click', (event) => {
        const target = event.target.closest('[data-lang-toggle], [data-language-toggle], #language-selector, #lang-switch, #language-toggle');
        if (!target) return;

        const explicit = target.getAttribute('data-lang-toggle');
        const language = explicit === 'id' || explicit === 'en'
          ? explicit
          : (this.currentLang === 'id' ? 'en' : 'id');

        this.setLang(language);
      });

      document.addEventListener('change', (event) => {
        const target = event.target.closest('#language-select');
        if (!target) return;
        this.setLang(target.value);
      });

      this._bound = true;
    },

    setLang(lang) {
      if (lang !== 'id' && lang !== 'en') return;
      this.currentLang = lang;
      localStorage.setItem(STORAGE_LANG_KEY, lang);
      this.updateHtmlLang();
      this.translateDOM();

      if (router.currentTemplate) {
        router.updateDocumentTitle(router.currentTemplate);
      }

      window.dispatchEvent(new CustomEvent('axion:lang-changed', {
        detail: { lang: lang, language: lang }
      }));
    },

    getCurrentLang() {
      return this.currentLang;
    },

    updateHtmlLang() {
      document.documentElement.setAttribute('lang', this.currentLang);
    },

    translateDOM() {
      const active = this.currentLang;

      document.querySelectorAll('.lang-id, [lang="id"], [data-lang="id"]').forEach((el) => {
        if (!el.matches('html')) el.hidden = active !== 'id';
      });
      document.querySelectorAll('.lang-en, [lang="en"], [data-lang="en"]').forEach((el) => {
        if (!el.matches('html')) el.hidden = active !== 'en';
      });

      document.querySelectorAll('[data-id], [data-en]').forEach((el) => {
        const translation = el.getAttribute(`data-${active}`);
        if (translation === null) return;

        if (el.matches('input, textarea')) {
          el.placeholder = translation;
        } else if (el.matches('img')) {
          el.alt = translation;
        } else {
          el.textContent = translation;
        }
      });

      document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
        const value = btn.getAttribute('data-lang-toggle');
        btn.classList.toggle('is-active', value === active);
        btn.setAttribute('aria-pressed', value === active ? 'true' : 'false');
      });
    }
  };

  window.AXION_CORE = { router, langSystem };

  document.addEventListener('DOMContentLoaded', () => {
    router.init();
  });
})();
