-- 03-indexes.sql

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Workspaces
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON public.workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_created_at ON public.workspaces(created_at DESC);

-- Files
CREATE INDEX IF NOT EXISTS idx_files_workspace_id ON public.files(workspace_id);
CREATE INDEX IF NOT EXISTS idx_files_path ON public.files(path);

-- Conversations
CREATE INDEX IF NOT EXISTS idx_conversations_workspace_id ON public.conversations(workspace_id);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.messages(timestamp ASC);
