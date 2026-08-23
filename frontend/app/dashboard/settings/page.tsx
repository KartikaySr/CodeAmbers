"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, HardDrive, Trash2, Save, Cpu } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
  const [profile, setProfile] = useState<{ full_name: string; email: string; id: string } | null>(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || "",
        });
        setNewName(user.user_metadata?.full_name || "");
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  async function handleSaveProfile() {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: newName }
    });
    
    // Also update the public.profiles table
    if (profile) {
      await supabase.from("profiles").update({ full_name: newName }).eq("id", profile.id);
    }

    if (!error) {
      alert("Profile updated successfully!");
    } else {
      alert("Error updating profile.");
    }
    setSaving(false);
  }

  if (loading) return <div className="p-8 text-zinc-500">Loading settings...</div>;

  return (
    <div className="p-8 pb-32">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-white tracking-tight">Personal Dashboard</h1>
        <p className="mt-2 text-zinc-400">Manage your profile, security, and workspace preferences.</p>
      </div>

      <div className="grid max-w-4xl gap-8">
        {/* Profile Section */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-amber-core font-mono text-xs uppercase tracking-widest">
            <User className="size-4" /> Profile Details
          </div>
          <Panel className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-zinc-300">
                Full Name
                <input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="h-10 rounded-lg border border-white/10 bg-black/35 px-3 text-white outline-none transition focus:border-amber-core/60 focus:ring-1 focus:ring-amber-core" 
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-500">
                Email Address (Read-only)
                <input 
                  value={profile?.email} 
                  disabled 
                  className="h-10 rounded-lg border border-white/5 bg-white/5 px-3 text-zinc-500 cursor-not-allowed" 
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                <Save className="size-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Panel>
        </section>

        {/* AI Preferences */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-amber-core font-mono text-xs uppercase tracking-widest">
            <Cpu className="size-4" /> AI Configuration
          </div>
          <Panel className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-zinc-300">
                Default LLM Model
                <select className="h-10 rounded-lg border border-white/10 bg-black/35 px-3 text-white outline-none transition focus:border-amber-core/60 focus:ring-1 focus:ring-amber-core">
                  <option value="llama-3.1-70b-versatile">Llama 3.1 70B (Groq)</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7b (Groq)</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-zinc-300">
                AI Temperature
                <div className="flex items-center gap-4 h-10">
                  <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="flex-1 accent-amber-core" />
                  <span className="text-zinc-400 font-mono">0.7</span>
                </div>
              </label>
            </div>
          </Panel>
        </section>

        {/* Danger Zone */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest">
            <Shield className="size-4" /> Danger Zone
          </div>
          <Panel className="border-red-500/20 bg-red-500/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Delete Account</h3>
                <p className="mt-1 text-sm text-zinc-400">Permanently remove your account and all associated workspaces.</p>
              </div>
              <Button className="bg-red-500 hover:bg-red-600 text-white border-none gap-2">
                <Trash2 className="size-4" /> Delete Account
              </Button>
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}
