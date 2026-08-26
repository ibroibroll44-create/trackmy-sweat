import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Clock, Loader2, Trash2 } from "lucide-react";
import { deleteWorkout, formatDate, getWorkout } from "@/lib/workouts";

export const Route = createFileRoute("/_authenticated/workouts/$workoutId")({
  head: () => ({
    meta: [
      { title: "Workout details — FitTrack" },
      { name: "description", content: "Full details for one of your logged workout sessions." },
      { property: "og:title", content: "Workout details — FitTrack" },
      { property: "og:description", content: "Full details for one of your logged sessions." },
    ],
  }),
  component: WorkoutDetailsPage,
});

function WorkoutDetailsPage() {
  const { workoutId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError, error: queryError } = useQuery({
    queryKey: ["workouts", workoutId],
    queryFn: () => getWorkout(workoutId),
  });

  const remove = useMutation({
    mutationFn: () => deleteWorkout(workoutId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workouts"] });
      navigate({ to: "/workouts", replace: true });
    },
    onError: (err: Error) => setError(err.message),
  });

  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-10">
      <Link
        to="/workouts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to workouts
      </Link>

      {isLoading && (
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-line bg-panel p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading workout…
        </div>
      )}

      {isError && (
        <p className="mt-5 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
          Could not load this workout. {(queryError as Error).message}
        </p>
      )}

      {!isLoading && !isError && !data && (
        <div className="mt-5 rounded-2xl border border-line bg-panel p-8 text-center">
          <p className="font-display text-lg font-semibold text-foreground">Workout not found</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            It may have been deleted, or it doesn't belong to your account.
          </p>
        </div>
      )}

      {data && (
        <article className="fade-up mt-5 rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">Session</span>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-foreground">
            {data.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-panel2 px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-line">
              <CalendarDays className="size-3.5 text-brand" /> {formatDate(data.date)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-panel2 px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-line">
              <Clock className="size-3.5 text-accent2" /> {data.duration} min
            </span>
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {data.description?.trim() || "No description added for this session."}
            </p>
          </div>

          {error && (
            <p className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            onClick={() => {
              if (window.confirm("Delete this workout? This cannot be undone.")) {
                setError(null);
                remove.mutate();
              }
            }}
            disabled={remove.isPending}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-destructive/40 px-4 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
          >
            {remove.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {remove.isPending ? "Deleting…" : "Delete workout"}
          </button>
        </article>
      )}
    </main>
  );
}
