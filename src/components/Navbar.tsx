import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

const linkBase =
  "rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
const linkActive = "bg-panel text-brand ring-1 ring-line";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { session } = useSession();

  const items = session
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/workouts", label: "Workouts" },
        { to: "/workouts/new", label: "Add Workout" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register" },
      ];

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={linkBase}
          activeProps={{ className: `${linkBase} ${linkActive}` }}
          activeOptions={{ exact: item.to === "/" }}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function Navbar() {
  const { session, name } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    setOpen(false);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-brand/15 ring-1 ring-brand/30">
            <span className="font-display text-base font-bold leading-none text-brand">F</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            FitTrack
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <div className="hidden items-center gap-2 rounded-full bg-panel py-1 pl-1 pr-3 ring-1 ring-line sm:flex">
                <div className="grid size-7 place-items-center rounded-full bg-brand/20 text-xs font-bold uppercase text-brand">
                  {name.slice(0, 2)}
                </div>
                <span className="text-sm text-muted-foreground">{name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="hidden rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground md:block"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="hidden rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-brand-foreground transition hover:brightness-110 md:block"
            >
              Get started
            </Link>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="grid size-9 place-items-center rounded-lg border border-line text-muted-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line/70 bg-panel/60 px-5 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLinks onNavigate={() => setOpen(false)} />
            {session && (
              <button
                onClick={handleSignOut}
                className="mt-1 rounded-lg border border-line px-3.5 py-2 text-left text-sm font-medium text-muted-foreground"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
