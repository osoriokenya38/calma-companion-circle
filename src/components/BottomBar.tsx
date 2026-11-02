import { Link, useLocation } from "@tanstack/react-router";
import { PhoneCall } from "lucide-react";

export function BottomBar() {
  const { pathname } = useLocation();
  if (pathname === "/salida") return null;
  return (
    <>
      <div className="h-24" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-mauve/30 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <p className="hidden text-xs text-muted-foreground sm:block">Si estás en peligro, no esperes. Pedir ayuda es un acto de valentía.</p>
          <Link
            to="/apoyo"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-alert px-6 py-3 font-semibold text-alert-foreground transition hover:brightness-110 sm:w-auto"
          >
            <PhoneCall className="h-4 w-4" />
            Necesito Apoyo Inmediato
          </Link>
        </div>
      </div>
    </>
  );
}
