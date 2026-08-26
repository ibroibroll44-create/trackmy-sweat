import { createFileRoute, Link } from "@tanstack/react-router";
import { Dumbbell, LineChart, ListChecks } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitTrack — Log and track your workouts" },
      {
        name: "description",
        content:
          "FitTrack is a simple workout tracker: log your sessions, keep your training history and follow your progress in one clean dashboard.",
      },
      { property: "og:title", content: "FitTrack — Log and track your workouts" },
      {
        property: "og:description",
        content: "Log your sessions, keep your training history and follow your progress.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-16">
        <div className="fade-up max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1 text-xs font-medium text-accent2 ring-1 ring-line">
            <span className="size-1.5 rounded-full bg-accent2" /> Personal training log
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-6xl">
            Every session counts. <span className="text-brand">Log it.</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            FitTrack keeps your training history in one place — titles, dates, durations and notes.
            No noise, just the work you put in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-brand transition hover:brightness-110"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand/40"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Dumbbell,
              title: "Log a workout",
              body: "Title, date, duration and description. Two taps and it's saved.",
            },
            {
              icon: ListChecks,
              title: "Your full history",
              body: "Every session in a clean list, newest first, always yours only.",
            },
            {
              icon: LineChart,
              title: "See the volume",
              body: "Total sessions and minutes logged, straight on your dashboard.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-line bg-panel p-5">
              <Icon className="size-5 text-brand" />
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
