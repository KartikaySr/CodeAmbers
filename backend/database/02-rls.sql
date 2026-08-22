-- 02-rls.sql

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Workspaces: Users can CRUD their own workspaces
CREATE POLICY "Users can view own workspaces" ON public.workspaces
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workspaces" ON public.workspaces
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workspaces" ON public.workspaces
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspaces" ON public.workspaces
  FOR DELETE USING (auth.uid() = user_id);

-- Files: Users can CRUD files in their workspaces
CREATE POLICY "Users can view files in own workspaces" ON public.files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files in own workspaces" ON public.files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update files in own workspaces" ON public.files
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files in own workspaces" ON public.files
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

-- Conversations: Users can CRUD conversations in their workspaces
CREATE POLICY "Users can view conversations in own workspaces" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert conversations in own workspaces" ON public.conversations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update conversations in own workspaces" ON public.conversations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete conversations in own workspaces" ON public.conversations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

-- Messages: Users can CRUD messages in their conversations
CREATE POLICY "Users can view messages in own conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.workspaces w ON w.id = c.workspace_id
      WHERE c.id = conversation_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.workspaces w ON w.id = c.workspace_id
      WHERE c.id = conversation_id AND w.user_id = auth.uid()
    )
  );
