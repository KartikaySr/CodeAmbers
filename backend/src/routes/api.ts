import { Router } from 'express';

const router = Router();

// Placeholder for Agent routes (Planner, Coder, etc.)
router.post('/agent/planner', (req, res) => {
  // Logic to call Groq with GROQ_API_KEY_PLANNER
  res.json({ message: 'Planner agent response' });
});

router.post('/agent/coder', (req, res) => {
  res.json({ message: 'Coder agent response' });
});

router.post('/agent/reviewer', (req, res) => {
  res.json({ message: 'Reviewer agent response' });
});

export default router;
