import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { processAgentMessage, processAgentSingleMessage } from '../services/agents.js';
import { supabase } from '../db/supabase.js';
import type { AgentRole } from '../types.js';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req: any) => {
    console.log('WebSocket connected');

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message) as { 
          type: string, 
          prompt?: string, 
          workspaceId?: string, 
          mode?: AgentRole,
          prefix?: string,
          suffix?: string,
          fileContent?: string,
          errorOutput?: string
        };
        
        if (data.type === 'AI_PROMPT' && data.prompt && data.workspaceId) {
          const { workspaceId, prompt, mode } = data;
          
          const validRoles = ['architect', 'frontend', 'backend', 'security', 'devops'];
          let agentRole: AgentRole = 'architect';
          if (mode && validRoles.includes(mode)) {
            agentRole = mode as AgentRole;
          } else if (mode === 'code') {
            agentRole = 'frontend';
          }
          
          let history: any[] = [];
          try {
            const { data: conv } = await supabase
              .from('conversations')
              .select('id')
              .eq('workspace_id', workspaceId)
              .limit(1)
              .single();
              
            if (conv) {
              const { data: msgs } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conv.id)
                .order('timestamp', { ascending: true });
              if (msgs) history = msgs;
            }
          } catch (e) {
            console.warn('Could not fetch history, proceeding without it.');
          }

          await processAgentMessage(
            agentRole,
            [...(history || []), { kind: 'user', body: prompt, author: 'user', id: 'temp', timestamp: new Date().toISOString() }],
            (chunk: string) => {
              ws.send(JSON.stringify({ type: 'CHAT_CHUNK', content: chunk }));
            }
          );
          
          ws.send(JSON.stringify({ type: 'STREAM_END', status: 'completed', streamId: 'stream-1' }));
        }

        if (data.type === 'AI_AUTOCOMPLETE' && data.prefix) {
          const prompt = `Complete the following code. ONLY return the code that should be inserted between the prefix and suffix, nothing else. No markdown backticks.\n\nPREFIX:\n${data.prefix}\n\nSUFFIX:\n${data.suffix}`;
          const completion = await processAgentSingleMessage('frontend', prompt, 'You are an elite autocomplete AI. You only output pure code to insert.');
          ws.send(JSON.stringify({ type: 'AUTOCOMPLETE_RESULT', content: completion.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim() }));
        }

        if (data.type === 'AI_EXPLAIN_ERROR' && data.errorOutput) {
          const prompt = `Explain the following terminal error and suggest a fix:\n\n${data.errorOutput}`;
          const explanation = await processAgentSingleMessage('devops', prompt);
          ws.send(JSON.stringify({ type: 'EXPLAIN_ERROR_RESULT', content: explanation }));
        }

        if (data.type === 'AI_CODE_REVIEW' && data.fileContent) {
          const prompt = `Review the following code for security vulnerabilities, bugs, and best practices. Format your response clearly with line numbers if possible:\n\n${data.fileContent}`;
          const review = await processAgentSingleMessage('security', prompt);
          ws.send(JSON.stringify({ type: 'CODE_REVIEW_RESULT', content: review }));
        }

      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket disconnected');
    });
  });
}
