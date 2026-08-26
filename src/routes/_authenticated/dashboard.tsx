import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { formatDate, initials, listWorkouts } from "@/lib/workouts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FitTrack" },
      { name: "description", content: "Your FitTrack dashboard: workout count and recent sessions." },
      { property: "og:title", content: "Dashboard — FitTrack" },
      { property: "og:description", content: "Your workout count and most recent sessions." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { name } = useSession();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workouts"],
    queryFn: listWorkouts,
  });

  const workouts = data ?? [];
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
  const avgDuration = workouts.length ? Math.round(totalMinutes / workouts.length) : 0;
  const recent = workouts.slice(0, 5);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
      <div className="fade-up flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1 text-xs font-medium text-accent2 ring-1 ring-line">
            <span className="size-1.5 rounded-full bg-accent2" /> Personal training log
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl">
            Welcome back, <span className="text-brand capitalize">{name}</span>.
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {workouts.length
              ? `You've logged ${workouts.length} session${workouts.length === 1 ? "" : "s"} and ${totalMinutes} minutes of work.`
              : "No sessions logged yet. Add your first workout to get started."}
          </p>
        </div>
        <Link
          to="/workouts/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-brand transition hover:brightness-110"
        >
          <Plus className="size-4" /> New Workout
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[
          { label: "Total workouts", value: workouts.length },
          { label: "Minutes logged", value: totalMinutes.toLocaleString() },
          { label: "Avg duration", value: `${avgDuration}m` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Recent workouts</h2>
          <Link to="/workouts" className="text-sm font-medium text-brand transition hover:text-accent2">
            View all
          </Link>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-panel p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading your workouts…
          </div>
        )}

        {isError && (
          <p className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
            Could not load your workouts. {(error as Error).message}
          </p>
        )}

        {!isLoading && !isError && recent.length === 0 && (
          <div className="rounded-2xl border border-line bg-panel p-6 text-sm text-muted-foreground">
            Nothing here yet — your logged sessions will appear in this list.
          </div>
        )}

        <div className="space-y-3">
          {recent.map((workout) => (
            <Link
              key={workout.id}
              to="/workouts/$workoutId"
              params={{ workoutId: workout.id }}
              className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-4 transition hover:border-brand/40 hover:bg-panel2"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 font-display text-sm font-bold text-brand ring-1 ring-brand/20">
                {initials(workout.title)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">{workout.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(workout.date)} · {workout.duration} min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
