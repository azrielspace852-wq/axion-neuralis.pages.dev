(function () {
  const templateID = '17-agustus';

  const templateLifecycle = {
    init() {
      console.log(`[AXION Event Engine] Initializing: ${templateID}`);
      
      this.bindLanguageSync();
      this.initSpeechAudio();
      this.setupAccessibilityKeyboard();
    },

    bindLanguageSync() {
      // Determine language status from DOM or localStorage default
      const currentLanguage = localStorage.getItem('axion_lang') || 'id';
      this.applyLanguageElements(currentLanguage);

      // Listen to dynamic change events dispatched by corporate root shell
      document.addEventListener('axion:lang-changed', (event) => {
        if (event.detail && event.detail.lang) {
          this.applyLanguageElements(event.detail.lang);
        }
      });
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

      // Update structural elements depending on audio speech
      const sourceElement = document.getElementById('ev-17-audio-source');
      if (sourceElement) {
        if (lang === 'id') {
          sourceElement.src = '/assets/audio/tp1I.mp3';
        } else {
          sourceElement.src = '/assets/audio/tp1E.mp3';
        }
        
        // Reset player state safely if track updates
        const audio = document.getElementById('ev-17-speech-audio');
        if (audio && !audio.paused) {
          audio.pause();
          this.togglePlayVisuals(false);
        }
        if (audio) {
          audio.load();
        }
      }
    },

    initSpeechAudio() {
      const audio = document.getElementById('ev-17-speech-audio');
      const playBtn = document.getElementById('ev-17-play-btn');
      const heroAudioBtn = document.getElementById('ev-17-audio-toggle');
      const progressBar = document.querySelector('.ev-17-progress-bar');
      const progressFilled = document.getElementById('ev-17-progress-filled');
      const transcriptToggle = document.getElementById('ev-17-transcript-toggle');
      const transcriptContent = document.getElementById('ev-17-transcript-content');

      if (!audio || !playBtn) return;

      const toggleAudio = () => {
        if (audio.paused) {
          audio.play().then(() => {
            this.togglePlayVisuals(true);
          }).catch(err => {
            console.warn('Audio play block on browser settings:', err);
          });
        } else {
          audio.pause();
          this.togglePlayVisuals(false);
        }
      };

      playBtn.addEventListener('click', toggleAudio);
      if (heroAudioBtn) {
        heroAudioBtn.addEventListener('click', () => {
          document.getElementById('ev-17-audio-title')?.scrollIntoView({ behavior: 'smooth' });
          toggleAudio();
        });
      }

      audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        if (progressFilled) {
          progressFilled.style.width = `${percent}%`;
        }
        progressBar?.setAttribute('aria-valuenow', Math.floor(percent));
      });

      audio.addEventListener('ended', () => {
        this.togglePlayVisuals(false);
        if (progressFilled) {
          progressFilled.style.width = '0%';
        }
      });

      // Simple relative progress interaction click
      progressBar?.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickOffset = e.clientX - rect.left;
        const width = rect.right - rect.left;
        const ratio = clickOffset / width;
        audio.currentTime = ratio * audio.duration;
      });

      // Transcript system toggle 
      if (transcriptToggle && transcriptContent) {
        transcriptToggle.addEventListener('click', () => {
          const isHidden = transcriptContent.classList.contains('ev-17-hidden');
          if (isHidden) {
            transcriptContent.classList.remove('ev-17-hidden');
            transcriptToggle.querySelector('.lang-id').textContent = 'Sembunyikan Transkrip Teks';
            transcriptToggle.querySelector('.lang-en').textContent = 'Hide Transcript';
          } else {
            transcriptContent.classList.add('ev-17-hidden');
            transcriptToggle.querySelector('.lang-id').textContent = 'Tampilkan Transkrip Teks';
            transcriptToggle.querySelector('.lang-en').textContent = 'Show Transcript';
          }
        });
      }
    },

    togglePlayVisuals(isPlaying) {
      const playIcon = document.querySelector('#ev-17-play-btn img');
      if (playIcon) {
        if (isPlaying) {
          playIcon.src = '/assets/images/icons/pause.svg';
          playIcon.alt = 'Pause icon';
        } else {
          playIcon.src = '/assets/images/icons/play.svg';
          playIcon.alt = 'Play icon';
        }
      }
    },

    setupAccessibilityKeyboard() {
      // Allow seamless keyboard execution for visual action items
      const focusableCards = document.querySelectorAll('.ev-17-card');
      focusableCards.forEach(card => {
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
      const audio = document.getElementById('ev-17-speech-audio');
      if (audio) {
        audio.pause();
      }
      // Detach globally bound events
      document.removeEventListener('axion:lang-changed', this.applyLanguageElements);
    }
  };

  // Safely assign the lifecycle interface to corporate global router
  window.currentTemplateInstance = templateLifecycle;
  templateLifecycle.init();
})();