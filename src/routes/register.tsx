import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your FitTrack account" },
      {
        name: "description",
        content: "Register for FitTrack and start logging your workouts in seconds.",
      },
      { property: "og:title", content: "Create your FitTrack account" },
      {
        property: "og:description",
        content: "Register for FitTrack and start logging your workouts in seconds.",
      },
    ],
  }),
  component: RegisterPage,
});

const inputClass =
  "mt-1.5 w-full rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/50";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }

    setCheckEmail(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-5 py-16">
        <div className="fade-up rounded-2xl border border-line bg-panel p-6 sm:p-8">
          {checkEmail ? (
            <div className="text-center">
              <MailCheck className="mx-auto size-8 text-brand" />
              <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
                Confirm your email
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We sent a confirmation link to <span className="text-foreground">{email}</span>.
                Click it to activate your account, then sign in.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:brightness-110"
              >
                Go to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground">Create account</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Start logging your sessions today.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    maxLength={255}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    maxLength={72}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="confirm" className="text-xs font-medium text-muted-foreground">
                    Confirm password
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    maxLength={72}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    className={inputClass}
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
                  {loading ? "Creating account…" : "Register"}
                </button>
              </form>

              <p className="mt-6 text-sm text-muted-foreground">
                Already registered?{" "}
                <Link to="/login" className="font-medium text-brand hover:text-accent2">
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
