import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createWorkout } from "@/lib/workouts";

export const Route = createFileRoute("/_authenticated/workouts/new")({
  head: () => ({
    meta: [
      { title: "Add a workout — FitTrack" },
      { name: "description", content: "Log a new workout session with title, date and duration." },
      { property: "og:title", content: "Add a workout — FitTrack" },
      { property: "og:description", content: "Log a new workout session in FitTrack." },
    ],
  }),
  component: AddWorkoutPage,
});

const inputClass =
  "mt-1.5 w-full rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/50";

function AddWorkoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createWorkout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workouts"] });
      navigate({ to: "/workouts" });
    },
    onError: (err: Error) => setError(err.message),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const minutes = Number(duration);

    if (!trimmedTitle) return setError("Workout title is required.");
    if (trimmedTitle.length > 100) return setError("Title must be under 100 characters.");
    if (!date) return setError("Date is required.");
    if (!duration || !Number.isFinite(minutes) || minutes <= 0)
      return setError("Duration must be a number greater than 0.");
    if (minutes > 1440) return setError("Duration must be 1440 minutes or less.");
    if (description.length > 1000) return setError("Description must be under 1000 characters.");

    mutation.mutate({
      title: trimmedTitle,
      date,
      duration: Math.round(minutes),
      description: description.trim(),
    });
  }

  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-10">
      <Link
        to="/workouts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to workouts
      </Link>

      <div className="fade-up mt-5 rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Log a workout</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Record the session while it's still fresh.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="title" className="text-xs font-medium text-muted-foreground">
              Workout title
            </label>
            <input
              id="title"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lower Body Strength"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="text-xs font-medium text-muted-foreground">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="duration" className="text-xs font-medium text-muted-foreground">
                Duration (minutes)
              </label>
              <input
                id="duration"
                type="number"
                min={1}
                max={1440}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="45"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="text-xs font-medium text-muted-foreground">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sets, weights, how it felt…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:brightness-110 disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            {mutation.isPending ? "Saving…" : "Save workout"}
          </button>
        </form>
      </div>
    </main>
  );
}
