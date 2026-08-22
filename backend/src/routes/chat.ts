import { Router } from 'express';
import { supabase } from '../db/supabase.js';

const router = Router();

// Middleware to extract user from token
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

// Get conversations for workspace
router.get('/:workspaceId', requireAuth, async (req: any, res: any) => {
  const { workspaceId } = req.params;
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create conversation
router.post('/:workspaceId', requireAuth, async (req: any, res: any) => {
  const { workspaceId } = req.params;
  const { title } = req.body;

  const { data, error } = await supabase
    .from('conversations')
    .insert([{ workspace_id: workspaceId, title }])
    .select()
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get messages for a conversation
router.get('/:conversationId/messages', requireAuth, async (req: any, res: any) => {
  const { conversationId } = req.params;
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
