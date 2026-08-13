javascript
/**
 * AXION Neuralis - Idul Adha / Eid al-Adha Template Implementation Lifecycle
 * Single Entry Lifecycle System
 */

(function () {
  let adhaAudio = null;
  let isAdhaPlaying = false;

  const ADHA_AUDIO_PATH = '/assets/audio/tp1E.mp3';

  function handleAudioToggle(btn) {
    if (!adhaAudio) {
      adhaAudio = new Audio(ADHA_AUDIO_PATH);
      adhaAudio.loop = true;
      adhaAudio.volume = 0.5;

      adhaAudio.addEventListener('error', (e) => {
        console.warn('Audio asset failed to load:', e);
        alert('Gagal memuat audio spiritual Idul Adha.');
        resetButtonState(btn);
      });
    }

    const speakerIcon = btn.querySelector('.icon-speaker');
    const labelId = btn.querySelector('.audio-text.lang-id');
    const labelEn = btn.querySelector('.audio-text.lang-en');
    const transcriptionPanel = document.getElementById('adha-transcription');

    if (!isAdhaPlaying) {
      adhaAudio.play()
        .then(() => {
          isAdhaPlaying = true;
          btn.classList.add('playing');
          if (speakerIcon) speakerIcon.src = '/assets/images/icons/pause.svg';
          if (labelId) labelId.textContent = 'Hentikan Gema';
          if (labelEn) labelEn.textContent = 'Pause Echoes';
          if (transcriptionPanel) transcriptionPanel.style.display = 'block';
        })
        .catch((err) => {
          console.warn('Playback blocked by browser autoplay settings:', err);
          alert('Playback ditunda. Mohon berikan izin audio pada browser.');
        });
    } else {
      adhaAudio.pause();
      isAdhaPlaying = false;
      btn.classList.remove('playing');
      if (speakerIcon) speakerIcon.src = '/assets/images/icons/speaker.svg';
      if (labelId) labelId.textContent = 'Dengarkan Gema';
      if (labelEn) labelEn.textContent = 'Listen to Echoes';
    }
  }

  function resetButtonState(btn) {
    isAdhaPlaying = false;
    btn.classList.remove('playing');
    const speakerIcon = btn.querySelector('.icon-speaker');
    const labelId = btn.querySelector('.audio-text.lang-id');
    const labelEn = btn.querySelector('.audio-text.lang-en');
    
    if (speakerIcon) speakerIcon.src = '/assets/images/icons/speaker.svg';
    if (labelId) labelId.textContent = 'Dengarkan Gema';
    if (labelEn) labelEn.textContent = 'Listen to Echoes';
  }

  function renderFloatingGeometricSymmetry() {
    const hero = document.getElementById('adha-hero');
    if (!hero) return;

    for (let i = 0; i < 15; i++) {
      const geoElement = document.createElement('div');
      geoElement.className = 'adha-geo-particle';
      geoElement.style.position = 'absolute';
      geoElement.style.width = '24px';
      geoElement.style.height = '24px';
      geoElement.style.border = '1px solid rgba(229, 169, 59, 0.25)';
      geoElement.style.transform = `rotate(${Math.random() * 360}deg)`;
      geoElement.style.top = Math.random() * 85 + 5 + '%';
      geoElement.style.left = Math.random() * 90 + 5 + '%';
      geoElement.style.pointerEvents = 'none';
      geoElement.style.opacity = Math.random() * 0.4 + 0.1;
      
      hero.appendChild(geoElement);
    }
  }

  const idulAdhaTemplate = {
    init() {
      console.log('AXN: Loading Idul Adha Template Lifecycle...');
      document.title = 'Kebaikan Berbagi & Idul Adha 1447 H — AXION Neuralis';

      const audioBtn = document.getElementById('adha-audio-toggle');
      if (audioBtn) {
        audioBtn.addEventListener('click', () => handleAudioToggle(audioBtn));
      }

      const closeTranscriptionBtn = document.getElementById('close-adha-transcription');
      const transcriptionPanel = document.getElementById('adha-transcription');
      if (closeTranscriptionBtn && transcriptionPanel) {
        closeTranscriptionBtn.addEventListener('click', () => {
          transcriptionPanel.style.display = 'none';
        });
      }

      renderFloatingGeometricSymmetry();
    },

    destroy() {
      console.log('AXN: Releasing resources allocated for Idul Adha Template.');
      if (adhaAudio) {
        adhaAudio.pause();
        adhaAudio = null;
      }
      isAdhaPlaying = false;
    }
  };

  if (typeof window !== 'undefined') {
    window.activeTemplateLifecycle = idulAdhaTemplate;
  }
})();