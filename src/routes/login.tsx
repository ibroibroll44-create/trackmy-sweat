import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — FitTrack" },
      { name: "description", content: "Sign in to FitTrack to view and log your workouts." },
      { property: "og:title", content: "Login — FitTrack" },
      { property: "og:description", content: "Sign in to FitTrack to view and log your workouts." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim()) return setError("Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError("Enter a valid email address.");
    if (!password) return setError("Password is required.");

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : signInError.message,
      );
      return;
    }

    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-5 py-16">
        <div className="fade-up rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Sign in to continue your training log.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                maxLength={255}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                maxLength={72}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:brightness-110 disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            No account yet?{" "}
            <Link to="/register" className="font-medium text-brand hover:text-accent2">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
