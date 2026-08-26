import { supabase } from "@/integrations/supabase/client";

export type Workout = {
  id: string;
  user_id: string;
  title: string;
  date: string;
  duration: number;
  description: string | null;
  created_at: string;
};

export type NewWorkout = {
  title: string;
  date: string;
  duration: number;
  description: string;
};

export async function listWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Workout[];
}

export async function getWorkout(id: string): Promise<Workout | null> {
  const { data, error } = await supabase.from("workouts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Workout) ?? null;
}

export async function createWorkout(input: NewWorkout): Promise<Workout> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error("You must be signed in to add a workout.");

  const { data, error } = await supabase
    .from("workouts")
    .insert({
      user_id: userData.user.id,
      title: input.title,
      date: input.date,
      duration: input.duration,
      description: input.description || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Workout;
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase.from("workouts").delete().eq("id", id);
  if (error) throw error;
}

export function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function initials(title: string): string {
  return title.replace(/[^a-zA-Z ]/g, "").trim().slice(0, 2).toUpperCase() || "WK";
}
