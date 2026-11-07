import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EyeOff, KeyRound, LogOut, Trash2 } from "lucide-react";
import { useCalma } from "@/components/CalmaProvider";

export const Route = createFileRoute("/cuenta")({
  head: () => ({
    meta: [
      { title: "Mi cuenta y privacidad — Calma" },
      { name: "description", content: "Configura tu PIN de acceso, el modo incógnito y el borrado de tus datos." },
      { property: "og:title", content: "Mi cuenta y privacidad — Calma" },
      { property: "og:description", content: "Privacidad y control de tus datos en Calma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cuenta,
});

const PIN_KEY = "calma-pin";

function hashPin(pin: string) {
  let h = 5381;
  for (let i = 0; i < pin.length; i++) h = ((h << 5) + h + pin.charCodeAt(i)) >>> 0;
  return String(h);
}

function Cuenta() {
  const { user, signOut } = useCalma();
  const [hasPin, setHasPin] = useState(false);
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      setHasPin(!!localStorage.getItem(PIN_KEY));
    } catch { /* incógnito */ }
  }, []);

  const savePin = () => {
    if (!/^\d{4}$/.test(pin)) {
      setMsg("El PIN debe tener exactamente 4 dígitos.");
      return;
    }
    try {
      localStorage.setItem(PIN_KEY, hashPin(pin));
      setHasPin(true);
      setPin("");
      setMsg("PIN guardado. Te lo pediremos al abrir la app en este dispositivo.");
    } catch {
      setMsg("No se pudo guardar en este navegador (modo incógnito).");
    }
  };

  const removePin = () => {
    try {
      localStorage.removeItem(PIN_KEY);
    } catch { /* incógnito */ }
    setHasPin(false);
    setMsg("PIN eliminado.");
  };

  const wipe = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("calma-"))
        .forEach((k) => localStorage.removeItem(k));
    } catch { /* incógnito */ }
    setMsg("Todos tus datos fueron borrados de este dispositivo.");
    setHasPin(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Volver al inicio</Link>
      <h1 className="mt-8 text-4xl text-foreground md:text-5xl">Mi cuenta y <em className="text-mauve">privacidad</em></h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Calma funciona sin registro: no pedimos correo ni contraseña, y nada sale de este dispositivo.
      </p>

      <div className="mt-10 space-y-6">
        <section className="rounded-3xl border border-mauve/30 bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <EyeOff className="h-5 w-5 text-primary" /> Modo incógnito
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Está activo por defecto: no hay cuentas ni servidores. Tus contactos y tu PIN se guardan únicamente en este navegador.
            Para mayor privacidad, puedes usar además la ventana de incógnito de tu navegador y borrar el historial al salir.
            El botón de <strong className="text-foreground">salida rápida</strong> (el candado flotante) oculta la app al instante con una pantalla neutra.
          </p>
        </section>

        <section className="rounded-3xl border border-mauve/30 bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <KeyRound className="h-5 w-5 text-primary" /> PIN de acceso
          </h2>
          {hasPin ? (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Tienes un PIN activo en este dispositivo.</p>
              <button onClick={removePin} className="mt-4 rounded-full border border-mauve/40 px-6 py-3 text-sm font-medium text-foreground transition hover:-translate-y-0.5">
                Eliminar PIN
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                type="password"
                placeholder="Elige 4 dígitos"
                className="w-full max-w-xs rounded-2xl border border-mauve/30 bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary placeholder:text-muted-foreground"
              />
              <button onClick={savePin} className="ml-0 mt-3 block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 sm:ml-3 sm:mt-0 sm:inline-block">
                Guardar PIN
              </button>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-alert/40 bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Trash2 className="h-5 w-5 text-alert" /> Borrar todos mis datos
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Elimina tu red de apoyo, tu PIN y tus preferencias de este dispositivo. No se puede deshacer.
          </p>
          <button onClick={wipe} className="mt-4 rounded-full bg-alert px-6 py-3 text-sm font-semibold text-alert-foreground transition hover:brightness-110">
            Borrar todo ahora
          </button>
        </section>

        {user && (
          <section className="rounded-3xl border border-mauve/30 bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <LogOut className="h-5 w-5 text-primary" /> Cerrar sesión
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Estás dentro como <strong className="text-foreground">{user.email}</strong>. Al salir volverás a la pantalla de bienvenida, donde puedes crear otra cuenta o ingresar sin cuenta.
            </p>
            <button onClick={() => void signOut()} className="mt-4 inline-flex items-center gap-2 rounded-full border border-mauve/40 px-6 py-3 text-sm font-medium text-foreground transition hover:-translate-y-0.5">
              <LogOut className="h-4 w-4" /> Salir de mi cuenta
            </button>
          </section>
        )}

        {msg && <p className="rounded-2xl bg-sage/60 p-4 text-sm text-foreground">{msg}</p>}
      </div>
    </div>
  );
}
