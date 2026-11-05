import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/guia")({
  head: () => ({
    meta: [
      { title: "Guía de diseño — Calma" },
      { name: "description", content: "Colores, tipografías y recomendaciones de diseño para Calma." },
      { property: "og:title", content: "Guía de diseño — Calma" },
      { property: "og:description", content: "Colores, tipografías y recomendaciones de diseño para Calma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Guia,
});

const brand = [
  { c: "bg-night", n: "Noche", h: "#1B0C34", u: "Fondos profundos" },
  { c: "bg-plum-deep", n: "Ciruela profunda", h: "#251447", u: "Títulos y texto" },
  { c: "bg-plum", n: "Ciruela", h: "#48316D", u: "Botón principal" },
  { c: "bg-mauve", n: "Malva", h: "#A387A8", u: "Acentos suaves" },
];
const warm = [
  { c: "bg-cream", n: "Crema", h: "#FBF6EF", u: "Fondo general" },
  { c: "bg-sand", n: "Arena", h: "#F1E6D8", u: "Tarjetas y etiquetas" },
  { c: "bg-peach", n: "Durazno", h: "#F2C9B0", u: "Mensajes cálidos" },
  { c: "bg-sage", n: "Salvia", h: "#C9D8C2", u: "Estados de calma/éxito" },
];

const tips = [
  ["Imágenes", "Ilustraciones orgánicas a la derecha del título en escritorio y debajo en móvil. Evita fotos de personas en crisis; usa paisajes y figuras serenas."],
  ["Formas", "Esquinas muy redondeadas (20–40px) y círculos. Nada de ángulos agresivos: transmiten seguridad."],
  ["Botones", "Un solo botón principal por pantalla, en ciruela. Grandes (mín. 48px de alto) y al alcance del pulgar. El botón de ayuda urgente siempre visible."],
  ["Espacio", "Mucho aire entre bloques. Máximo 3–4 elementos por vista para no saturar."],
  ["Texto", "Frases cortas, en segunda persona y sin juicios: “¿Cómo te sientes?” en lugar de “Reporta tu estado”."],
  ["Movimiento", "Animaciones lentas (4–8 s) como la respiración. Nada de parpadeos ni sonidos inesperados."],
];

function Swatch({ s }: { s: { c: string; n: string; h: string; u: string } }) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card">
      <div className={`h-24 ${s.c}`} />
      <div className="p-4">
        <p className="font-medium">{s.n}</p>
        <p className="text-sm text-muted-foreground">{s.h} · {s.u}</p>
      </div>
    </div>
  );
}

function Guia() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Volver</Link>
      <h1 className="mt-6 text-5xl text-plum-deep">Guía de diseño</h1>

      <h2 className="mt-14 text-2xl">Tu paleta</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">{brand.map((s) => <Swatch key={s.h} s={s} />)}</div>

      <h2 className="mt-12 text-2xl">Neutros cálidos (sin ruido)</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">{warm.map((s) => <Swatch key={s.h} s={s} />)}</div>

      <h2 className="mt-14 text-2xl">Tipografías</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl bg-dusk p-8 text-primary-foreground">
          <p className="text-sm opacity-70">Títulos · Fraunces</p>
          <p className="mt-3 font-display text-5xl">Respira hondo</p>
          <p className="mt-3 text-sm opacity-70">Serif suave y humana. Alternativas: Lora, DM Serif Display.</p>
        </div>
        <div className="rounded-3xl bg-sand p-8">
          <p className="text-sm text-muted-foreground">Texto · Figtree</p>
          <p className="mt-3 text-3xl font-medium">Estamos aquí para escucharte.</p>
          <p className="mt-3 text-sm text-muted-foreground">Redondeada y muy legible. Alternativas: Nunito Sans, Manrope.</p>
        </div>
      </div>

      <h2 className="mt-14 text-2xl">Recomendaciones</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {tips.map(([t, d]) => (
          <div key={t} className="rounded-3xl border bg-card p-6">
            <h3 className="text-lg text-primary">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
