/**
 * AXION Neuralis — TTS Worker
 * Domain  : https://axion-neuralis-workers.axn.cc.cd
 * Feature : Read (Text-to-Speech)
 * Model   : gemini-3.1-flash-tts-preview
 * Voice   : Charon
 *
 * Cloudflare Dashboard → Workers → Settings → Variables:
 *   Secret: GEMINI_API_KEY
 */

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent';

/** Instruksi gaya: nada santai, jeda lebih natural */
const STYLE_PROMPT =
  'Speak in a relaxed, calm, conversational tone suitable for Indonesian and English listeners. ' +
  'Use natural pacing with gentle pauses between sentences and clauses. ' +
  'Sound informative yet approachable, never rushed or robotic. ' +
  'Prefer a slightly slower tempo so listeners can follow comfortably.';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    if (request.method === 'GET' && (path === '/' || path === '/health')) {
      return json({
        ok: true,
        service: 'axion-neuralis-tts',
        model: 'gemini-3.1-flash-tts-preview',
        voice: 'Charon',
        domain: 'axion-neuralis-workers.axn.cc.cd',
      });
    }

    if (request.method === 'POST' && (path === '/tts' || path === '/api/read' || path === '/')) {
      return handleTTS(request, env);
    }

    return json({ error: 'Not found' }, 404);
  },
};

async function handleTTS(request, env) {
  try {
    if (!env.GEMINI_API_KEY) {
      return json({ error: 'GEMINI_API_KEY secret is not configured' }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const text = String(body.text || body.content || '').trim();
    if (!text) return json({ error: 'Field "text" is required' }, 400);
    if (text.length > 4000) return json({ error: 'Text too long (max 4000 characters)' }, 400);

    const voiceName = body.voice || 'Charon';
    const spokenText = STYLE_PROMPT + '\n\n' + prepareText(text);

    const payload = {
      contents: [{ parts: [{ text: spokenText }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    };

    const geminiRes = await fetch(GEMINI_ENDPOINT + '?key=' + env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error', geminiRes.status, errText.slice(0, 400));
      return json(
        { error: 'TTS generation failed', status: geminiRes.status, detail: errText.slice(0, 400) },
        502
      );
    }

    const result = await geminiRes.json();
    const part = result?.candidates?.[0]?.content?.parts?.[0];
    const inline = part?.inlineData || part?.inline_data;

    if (!inline?.data) {
      console.error('No audio in response', JSON.stringify(result).slice(0, 500));
      return json({ error: 'No audio data returned from model' }, 502);
    }

    return json({
      success: true,
      voice: voiceName,
      model: 'gemini-3.1-flash-tts-preview',
      mimeType: inline.mimeType || inline.mime_type || 'audio/L16;rate=24000',
      audioBase64: inline.data,
      format: 'pcm_s16le_24khz_mono',
    });
  } catch (err) {
    console.error('Worker error', err);
    return json({ error: 'Internal error', message: String(err.message || err) }, 500);
  }
}

function prepareText(raw) {
  let t = raw.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
  t = t.replace(/([.!?])(\s+)([A-ZÀ-ÖØ-Þ])/g, '$1 [short pause]$2$3');
  t = t.replace(/\n\n+/g, ' [medium pause] ');
  return t;
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  });
}
