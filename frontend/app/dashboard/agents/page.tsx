"use client";

import { motion } from "framer-motion";
import { Bot, Activity, BrainCircuit, Terminal, Server } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { ExplanatoryPopover } from "@/components/ui/ExplanatoryPopover";

const agents = [
  { id: "architect", name: "Architect Agent", status: "idle", uptime: "99.9%", tasks: 142, load: "12%", specialty: "System Design", color: "#f59e0b" },
  { id: "backend", name: "Backend Agent", status: "active", uptime: "99.9%", tasks: 893, load: "78%", specialty: "API & Data", color: "#22d3ee" },
  { id: "frontend", name: "Frontend Agent", status: "active", uptime: "99.9%", tasks: 561, load: "45%", specialty: "UI/UX", color: "#a78bfa" },
  { id: "security", name: "Security Agent", status: "idle", uptime: "100%", tasks: 204, load: "5%", specialty: "Policy Enforcement", color: "#34d399" },
  { id: "devops", name: "DevOps Agent", status: "maintenance", uptime: "98.5%", tasks: 112, load: "0%", specialty: "CI/CD Pipeline", color: "#fb7185" },
];

export default function AgentsDashboard() {
  return (
    <div className="p-8 md:p-12">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Agent Fleet Management</h1>
            <p className="mt-2 text-zinc-400">Monitor and configure your autonomous engineering team.</p>
          </div>
          <Button className="flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10">
            <Server className="size-4" /> Provision New Agent
          </Button>
        </motion.div>

        {/* Global Agent Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Panel className="p-5 flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Bot className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Active Agents</p>
              <p className="text-2xl font-semibold text-white">4 <span className="text-sm text-zinc-500 font-normal">/ 5 Total</span></p>
            </div>
          </Panel>
          <Panel className="p-5 flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-full bg-amber-core/10 text-amber-core">
              <Activity className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Fleet Utilization</p>
              <p className="text-2xl font-semibold text-white">28% <span className="text-sm text-zinc-500 font-normal">avg load</span></p>
            </div>
          </Panel>
          <Panel className="p-5 flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-full bg-purple-500/10 text-purple-400">
              <BrainCircuit className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Tasks Resolved</p>
              <p className="text-2xl font-semibold text-white">1,912</p>
            </div>
          </Panel>
        </div>

        {/* Agent Table (PowerBI / Supabase style data grid) */}
        <Panel className="overflow-hidden">
          <div className="border-b border-white/5 bg-black/40 px-6 py-4">
            <h3 className="font-medium text-white">Fleet Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-white/[0.02] text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Agent</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Specialty</th>
                  <th className="px-6 py-4 font-medium">Current Load</th>
                  <th className="px-6 py-4 font-medium">Tasks Completed</th>
                  <th className="px-6 py-4 font-medium">Uptime</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agents.map((agent, i) => (
                  <motion.tr 
                    key={agent.id} 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-8 place-items-center rounded-md bg-black/50 border border-white/10">
                          <Bot className="size-4" style={{ color: agent.color }} />
                        </div>
                        <ExplanatoryPopover 
                          title={agent.name} 
                          description={`This agent specializes in ${agent.specialty} and is currently ${agent.status}. It has processed ${agent.tasks} tasks.`}
                          metadata={{ "Uptime": agent.uptime, "Current Load": agent.load }}
                        >
                          <span className="font-medium text-white underline decoration-dashed decoration-white/30 underline-offset-4 cursor-help">{agent.name}</span>
                        </ExplanatoryPopover>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${
                          agent.status === 'active' ? 'bg-emerald-400' :
                          agent.status === 'idle' ? 'bg-amber-core' : 'bg-red-400'
                        }`} />
                        <span className="capitalize">{agent.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{agent.specialty}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-amber-core" style={{ width: agent.load }} />
                        </div>
                        <span className="text-xs">{agent.load}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-400">{agent.tasks}</td>
                    <td className="px-6 py-4 font-mono text-zinc-400">{agent.uptime}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-white transition-colors">
                        <Terminal className="size-4 inline-block" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
