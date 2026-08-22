import Groq from 'groq-sdk';
import type { AgentRole } from '../types.js'; // I will define this

export const groqClients: Record<AgentRole, Groq> = {
  architect: new Groq({ apiKey: process.env.GROQ_API_KEY_PLANNER || process.env.GROQ_API_KEY || 'dummy_key' }),
  frontend: new Groq({ apiKey: process.env.GROQ_API_KEY_FRONTEND || process.env.GROQ_API_KEY || 'dummy_key' }),
  backend: new Groq({ apiKey: process.env.GROQ_API_KEY_BACKEND || process.env.GROQ_API_KEY || 'dummy_key' }),
  security: new Groq({ apiKey: process.env.GROQ_API_KEY_REVIEWER || process.env.GROQ_API_KEY || 'dummy_key' }),
  devops: new Groq({ apiKey: process.env.GROQ_API_KEY_COMMUNICATOR || process.env.GROQ_API_KEY || 'dummy_key' }),
};
