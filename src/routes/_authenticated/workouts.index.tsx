import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { formatDate, initials, listWorkouts } from "@/lib/workouts";

export const Route = createFileRoute("/_authenticated/workouts/")({
  head: () => ({
    meta: [
      { title: "My workouts — FitTrack" },
      { name: "description", content: "Browse every workout you have logged in FitTrack." },
      { property: "og:title", content: "My workouts — FitTrack" },
      { property: "og:description", content: "Browse every workout you have logged." },
    ],
  }),
  component: WorkoutsPage,
});

function WorkoutsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workouts"],
    queryFn: listWorkouts,
  });

  const workouts = data ?? [];

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
      <div className="fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Your workouts
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {workouts.length} session{workouts.length === 1 ? "" : "s"} logged
          </p>
        </div>
        <Link
          to="/workouts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-brand transition hover:brightness-110"
        >
          <Plus className="size-4" /> Add workout
        </Link>
      </div>

      {isLoading && (
        <div className="mt-8 flex items-center gap-2 rounded-2xl border border-line bg-panel p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading your workouts…
        </div>
      )}

      {isError && (
        <p className="mt-8 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
          Could not load your workouts. {(error as Error).message}
        </p>
      )}

      {!isLoading && !isError && workouts.length === 0 && (
        <div className="mt-8 rounded-2xl border border-line bg-panel p-8 text-center">
          <p className="font-display text-lg font-semibold text-foreground">No workouts yet</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Log your first session and it will show up here.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <Link
            key={workout.id}
            to="/workouts/$workoutId"
            params={{ workoutId: workout.id }}
            className="rounded-2xl border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-panel2"
          >
            <div className="flex items-center justify-between">
              <div className="grid size-10 place-items-center rounded-xl bg-brand/10 font-display text-xs font-bold text-brand ring-1 ring-brand/20">
                {initials(workout.title)}
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(workout.date)}</span>
            </div>
            <h2 className="mt-4 truncate font-display text-lg font-semibold text-foreground">
              {workout.title}
            </h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-accent2">
              {workout.duration} min
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
