import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero from "@/assets/hero-calma.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calma — Respira, conecta y pide ayuda" },
      { name: "description", content: "Registra tu ánimo, respira con calma y encuentra contactos de apoyo." },
      { property: "og:title", content: "Calma — Respira, conecta y pide ayuda" },
      { property: "og:description", content: "Registra tu ánimo, respira con calma y encuentra contactos de apoyo." },
    ],
  }),
  component: Index,
});

const moods = [
  { e: "😔", l: "Triste", msg: "Está bien no estar bien. Habla con alguien de confianza o llama a una línea de apoyo." },
  { e: "😟", l: "Ansioso", msg: "Probemos respirar juntos un minuto. Tu cuerpo sabe calmarse." },
  { e: "😐", l: "Neutral", msg: "Un pequeño paseo o un vaso de agua pueden cambiar tu día." },
  { e: "🙂", l: "Bien", msg: "¡Qué bueno! Anota qué te ayudó hoy para recordarlo." },
  { e: "😊", l: "Feliz", msg: "Comparte esa energía con alguien que quieras." },
];

const contacts = [
  { n: "Línea de la Vida", d: "Atención 24/7, gratuita y confidencial", t: "8009112000", show: "800 911 2000" },
  { n: "SAPTEL", d: "Apoyo psicológico por teléfono", t: "5552598121", show: "55 5259 8121" },
  { n: "Emergencias", d: "Si estás en peligro inmediato", t: "911", show: "911" },
];

function Breathing() {
  const [phase, setPhase] = useState("Inhala");
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p === "Inhala" ? "Exhala" : "Inhala")), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-mauve/40 animate-breathe" />
      <div className="absolute inset-6 rounded-full bg-mauve/50 animate-breathe" />
      <span className="relative font-display text-2xl text-primary-foreground">{phase}</span>
    </div>
  );
}

function Index() {
  const [mood, setMood] = useState<number | null>(null);
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl text-primary">calma</span>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#respira" className="hover:text-primary">Respira</a>
          <a href="#apoyo" className="hover:text-primary">Apoyo</a>
          <Link to="/guia" className="hover:text-primary">Guía de diseño</Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-8 md:grid-cols-2">
        <div>
          <p className="mb-4 inline-block rounded-full bg-sand px-4 py-1 text-sm text-primary">Hola, aquí estás a salvo</p>
          <h1 className="text-5xl leading-tight text-plum-deep md:text-6xl">¿Cómo te sientes <em className="text-mauve">hoy</em>?</h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">Un espacio tranquilo para escucharte, respirar y encontrar a quien pueda acompañarte.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {moods.map((m, i) => (
              <button
                key={m.l}
                onClick={() => setMood(i)}
                className={`flex flex-col items-center rounded-2xl border px-4 py-3 transition hover:-translate-y-0.5 ${mood === i ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}
              >
                <span className="text-2xl">{m.e}</span>
                <span className="text-xs">{m.l}</span>
              </button>
            ))}
          </div>
          {mood !== null && (
            <p className="mt-6 max-w-md rounded-2xl bg-warm p-5 text-accent-foreground shadow-soft animate-in fade-in slide-in-from-bottom-2">{moods[mood].msg}</p>
          )}
        </div>
        <div className="relative">
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-peach/60 blur-2xl" />
          <img src={hero} alt="Persona descansando en un paisaje tranquilo" className="relative aspect-[5/4] w-full rounded-[2.5rem] object-cover shadow-soft" width={1280} height={1024} />
        </div>
      </section>

      <section id="respira" className="bg-dusk py-20 text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-4xl">Respira conmigo</h2>
            <p className="mt-4 max-w-md text-primary-foreground/75">Sigue el círculo: inhala mientras crece, exhala mientras se hace pequeño. Un minuto basta.</p>
          </div>
          <Breathing />
        </div>
      </section>

      <section id="apoyo" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-4xl text-plum-deep">No estás sola, no estás solo</h2>
        <p className="mt-3 text-muted-foreground">Contactos de apoyo disponibles en México.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {contacts.map((c) => (
            <div key={c.n} className="flex flex-col rounded-3xl border bg-card p-6 shadow-soft">
              <h3 className="text-xl text-primary">{c.n}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.d}</p>
              <a href={`tel:${c.t}`} className="mt-6 rounded-full bg-primary px-5 py-3 text-center font-medium text-primary-foreground transition hover:bg-plum-deep">Llamar {c.show}</a>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">Hecho con cuidado · calma</footer>
    </div>
  );
}
