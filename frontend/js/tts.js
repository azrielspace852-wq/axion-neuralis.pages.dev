/**
 * AXION Neuralis — Client-side TTS ("Read") helper
 * Calls Cloudflare Worker → Gemini 3.1 Flash TTS (Charon voice)
 *
 * Configure worker URL below (or via window.AXION_TTS_WORKER_URL).
 */
(function (global) {
  'use strict';

  const DEFAULT_WORKER_URL = 'https://axion-neuralis-workers.axn.cd';

  const WORKER_URL =
    (typeof global.AXION_TTS_WORKER_URL === 'string' && global.AXION_TTS_WORKER_URL) ||
    DEFAULT_WORKER_URL;

  let currentAudio = null;
  let currentAbort = null;

  /**
   * Convert raw PCM (s16le, 24 kHz, mono) base64 → playable WAV Blob URL
   */
  function pcmBase64ToWavUrl(base64, sampleRate = 24000) {
    const binary = atob(base64);
    const len = binary.length;
    const pcm = new Uint8Array(len);
    for (let i = 0; i < len; i++) pcm[i] = binary.charCodeAt(i);

    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = pcm.length;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    function writeStr(offset, str) {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true); // PCM chunk size
    view.setUint16(20, 1, true); // audio format = PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeStr(36, 'data');
    view.setUint32(40, dataSize, true);

    const wavBytes = new Uint8Array(buffer);
    wavBytes.set(pcm, 44);

    const blob = new Blob([wavBytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  function stopCurrent() {
    if (currentAbort) {
      try { currentAbort.abort(); } catch (_) {}
      currentAbort = null;
    }
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.src = '';
      } catch (_) {}
      currentAudio = null;
    }
  }

  /**
   * Request TTS from Worker and play.
   * @param {string} text
   * @param {object} options { button, onStart, onEnd, onError }
   */
  async function readText(text, options = {}) {
    const clean = (text || '').trim();
    if (!clean) {
      if (options.onError) options.onError(new Error('Teks kosong'));
      return;
    }

    stopCurrent();

    const btn = options.button;
    if (btn) {
      btn.disabled = true;
      btn.classList.add('tts-loading');
      const label = btn.querySelector('.tts-label');
      if (label) label.textContent = 'Menyiapkan suara…';
    }

    const controller = new AbortController();
    currentAbort = controller;

    try {
      const res = await fetch(`${WORKER_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: clean.slice(0, 4000),
          voice: 'Charon',
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.audioBase64) throw new Error('Tidak ada data audio');

      const url = pcmBase64ToWavUrl(data.audioBase64);
      const audio = new Audio(url);
      currentAudio = audio;

      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(url);
        currentAudio = null;
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('tts-loading', 'tts-playing');
          const label = btn.querySelector('.tts-label');
          if (label) label.textContent = 'Dengarkan';
        }
        if (options.onEnd) options.onEnd();
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        if (options.onError) options.onError(new Error('Gagal memutar audio'));
      });

      if (btn) {
        btn.classList.remove('tts-loading');
        btn.classList.add('tts-playing');
        const label = btn.querySelector('.tts-label');
        if (label) label.textContent = 'Berhenti';
        btn.disabled = false;
      }

      if (options.onStart) options.onStart();
      await audio.play();
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[AXION TTS]', err);
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('tts-loading', 'tts-playing');
        const label = btn.querySelector('.tts-label');
        if (label) label.textContent = 'Dengarkan';
      }
      if (options.onError) options.onError(err);
      else alert('Gagal menghasilkan suara: ' + (err.message || err));
    } finally {
      currentAbort = null;
    }
  }

  /**
   * Toggle: if playing → stop, else read the given text / element.
   */
  function toggleRead(textOrElement, options = {}) {
    if (currentAudio && !currentAudio.paused) {
      stopCurrent();
      if (options.button) {
        options.button.classList.remove('tts-playing');
        const label = options.button.querySelector('.tts-label');
        if (label) label.textContent = 'Dengarkan';
      }
      return;
    }

    let text = '';
    if (typeof textOrElement === 'string') {
      text = textOrElement;
    } else if (textOrElement instanceof HTMLElement) {
      text = textOrElement.innerText || textOrElement.textContent || '';
    }
    return readText(text, options);
  }

  // Public API
  global.AxionTTS = {
    read: readText,
    toggle: toggleRead,
    stop: stopCurrent,
    setWorkerUrl(url) {
      global.AXION_TTS_WORKER_URL = url;
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
