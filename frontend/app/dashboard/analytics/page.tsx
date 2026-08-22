"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Panel } from "@/components/ui/Panel";
import { Activity, Cpu, Code2, Users, Network } from "lucide-react";

const tokenData = [
  { time: "00:00", tokens: 1200 },
  { time: "04:00", tokens: 3000 },
  { time: "08:00", tokens: 8500 },
  { time: "12:00", tokens: 14000 },
  { time: "16:00", tokens: 11200 },
  { time: "20:00", tokens: 5000 },
  { time: "24:00", tokens: 2100 },
];

const agentUsageData = [
  { name: "Frontend", value: 45, color: "#a78bfa" },
  { name: "Backend", value: 30, color: "#22d3ee" },
  { name: "Security", value: 10, color: "#34d399" },
  { name: "DevOps", value: 5, color: "#fb7185" },
  { name: "Architect", value: 10, color: "#f59e0b" },
];

const latencyData = [
  { endpoint: "/api/chat", ms: 450 },
  { endpoint: "/api/compile", ms: 1200 },
  { endpoint: "/ws/sync", ms: 45 },
  { endpoint: "/api/auth", ms: 210 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 md:p-12">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-semibold text-white">System Analytics</h1>
          <p className="mt-2 text-zinc-400">Deep telemetry across your AI-native infrastructure.</p>
        </motion.div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Active Sessions", value: "24", icon: Users, change: "+12%" },
            { label: "Token Velocity", value: "14.2k/hr", icon: Activity, change: "+5.2%" },
            { label: "Lines Generated", value: "128,042", icon: Code2, change: "+28%" },
            { label: "Global Edge Latency", value: "45ms", icon: Network, change: "-2ms" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Panel className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                  </div>
                  <div className="grid size-10 place-items-center rounded-lg bg-white/[0.03] text-zinc-400">
                    <stat.icon className="size-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-amber-core'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-zinc-500">vs last 24h</span>
                </div>
              </Panel>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
            <Panel className="p-6 h-[400px] flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Token Velocity (24h)</h3>
                  <p className="text-sm text-zinc-500">LLM token generation rate across all workspaces</p>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tokenData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                      itemStyle={{ color: '#f59e0b' }}
                    />
                    <Area type="monotone" dataKey="tokens" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorTokens)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Panel className="p-6 h-[400px] flex flex-col">
              <div className="mb-2">
                <h3 className="font-medium text-white">Agent Load Distribution</h3>
                <p className="text-sm text-zinc-500">Workload by agent specialization</p>
              </div>
              <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={agentUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {agentUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                  <Cpu className="size-6 text-zinc-400 mb-1" />
                  <span className="text-xs font-semibold text-white">100%</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {agentUsageData.map((agent) => (
                  <div key={agent.name} className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: agent.color }} />
                    <span className="text-xs text-zinc-400">{agent.name}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
