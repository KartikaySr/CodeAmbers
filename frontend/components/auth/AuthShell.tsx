"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/effects/PageShell";
import { Panel } from "@/components/ui/Panel";
import { useWorkspaceStore } from "@/store/workspace-store";
import { createClient } from "@/utils/supabase/client";

export function AuthShell({ mode }: { mode: "sign-in" | "sign-up" | "forgot-password" }) {
  const isSignUp = mode === "sign-up";
  const isForgot = mode === "forgot-password";
  const router = useRouter();
  const login = useWorkspaceStore((state) => state.login);
  const signup = useWorkspaceStore((state) => state.signup);
  const authLoading = useWorkspaceStore((state) => state.authLoading);
  const storeError = useWorkspaceStore((state) => state.error);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = createClient();

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name || "CodeAmbers Operator" } }
      });
      if (!error) router.push("/dashboard");
    } else if (isForgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/update-password`,
      });
      if (!error) alert("Password reset email sent. Check your inbox.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) router.push("/dashboard");
    }
  }

  const handleOAuth = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <PageShell>
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden border-r border-white/5 p-8 lg:flex lg:flex-col">
          <Brand />
          <div className="flex flex-1 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-core">Secure workspace auth</p>
              <h1 className="mt-5 max-w-2xl text-6xl font-semibold tracking-tight text-white">Access the AI engineering operating system.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">Sign in with Supabase JWT sessions backed by encrypted password storage and persistent workspaces.</p>
              <div className="mt-10 grid max-w-xl gap-3">
                {["Supabase Identity", "Team agent permissions", "Secure session handoff"].map((item) => (
                  <div key={item} className="glass flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-300">
                    <Sparkles className="size-4 text-amber-core" /> {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        <section className="flex min-h-screen items-center justify-center px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="mb-8 lg:hidden"><Brand /></div>
            <Panel className="p-6 md:p-8">
              <h2 className="text-3xl font-semibold text-white">{isForgot ? "Reset Password" : isSignUp ? "Create workspace" : "Welcome back"}</h2>
              <p className="mt-2 text-sm text-zinc-400">{isForgot ? "Enter your email to receive a password reset link." : isSignUp ? "Start a new autonomous engineering command center." : "Continue your AI-native engineering session."}</p>
              
              {!isForgot && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button onClick={() => handleOAuth('github')} className="bg-[#24292e] text-white hover:bg-[#2f363d] border-none"><span className="text-sm">GitHub</span></Button>
                  <Button onClick={() => handleOAuth('google')} className="bg-white text-black hover:bg-zinc-200 border-none"><span className="text-sm">Google</span></Button>
                </div>
              )}
              
              <div className="relative mt-6 flex items-center py-2">
                <div className="grow border-t border-white/10"></div>
                <span className="shrink-0 px-4 text-xs text-zinc-500 uppercase">or continue with email</span>
                <div className="grow border-t border-white/10"></div>
              </div>

              <form onSubmit={handleEmailAuth} className="mt-4 grid gap-4">
                {isSignUp && (
                  <label className="grid gap-2 text-sm text-zinc-300">
                    Name
                    <input value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-lg border border-white/10 bg-black/35 px-3 text-white outline-none transition focus:border-amber-core/60 focus:ring-2 focus:ring-amber-core/20" placeholder="Kartikay" />
                  </label>
                )}
                <label className="grid gap-2 text-sm text-zinc-300">
                  Email
                  <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="h-11 rounded-lg border border-white/10 bg-black/35 px-3 text-white outline-none transition focus:border-amber-core/60 focus:ring-2 focus:ring-amber-core/20" placeholder="founder@company.com" required />
                </label>
                {!isForgot && (
                  <label className="grid gap-2 text-sm text-zinc-300">
                    <div className="flex justify-between">
                      <span>Password</span>
                      {!isSignUp && <Link href="/forgot-password" className="text-xs text-amber-core hover:text-amber-300 transition">Forgot password?</Link>}
                    </div>
                    <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="h-11 rounded-lg border border-white/10 bg-black/35 px-3 text-white outline-none transition focus:border-amber-core/60 focus:ring-2 focus:ring-amber-core/20" placeholder="Password" required minLength={8} />
                  </label>
                )}
                {storeError && <p className="rounded-lg border border-amber-core/20 bg-amber-core/10 px-3 py-2 text-sm text-amber-100">{storeError}</p>}
                <Button type="submit" disabled={authLoading} className="mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60">{authLoading ? "Authorizing..." : isForgot ? "Send reset link" : isSignUp ? "Create CodeAmbers workspace" : "Enter workspace"}</Button>
                
                {/* Guest Bypass */}
                <Button 
                  type="button" 
                  onClick={() => {
                    document.cookie = "dev_bypass=true; path=/";
                    router.push("/dashboard");
                  }} 
                  className="mt-4 w-full border border-amber-core/30 bg-amber-core/10 text-amber-core hover:bg-amber-core/20 font-medium"
                >
                  <Sparkles className="mr-2 size-4" /> Guest Login (Testing)
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-zinc-500">
                {isForgot ? "Remember your password?" : isSignUp ? "Already have access?" : "Need an account?"}{" "}
                <Link className="text-amber-core hover:text-amber-300" href={isForgot || isSignUp ? "/sign-in" : "/sign-up"}>{isForgot || isSignUp ? "Sign in" : "Sign up"}</Link>
              </p>
            </Panel>
          </motion.div>
        </section>
      </div>
    </PageShell>
  );
}
