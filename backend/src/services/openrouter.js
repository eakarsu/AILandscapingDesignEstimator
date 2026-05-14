const https = require('https');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

/**
 * Parse AI response text into structured JSON.
 * Strips markdown fences, then attempts JSON.parse.
 * Returns null if the content is not valid JSON.
 */
function parseStructuredResponse(text) {
  if (!text) return null;
  // Strip markdown code fences if present
  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  try {
    return JSON.parse(stripped);
  } catch (_) {
    return null;
  }
}

/**
 * Call OpenRouter. Returns { success, data, structured, error, fallback }.
 * - data: raw text from the model
 * - structured: parsed JSON (or null if text is not JSON)
 * - fallback: true when no API key is configured
 */
async function queryOpenRouter(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-5-sonnet-20241022';

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    return {
      success: false,
      fallback: true,
      error: 'OpenRouter API key not configured. Set OPENROUTER_API_KEY in your .env file.',
      data: null,
      structured: null,
    };
  }

  const payload = JSON.stringify({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 4000,
    temperature: 0.7,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Landscaping Design & Estimator',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            resolve({
              success: false,
              fallback: false,
              error: parsed.error.message || 'OpenRouter API error',
              data: null,
              structured: null,
            });
          } else {
            const content = parsed.choices?.[0]?.message?.content || '';
            resolve({
              success: true,
              fallback: false,
              error: null,
              data: content,
              structured: parseStructuredResponse(content),
            });
          }
        } catch (e) {
          resolve({
            success: false,
            fallback: false,
            error: 'Failed to parse AI response',
            data: null,
            structured: null,
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({
        success: false,
        fallback: false,
        error: e.message || 'Network error calling OpenRouter',
        data: null,
        structured: null,
      });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Robust JSON parser for AI responses. Handles markdown fences and partial wrapping.
 */
function parseAIJson(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch(e) {}
  const stripped = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
  try { return JSON.parse(stripped); } catch(e) {}
  const start = text.indexOf('{'); const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) { try { return JSON.parse(text.slice(start, end + 1)); } catch(e) {} }
  return null;
}

module.exports = { queryOpenRouter, parseStructuredResponse, parseAIJson };
