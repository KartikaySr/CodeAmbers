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

// Get files for a workspace
router.get('/:workspaceId', requireAuth, async (req: any, res: any) => {
  const { workspaceId } = req.params;
  
  // Basic check if workspace belongs to user
  const { data: wsData } = await supabase
    .from('workspaces')
    .select('id')
    .eq('id', workspaceId)
    .eq('user_id', req.user.id)
    .single();
    
  if (!wsData) return res.status(403).json({ error: 'Not authorized' });

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('workspace_id', workspaceId);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Update or create file
router.post('/:workspaceId', requireAuth, async (req: any, res: any) => {
  const { workspaceId } = req.params;
  const { path, name, language, content } = req.body;
  
  // Check authorization
  const { data: wsData } = await supabase
    .from('workspaces')
    .select('id')
    .eq('id', workspaceId)
    .eq('user_id', req.user.id)
    .single();
    
  if (!wsData) return res.status(403).json({ error: 'Not authorized' });

  const { data, error } = await supabase
    .from('files')
    .upsert({ 
      workspace_id: workspaceId, 
      path, 
      name, 
      language, 
      content 
    }, { onConflict: 'workspace_id, path' })
    .select()
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
