import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Leaf, LogIn, UserPlus, EyeOff, LockKeyhole, ArrowRight, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalma } from "./CalmaProvider";

// Shown every time the app is opened (state lives only in memory, so each load starts here).
export function Welcome() {
  const { user, ready } = useCalma();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const enter = () => setEntered(true);
  const salir = () => navigate({ to: "/salida" });
  if (!ready || entered || pathname === "/auth" || pathname === "/reset-password") return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="welcome-title" className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-background px-6 py-10">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full border border-mauve/30 bg-secondary text-primary glow-mauve">
          <Leaf size={36} strokeWidth={1.5} />
        </span>
        <h1 id="welcome-title" className="mt-6 text-4xl font-bold">Bienvenida a Calma</h1>
        <p className="mt-3 text-muted-foreground">Un espacio seguro para respirar, escucharte y encontrar acompañamiento. Elige cómo quieres continuar.</p>
        <div className="mt-8 space-y-3">
          {user ? (
            <Button asChild className="h-12 w-full" onClick={enter}>
              <Link to="/"><ArrowRight />Continuar a mi espacio</Link>
            </Button>
          ) : (
            <>
              <Button asChild className="h-12 w-full" onClick={enter}>
                <Link to="/auth" search={{ modo: "registro" } as never}><UserPlus />Crear cuenta</Link>
              </Button>
              <Button asChild variant="secondary" className="h-12 w-full" onClick={enter}>
                <Link to="/auth"><LogIn />Iniciar sesión</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 w-full" onClick={enter}>
                <Link to="/"><EyeOff />Ingresar sin cuenta</Link>
              </Button>
            </>
          )}
        </div>
        <p className="mt-6 flex gap-2 text-left text-xs leading-relaxed text-muted-foreground">
          <LockKeyhole className="mt-0.5 size-4 shrink-0" />Con una cuenta, tus contactos y registros se guardan cifrados. Sin cuenta, nada queda asociado a ti.
        </p>
      </div>
    </div>
  );
}
