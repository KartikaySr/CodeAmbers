import { Router } from 'express';
import { supabase } from '../db/supabase.js';

const router = Router();

// Middleware to extract user from token (assuming frontend sends Supabase JWT in Authorization header)
const requireAuth = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = user;
  next();
};

// Get all workspaces for user
router.get('/', requireAuth, async (req: any, res: any) => {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('user_id', req.user.id);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create workspace
router.post('/', requireAuth, async (req: any, res: any) => {
  const { name, description } = req.body;
  
  const { data, error } = await supabase
    .from('workspaces')
    .insert([{ user_id: req.user.id, name, description }])
    .select()
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
