import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/respira")({
  head: () => ({
    meta: [
      { title: "Respira — Calma" },
      { name: "description", content: "Respiración guiada en 4 tiempos: inhala, sostén, exhala y pausa con un círculo que te acompaña." },
      { property: "og:title", content: "Respira — Calma" },
      { property: "og:description", content: "Respiración guiada en 4 tiempos para calmar tu cuerpo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Respira,
});

const phases = [
  { name: "Inhala", hint: "por la nariz, suave", scale: 1.25, glow: "glow-mauve" },
  { name: "Sostén", hint: "sin forzar, solo sostén", scale: 1.25, glow: "glow-peach" },
  { name: "Exhala", hint: "por la boca, despacio", scale: 0.8, glow: "glow-peach" },
  { name: "Pausa", hint: "descansa un momento", scale: 0.8, glow: "glow-mauve" },
] as const;

function Respira() {
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        setPhase((p) => (p + 1) % phases.length);
        return 4;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const current = phases[phase];

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-6 py-12">
      <Link to="/" className="self-start text-sm text-muted-foreground hover:text-primary">← Volver al inicio</Link>
      <h1 className="mt-8 text-center text-4xl text-foreground md:text-5xl">Respira <em className="text-mauve">conmigo</em></h1>
      <p className="mt-4 max-w-md text-center text-muted-foreground">
        Respiración en cuatro tiempos: inhala 4 segundos, sostén 4, exhala 4 y pausa 4. Sigue el círculo con tu respiración.
      </p>

      <div className="relative mt-14 flex h-72 w-72 items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full bg-mauve/30 transition-transform duration-[4000ms] ease-in-out ${current.glow}`}
          style={{ transform: `scale(${current.scale})` }}
        />
        <div
          className="absolute inset-8 rounded-full bg-peach/40 transition-transform duration-[4000ms] ease-in-out"
          style={{ transform: `scale(${current.scale})` }}
        />
        <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full bg-dusk text-cream shadow-soft">
          <span className="font-display text-3xl">{current.name}</span>
          <span className="mt-1 text-5xl font-semibold tabular-nums">{count}</span>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">{current.hint}</p>
      <button
        onClick={() => setRunning((r) => !r)}
        className="mt-6 rounded-full border border-mauve/40 bg-card px-8 py-3 font-medium text-foreground transition hover:-translate-y-0.5"
      >
        {running ? "Pausar ejercicio" : "Continuar"}
      </button>
      <p className="mt-10 max-w-md text-center text-xs text-muted-foreground">
        Si en algún momento sientes mareo, detente y respira normal. Este ejercicio no sustituye la atención profesional.
      </p>
    </div>
  );
}
