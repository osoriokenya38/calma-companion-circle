import { useLocation, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export function QuickExit() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (pathname === "/salida") return null;
  return (
    <button
      onClick={() => navigate({ to: "/salida" })}
      aria-label="Salida rápida: ocultar la aplicación"
      title="Salida rápida"
      className="fixed right-4 top-24 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-mauve/40 bg-card text-muted-foreground shadow-soft transition hover:scale-105 hover:text-foreground"
    >
      <Lock className="h-5 w-5" />
    </button>
  );
}
