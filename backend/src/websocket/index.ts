import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { processAgentMessage } from '../services/agents.js';
import { supabase } from '../db/supabase.js';
import type { AgentRole } from '../types.js';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req: any) => {
    // You can parse URL or headers for auth if needed
    console.log('WebSocket connected');

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message) as { type: string, payload: { conversationId: string, text: string, agentRole: AgentRole } };
        
        if (data.type === 'CHAT_MESSAGE') {
          const { conversationId, text, agentRole } = data.payload;
          
          // Fetch conversation history
          const { data: history } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('timestamp', { ascending: true });

          // Send message to agent
          await processAgentMessage(
            agentRole || 'architect',
            [...(history || []), { kind: 'user', body: text, author: 'user', id: 'temp', timestamp: new Date().toISOString() }],
            (chunk: string) => {
              ws.send(JSON.stringify({
                type: 'AGENT_CHUNK',
                payload: { chunk }
              }));
            }
          );
          
          ws.send(JSON.stringify({ type: 'AGENT_DONE' }));
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
