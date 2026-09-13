javascript
/**
 * AXION Neuralis - Lebaran / Eid al-Fitr Template Implementation Lifecycle
 * Single Entry Lifecycle System
 */

(function () {
  let audioInstance = null;
  let isPlaying = false;

  const LEBARAN_AUDIO_PATH = '/assets/audio/tp1I.mp3';

  function handleAudioToggle(btn) {
    if (!audioInstance) {
      audioInstance = new Audio(LEBARAN_AUDIO_PATH);
      audioInstance.loop = true;
      audioInstance.volume = 0.5;

      audioInstance.addEventListener('error', (e) => {
        console.warn('Audio asset failed to load:', e);
        alert('Gagal memuat audio spiritual.');
        resetButtonState(btn);
      });
    }

    const speakerIcon = btn.querySelector('.icon-speaker');
    const labelId = btn.querySelector('.audio-text.lang-id');
    const labelEn = btn.querySelector('.audio-text.lang-en');
    const transcriptionPanel = document.getElementById('transcription-panel');

    if (!isPlaying) {
      audioInstance.play()
        .then(() => {
          isPlaying = true;
          btn.classList.add('playing');
          if (speakerIcon) speakerIcon.src = '/assets/images/icons/pause.svg';
          if (labelId) labelId.textContent = 'Hentikan Gema';
          if (labelEn) labelEn.textContent = 'Pause Echoes';
          if (transcriptionPanel) transcriptionPanel.style.display = 'block';
        })
        .catch((err) => {
          console.warn('Playback blocked by browser autoplay settings:', err);
          alert('Playback tertunda. Harap izinkan media pada browser Anda.');
        });
    } else {
      audioInstance.pause();
      isPlaying = false;
      btn.classList.remove('playing');
      if (speakerIcon) speakerIcon.src = '/assets/images/icons/speaker.svg';
      if (labelId) labelId.textContent = 'Putar Takbiran';
      if (labelEn) labelEn.textContent = 'Play Takbeer';
    }
  }

  function resetButtonState(btn) {
    isPlaying = false;
    btn.classList.remove('playing');
    const speakerIcon = btn.querySelector('.icon-speaker');
    const labelId = btn.querySelector('.audio-text.lang-id');
    const labelEn = btn.querySelector('.audio-text.lang-en');
    
    if (speakerIcon) speakerIcon.src = '/assets/images/icons/speaker.svg';
    if (labelId) labelId.textContent = 'Putar Takbiran';
    if (labelEn) labelEn.textContent = 'Play Takbeer';
  }

  function setupFloatingConfetti() {
    const hero = document.getElementById('lebaran-hero');
    if (!hero) return;

    for (let i = 0; i < 25; i++) {
      const particle = document.createElement('div');
      particle.className = 'lebaran-confetti';
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 8 + 4 + 'px';
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = Math.random() > 0.5 ? '#d4af37' : '#00d4ff';
      particle.style.opacity = Math.random() * 0.6 + 0.2;
      particle.style.borderRadius = '50%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.pointerEvents = 'none';
      
      hero.appendChild(particle);
    }
  }

  const lebaranTemplate = {
    init() {
      console.log('AXN: Loading Lebaran (Eid al-Fitr) Template Lifecycle...');
      document.title = 'Selamat Hari Raya Idul Fitri 1447 H — AXION Neuralis';

      const audioBtn = document.getElementById('audio-toggle-btn');
      if (audioBtn) {
        this.audioClickHandler = () => handleAudioToggle(audioBtn);
        audioBtn.addEventListener('click', this.audioClickHandler);
      }

      const closeTranscriptionBtn = document.getElementById('close-transcription');
      const transcriptionPanel = document.getElementById('transcription-panel');
      if (closeTranscriptionBtn && transcriptionPanel) {
        this.closeClickHandler = () => {
          transcriptionPanel.style.display = 'none';
        };
        closeTranscriptionBtn.addEventListener('click', this.closeClickHandler);
      }

      setupFloatingConfetti();
    },

    destroy() {
      console.log('AXN: Unloading Lebaran Template, releasing resources.');
      const audioButton = document.getElementById('audio-toggle-btn');
      if (audioButton && this.audioClickHandler) {
        audioButton.removeEventListener('click', this.audioClickHandler);
        this.audioClickHandler = null;
      }
      const closeButton = document.getElementById('close-transcription');
      if (closeButton && this.closeClickHandler) {
        closeButton.removeEventListener('click', this.closeClickHandler);
        this.closeClickHandler = null;
      }
      if (audioInstance) {
        audioInstance.pause();
        audioInstance = null;
      }
      isPlaying = false;
    }
  };

  if (typeof window !== 'undefined') {
    window.AXION_TEMPLATE_LIFECYCLE = lebaranTemplate;
  }
})();