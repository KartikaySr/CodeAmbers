import { groqClients } from './groq.js';
import type { AgentRole, ChatMessage } from '../types.js';

export const agentPrompts: Record<AgentRole, string> = {
  architect: "You are an Architect agent. Your job is to design the system, analyze requirements, and delegate tasks to frontend and backend.",
  frontend: "You are a Frontend developer agent. You build UI components, wire them up to API, and ensure good UX.",
  backend: "You are a Backend developer agent. You write server logic, database schemas, and APIs.",
  security: "You are a Security Reviewer agent. You review code for vulnerabilities and best practices.",
  devops: "You are a DevOps / Communicator agent. You help coordinate deployments, dockerize applications, and summarize statuses.",
};

export async function processAgentMessage(
  role: AgentRole,
  history: ChatMessage[],
  onChunk: (chunk: string) => void
) {
  const client = groqClients[role];
  
  const messages = history.map(msg => ({
    role: msg.kind === 'user' ? 'user' : 'assistant',
    content: msg.body
  })) as any[];

  messages.unshift({
    role: 'system',
    content: agentPrompts[role]
  });

  try {
    const stream = await client.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      stream: true,
      temperature: 0.2,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error(`Error processing message for ${role}:`, error);
    onChunk('\n[Error: Unable to process request]');
  }
}

export async function processAgentSingleMessage(
  role: AgentRole,
  prompt: string,
  systemOverride?: string
): Promise<string> {
  const client = groqClients[role];
  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: 'system', content: systemOverride || agentPrompts[role] },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      stream: false,
      temperature: 0.1,
    });
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error(`Error processing single message for ${role}:`, error);
    return '';
  }
}
