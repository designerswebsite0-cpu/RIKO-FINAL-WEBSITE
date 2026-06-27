"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Unable to reach the admin gateway. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      {error && (
        <div className="border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <label className="block">
        <span className="block text-[10px] uppercase tracking-[0.45em] text-sand/55">
          Administrator password
        </span>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 w-full border-0 border-b border-border bg-transparent px-0 py-4 text-lg text-sand outline-none transition-colors placeholder:text-sand/25 focus:border-accent"
          placeholder="••••••••••••"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="group inline-flex w-full items-center justify-center gap-3 bg-primary px-8 py-5 text-[11px] uppercase tracking-[0.4em] text-primary-foreground transition-all duration-700 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Enter dashboard"}
        <span className="h-px w-6 bg-current transition-all duration-500 group-hover:w-12" />
      </button>
    </form>
  );
}
