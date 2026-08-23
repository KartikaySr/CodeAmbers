import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  const { language, version, code } = req.body;

  if (!language || !version || !code) {
    return res.status(400).json({ error: 'Language, version, and code are required' });
  }

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        version,
        files: [{ content: code }]
      })
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Execution error:', error);
    return res.status(500).json({ error: 'Failed to execute code' });
  }
});

export default router;
