/**
 * AXION Neuralis — TTS client (fitur Read)
 * Worker : https://axion-neuralis-workers.axn.cc.cd
 * Model  : gemini-3.1-flash-tts-preview
 * Voice  : Charon
 */
(function (global) {
  'use strict';

  const WORKER_URL =
    (typeof global.AXION_TTS_WORKER_URL === 'string' && global.AXION_TTS_WORKER_URL) ||
    'https://axion-neuralis-workers.axn.cc.cd';

  let currentAudio = null;
  let currentAbort = null;
  let objectUrl = null;

  function pcmBase64ToWavUrl(base64, sampleRate) {
    sampleRate = sampleRate || 24000;
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
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeStr(36, 'data');
    view.setUint32(40, dataSize, true);

    const wavBytes = new Uint8Array(buffer);
    wavBytes.set(pcm, 44);
    return URL.createObjectURL(new Blob([wavBytes], { type: 'audio/wav' }));
  }

  function stop() {
    if (currentAbort) {
      try { currentAbort.abort(); } catch (_) {}
      currentAbort = null;
    }
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.removeAttribute('src');
        currentAudio.load();
      } catch (_) {}
      currentAudio = null;
    }
    if (objectUrl) {
      try { URL.revokeObjectURL(objectUrl); } catch (_) {}
      objectUrl = null;
    }
  }

  function setButtonState(btn, state) {
    if (!btn) return;
    const label = btn.querySelector('.tts-label');
    btn.classList.remove('playing', 'loading');
    btn.disabled = false;
    if (state === 'loading') {
      btn.disabled = true;
      btn.classList.add('loading');
      if (label) label.textContent = 'Menyiapkan…';
    } else if (state === 'playing') {
      btn.classList.add('playing');
      if (label) label.textContent = 'Berhenti';
    } else {
      if (label) label.textContent = 'Dengarkan';
    }
  }

  async function read(text, options) {
    options = options || {};
    const clean = (text || '').trim();
    if (!clean) {
      if (options.onError) options.onError(new Error('Teks kosong'));
      return;
    }

    stop();
    setButtonState(options.button, 'loading');

    const controller = new AbortController();
    currentAbort = controller;

    try {
      const res = await fetch(WORKER_URL.replace(/\/$/, '') + '/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: clean.slice(0, 4000),
          voice: 'Charon',
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let detail = 'HTTP ' + res.status;
        try {
          const err = await res.json();
          if (err.error) detail = err.error;
        } catch (_) {}
        throw new Error(detail);
      }

      const data = await res.json();
      if (!data.audioBase64) throw new Error('Tidak ada data audio');

      objectUrl = pcmBase64ToWavUrl(data.audioBase64);
      const audio = new Audio(objectUrl);
      currentAudio = audio;

      audio.addEventListener('ended', function () {
        stop();
        setButtonState(options.button, 'idle');
        if (options.onEnd) options.onEnd();
      });

      audio.addEventListener('error', function () {
        stop();
        setButtonState(options.button, 'idle');
        if (options.onError) options.onError(new Error('Gagal memutar audio'));
      });

      setButtonState(options.button, 'playing');
      if (options.onStart) options.onStart();
      await audio.play();
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[AXION TTS]', err);
      stop();
      setButtonState(options.button, 'idle');
      if (options.onError) options.onError(err);
      else alert('Gagal menghasilkan suara: ' + (err.message || err));
    } finally {
      currentAbort = null;
    }
  }

  function toggle(textOrEl, options) {
    options = options || {};
    if (currentAudio && !currentAudio.paused) {
      stop();
      setButtonState(options.button, 'idle');
      return;
    }
    var text = '';
    if (typeof textOrEl === 'string') text = textOrEl;
    else if (textOrEl && textOrEl.innerText) text = textOrEl.innerText;
    else if (textOrEl && textOrEl.textContent) text = textOrEl.textContent;
    return read(text, options);
  }

  global.AxionTTS = {
    read: read,
    toggle: toggle,
    stop: stop,
    workerUrl: WORKER_URL,
  };
})(typeof window !== 'undefined' ? window : globalThis);
