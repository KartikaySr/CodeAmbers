"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PageShell } from "@/components/effects/PageShell";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/components/ui/Brand";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check if the user has an active session from the reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/sign-in");
      }
    });
  }, [router, supabase]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert("Password updated successfully!");
      router.push("/dashboard");
    }
  }

  return (
    <PageShell>
      <div className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8"><Brand /></div>
          <Panel className="p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-white">Update Password</h2>
            <p className="mt-2 text-sm text-zinc-400">Enter your new secure password.</p>
            
            <form onSubmit={handleUpdate} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm text-zinc-300">
                New Password
                <input 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  type="password" 
                  className="h-11 rounded-lg border border-white/10 bg-black/35 px-3 text-white outline-none transition focus:border-amber-core/60 focus:ring-2 focus:ring-amber-core/20" 
                  placeholder="New Password" 
                  required 
                  minLength={8} 
                />
              </label>
              {error && <p className="rounded-lg border border-amber-core/20 bg-amber-core/10 px-3 py-2 text-sm text-amber-100">{error}</p>}
              <Button type="submit" disabled={loading} className="mt-2 w-full">
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
