const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const PhotoGallery = require('../models/PhotoGallery');
const { queryOpenRouter, parseAIJson } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await PhotoGallery.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id, {
      attributes: ['id', 'title', 'status', 'aiAnalysis', 'aiAnalysisJson', 'updatedAt'],
    });
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    if (!photo.aiAnalysisJson && !photo.aiAnalysis) {
      return res.status(404).json({ error: 'No AI analysis available. Run POST /:id/analyze first.' });
    }
    res.json({
      photoId: photo.id,
      title: photo.title,
      status: photo.status,
      structured: photo.aiAnalysisJson || null,
      rawText: photo.aiAnalysis || null,
      generatedAt: photo.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.create(req.body);
    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    await photo.update(req.body);
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    await photo.destroy();
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/analyze', auth, aiRateLimiter, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    const systemPrompt = 'You are an expert landscape photo analyst. Respond with valid JSON containing: designAssessment (object with score 0-100 and summary), plantHealth (object with observations array and overallScore), aestheticEvaluation (object with scores for unity, balance, proportion), improvementRecommendations (array of {suggestion, priority, estimatedCost}), seasonalMaintenanceSuggestions (array), designEnhancements (array), and overallRating (string). No markdown fences.';
    const userPrompt = `Analyze the following landscape photo entry:
- Title: ${photo.title}
- Description: ${photo.description}
- Category: ${photo.category}
- Location: ${photo.location}
- Before/After: ${photo.beforeAfter}
- Tags: ${photo.tags}`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);

    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({
        error: result.error,
        fallback: result.fallback || false,
      });
    }

    const updateData = { aiAnalysis: result.data };
    if (result.structured) updateData.aiAnalysisJson = result.structured;
    await photo.update(updateData);
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /:id/ai-vision — vision pipeline using base64 image
router.post('/:id/ai-vision', auth, aiRateLimiter, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      return res.status(503).json({ error: 'OpenRouter API key not configured.' });
    }

    // Attempt to read actual file; fall back to placeholder analysis if no file
    let imageBase64 = null;
    const imagePath = photo.imagePath || photo.photoUrl;
    if (imagePath) {
      const absPath = path.isAbsolute(imagePath) ? imagePath : path.resolve(__dirname, '../../../', imagePath);
      if (fs.existsSync(absPath)) {
        imageBase64 = fs.readFileSync(absPath).toString('base64');
      }
    }

    const textPrompt = 'Analyze this landscape photo. Return JSON: { landscape_elements: [{type, description, condition}], turf_type, tree_count, hardscape_features, estimated_square_footage, suggested_improvements }';

    let messages;
    if (imageBase64) {
      messages = [
        { role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          { type: 'text', text: textPrompt }
        ]}
      ];
    } else {
      // No actual image — use metadata-based analysis as fallback
      messages = [
        { role: 'system', content: 'You are an expert landscape analyst. Return valid JSON only.' },
        { role: 'user', content: `${textPrompt}\n\nPhoto metadata (no image file available):\nTitle: ${photo.title}\nDescription: ${photo.description || 'N/A'}\nCategory: ${photo.category || 'N/A'}\nLocation: ${photo.location || 'N/A'}\nTags: ${photo.tags || 'N/A'}` }
      ];
    }

    const payload = JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3-5-sonnet-20241022',
      messages,
      max_tokens: 4000,
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'AI Landscaping Design & Estimator',
        },
      };
      const req2 = https.request(options, (r) => {
        let data = '';
        r.on('data', chunk => { data += chunk; });
        r.on('end', () => {
          try { resolve(JSON.parse(data)); } catch(e) { reject(new Error('Failed to parse response')); }
        });
      });
      req2.on('error', reject);
      req2.write(payload);
      req2.end();
    });

    if (result.error) {
      return res.status(502).json({ error: result.error.message || 'OpenRouter API error' });
    }

    const content = result.choices?.[0]?.message?.content || '';
    const structured = parseAIJson(content);

    await photo.update({ aiAnalysis: content, ...(structured ? { aiAnalysisJson: structured } : {}) });
    res.json({ photoId: photo.id, raw: content, structured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
