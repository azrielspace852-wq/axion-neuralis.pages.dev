/**
 * AXION Neuralis — TTS Worker (Cloudflare Workers)
 * Feature: "Read" (Text-to-Speech)
 * Model : gemini-3.1-flash-tts-preview
 * Voice : Charon (informative, calm male)
 *
 * Secrets (set in Cloudflare Dashboard → Workers → Settings → Variables):
 *   GEMINI_API_KEY  (Secret)
 *
 * Optional Variables:
 *   ALLOWED_ORIGIN  (e.g. https://axion-neuralis.pages.dev)
 */

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent';

/** Style instruction — relaxed, natural pauses */
const STYLE_PROMPT =
  'Speak in a relaxed, calm, conversational Indonesian-friendly tone. ' +
  'Use natural pacing with gentle pauses between sentences and clauses. ' +
  'Sound informative yet approachable, never rushed or robotic. ' +
  'Prefer a slightly slower tempo so listeners can follow comfortably.';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // Health check
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json({ ok: true, service: 'axion-tts', model: 'gemini-3.1-flash-tts-preview', voice: 'Charon' });
    }

    // TTS endpoint
    if (request.method === 'POST' && (url.pathname === '/tts' || url.pathname === '/api/read' || url.pathname === '/')) {
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

    const text = (body.text || body.content || '').trim();
    if (!text) {
      return json({ error: 'Field "text" is required' }, 400);
    }
    if (text.length > 4000) {
      return json({ error: 'Text too long (max 4000 characters)' }, 400);
    }

    // Optional override (still force Charon by default)
    const voiceName = body.voice || 'Charon';
    const languageCode = body.language || body.languageCode || null;

    // Build the spoken content with style guidance + natural pauses
    // Inline tags help natural pauses: [short pause], [medium pause]
    const spokenText = `${STYLE_PROMPT}\n\n${prepareTextForSpeech(text)}`;

    const payload = {
      contents: [
        {
          parts: [{ text: spokenText }],
        },
      ],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName,
            },
          },
        },
      },
    };

    if (languageCode) {
      payload.generationConfig.speechConfig.languageCode = languageCode;
    }

    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini TTS error:', geminiRes.status, errText);
      return json(
        {
          error: 'TTS generation failed',
          status: geminiRes.status,
          detail: safeTruncate(errText, 500),
        },
        502
      );
    }

    const result = await geminiRes.json();
    const inlineData =
      result?.candidates?.[0]?.content?.parts?.[0]?.inlineData ||
      result?.candidates?.[0]?.content?.parts?.[0]?.inline_data;

    if (!inlineData?.data) {
      console.error('No audio data in response', JSON.stringify(result).slice(0, 800));
      return json({ error: 'No audio data returned from model' }, 502);
    }

    const mimeType = inlineData.mimeType || inlineData.mime_type || 'audio/L16;rate=24000';
    const base64Audio = inlineData.data;

    // Return both base64 and metadata so frontend can play easily
    return json(
      {
        success: true,
        voice: voiceName,
        model: 'gemini-3.1-flash-tts-preview',
        mimeType,
        audioBase64: base64Audio,
        // Convenience data-URI for direct Audio() usage (PCM needs special handling)
        // Most browsers prefer we return a WAV wrapper — see note below.
        format: 'pcm_s16le_24khz_mono',
      },
      200
    );
  } catch (err) {
    console.error('Worker error:', err);
    return json({ error: 'Internal error', message: String(err.message || err) }, 500);
  }
}

/**
 * Light cleanup + insert natural pause markers for better prosody.
 */
function prepareTextForSpeech(raw) {
  let t = raw
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  // Add gentle pause after sentence terminators if not already tagged
  t = t.replace(/([.!?])(\s+)([A-ZÀ-ÖØ-Þ])/g, '$1 [short pause]$2$3');
  // Pause after paragraph breaks
  t = t.replace(/\n\n+/g, ' [medium pause] ');
  return t;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

function safeTruncate(s, max) {
  if (typeof s !== 'string') return '';
  return s.length > max ? s.slice(0, max) + '…' : s;
}
