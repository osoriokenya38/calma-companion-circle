import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { ShieldAlert, Heart, LifeBuoy, MessagesSquare, Wind } from "lucide-react";

export const Route = createFileRoute("/apoyo")({
  head: () => ({
    meta: [
      { title: "Apoyo inmediato — Calma" },
      { name: "description", content: "Elige lo que estás viviendo y te acompañamos paso a paso: violencia, crisis de ansiedad, pensamientos de autolesión y más." },
      { property: "og:title", content: "Apoyo inmediato — Calma" },
      { property: "og:description", content: "Acompañamiento paso a paso según lo que estás viviendo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Apoyo,
});

const levels = [
  { n: 1, icon: ShieldAlert, t: "Violencia física o riesgo inminente", d: "Protocolo de seguridad y resguardo rápido. Acción inmediata.", urgent: true },
  { n: 2, icon: Heart, t: "Agresión o violencia sexual", d: "Contención del shock y pautas de atención médica y legal.", urgent: true },
  { n: 3, icon: LifeBuoy, t: "Pensamientos de autolesión o suicidio", d: "Técnica TIPP y conexión con líneas de crisis 24/7.", urgent: true },
  { n: 4, icon: MessagesSquare, t: "Violencia psicológica, control o gaslighting", d: "Validación emocional y afirmaciones para reconectarte contigo.", urgent: false },
  { n: 5, icon: Wind, t: "Crisis de ansiedad, pánico o desbordamiento", d: "Técnica guiada 5-4-3-2-1 para volver al aquí y ahora.", urgent: false },
];

function Apoyo() {
  const { pathname } = useLocation();
  if (pathname !== "/apoyo" && pathname !== "/apoyo/") return <Outlet />;
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Volver al inicio</Link>
      <h1 className="mt-8 text-4xl text-foreground md:text-5xl">¿Qué estás <em className="text-mauve">viviendo</em>?</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Elige la opción más cercana a tu situación. Te acompañaremos paso a paso, sin juicios y a tu ritmo.
      </p>

      <div className="mt-10 grid gap-4">
        {levels.map((l) => (
          <Link
            key={l.n}
            to="/apoyo/$nivel"
            params={{ nivel: String(l.n) }}
            className={`group flex items-start gap-5 rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 ${l.urgent ? "border-alert/40" : "border-mauve/30"}`}
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${l.urgent ? "bg-alert/15 text-alert" : "bg-sand text-primary"}`}>
              <l.icon className="h-6 w-6" />
            </span>
            <span className="flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold text-foreground">{l.t}</span>
                <span className={`rounded-full px-3 py-0.5 text-xs ${l.urgent ? "bg-alert/15 text-alert" : "bg-sand text-muted-foreground"}`}>
                  Nivel {l.n}{l.urgent ? " · urgente" : ""}
                </span>
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">{l.d}</span>
            </span>
            <span className="mt-1 text-xl text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary">→</span>
          </Link>
        ))}
      </div>

      <p className="mt-10 rounded-2xl bg-sand p-5 text-sm text-muted-foreground">
        Si estás en peligro inmediato, llama al <a href="tel:911" className="font-semibold text-alert">911</a> ahora. Calma es acompañamiento, no sustituye la atención profesional.
      </p>
      <Outlet />
    </div>
  );
}
