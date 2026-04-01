const express = require('express');
const router  = express.Router();

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, check } = req.body;
    const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';

    // Health check ping
    if (check) {
      const ping = await fetch(`${ollamaHost}/api/tags`).catch(() => null);
      if (!ping || !ping.ok) return res.status(503).json({ success: false, error: 'Ollama offline' });
      return res.json({ success: true, message: 'Ollama connected' });
    }

    const response = await fetch(`${ollamaHost}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: `You are a knowledgeable and friendly guide for Monastery360, a platform about Buddhist monasteries in Sikkim, India. 
Answer questions about the monasteries (Rumtek, Enchey, Pemayangtse, Tashiding, Phodong, Dubdi), their festivals, history, culture, travel tips, and Buddhist practices.
Keep answers concise, warm, and informative. If asked something unrelated to monasteries or Sikkim, gently redirect.

User question: ${message}`,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Ollama request failed');
    const data = await response.json();
    res.json({ success: true, response: data.response });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Chat service unavailable. Make sure Ollama is running.' });
  }
});

module.exports = router;
