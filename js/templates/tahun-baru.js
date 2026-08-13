(function () {
  const templateID = 'tahun-baru';
  let countdownInterval = null;
  let simulatedDashboardInterval = null;

  const templateLifecycle = {
    init() {
      console.log(`[AXION Event Engine] Initializing: ${templateID}`);
      
      this.bindLanguageSync();
      this.initCountdownTimer();
      this.initFuturisticVisuals();
      this.setupAccessibilityKeyboard();
    },

    bindLanguageSync() {
      const currentLanguage = localStorage.getItem('axion_lang') || 'id';
      this.applyLanguageElements(currentLanguage);

      this._languageHandler = (event) => {
        const lang = event.detail?.lang || event.detail?.language;
        if (lang) this.applyLanguageElements(lang);
      };
      document.addEventListener('axion:lang-changed', this._languageHandler);
    },

    applyLanguageElements(lang) {
      const activeSelectors = lang === 'id' ? '.lang-id' : '.lang-en';
      const hiddenSelectors = lang === 'id' ? '.lang-en' : '.lang-id';

      document.querySelectorAll(activeSelectors).forEach(el => {
        el.style.display = 'inline';
      });
      document.querySelectorAll(hiddenSelectors).forEach(el => {
        el.style.display = 'none';
      });
    },

    initCountdownTimer() {
      // Aim for January 1st of the upcoming target year 2027
      const targetDate = new Date('Jan 1, 2027 00:00:00').getTime();

      const updateClock = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
          clearInterval(countdownInterval);
          this.handleCountdownFinished();
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        this.updateDOMTime(days, hours, minutes, seconds);
      };

      // Set initial state immediately to avoid layout pop
      updateClock();
      countdownInterval = setInterval(updateClock, 1000);
    },

    updateDOMTime(d, h, m, s) {
      const formatNum = (num) => String(num).padStart(2, '0');

      const elDays = document.getElementById('ev-tb-days');
      const elHours = document.getElementById('ev-tb-hours');
      const elMins = document.getElementById('ev-tb-minutes');
      const elSecs = document.getElementById('ev-tb-seconds');

      if (elDays) elDays.textContent = formatNum(d);
      if (elHours) elHours.textContent = formatNum(h);
      if (elMins) elMins.textContent = formatNum(m);
      if (elSecs) elSecs.textContent = formatNum(s);
    },

    handleCountdownFinished() {
      this.updateDOMTime(0, 0, 0, 0);
      const headerTitle = document.getElementById('ev-tb-year-header');
      if (headerTitle) {
        headerTitle.textContent = '2027 ERA';
        headerTitle.setAttribute('data-text', '2027 ERA');
      }
    },

    initFuturisticVisuals() {
      // Simulate dynamically updating metrics on simulated neural dashboard
      const speedMetric = document.getElementById('ev-tb-live-speed');
      const bars = document.querySelectorAll('.ev-tb-bar');

      simulatedDashboardInterval = setInterval(() => {
        if (speedMetric) {
          const randomSpeed = (930 + Math.random() * 25).toFixed(1);
          speedMetric.textContent = `${randomSpeed} TFLOPS`;
        }

        bars.forEach(bar => {
          const randomHeight = Math.floor(35 + Math.random() * 60);
          bar.style.height = `${randomHeight}%`;
        });
      }, 2000);
    },

    setupAccessibilityKeyboard() {
      const interactiveCards = document.querySelectorAll('.ev-tb-service-card');
      interactiveCards.forEach(card => {
        card.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            card.click();
          }
        });
      });
    },

    destroy() {
      console.log(`[AXION Event Engine] Stopping active instances of template: ${templateID}`);
      if (countdownInterval) clearInterval(countdownInterval);
      if (simulatedDashboardInterval) clearInterval(simulatedDashboardInterval);
      
      if (this._languageHandler) {
        document.removeEventListener('axion:lang-changed', this._languageHandler);
        this._languageHandler = null;
      }
    }
  };

  window.AXION_TEMPLATE_LIFECYCLE = templateLifecycle;
})();