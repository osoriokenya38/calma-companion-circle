import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneCall, Check } from "lucide-react";

export const Route = createFileRoute("/apoyo/$nivel")({
  loader: ({ params }) => {
    const level = LEVELS[params.nivel];
    if (!level) throw notFound();
    return { nivel: params.nivel, title: level.title };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Apoyo"} — Calma` },
      { name: "description", content: "Acompañamiento paso a paso para tu situación." },
      { property: "og:title", content: `${loaderData?.title ?? "Apoyo"} — Calma` },
      { property: "og:description", content: "Acompañamiento paso a paso para tu situación." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NivelDetalle,
});

const lines = [
  { n: "Emergencias", t: "911", show: "911" },
  { n: "Línea de la Vida", t: "8009112000", show: "800 911 2000" },
  { n: "SAPTEL", t: "5552598121", show: "55 5259 8121" },
];

interface Level {
  title: string;
  intro: string;
  steps: string[];
  note?: string;
  special?: "tipp" | "grounding";
}

const LEVELS: Record<string, Level> = {
  "1": {
    title: "Violencia física o riesgo inminente",
    intro: "Tu seguridad física es lo único importante ahora. No es el momento de respirar ni de reflexionar: es el momento de protegerte.",
    steps: [
      "Aléjate de cocinas, baños y lugares con objetos peligrosos. Busca una salida o una habitación con llave.",
      "Si puedes, sal de la casa y ve a un lugar con gente: una tienda, la casa de una vecina, una farmacia.",
      "Llama al 911 o pide a alguien de confianza que llame por ti.",
      "Ten a la mano una bolsa con documentos, llaves, medicinas y algo de dinero, por si debes salir rápido.",
      "Avisa a tu red de apoyo con una palabra clave acordada previamente.",
      "Si hay menores contigo, prioriza sacarlos del lugar de riesgo.",
    ],
    note: "Los refugios y la red de mujeres de tu estado pueden darte resguardo temporal gratuito. Pregunta al llamar.",
  },
  "2": {
    title: "Agresión o violencia sexual",
    intro: "Lo que pasó no fue tu culpa. Nada de lo que hicieras, dijeras o vistieras lo provocó. Esto es lo que puedes hacer ahora.",
    steps: [
      "Busca un lugar seguro y, si puedes, a una persona de confianza que te acompañe.",
      "No te bañes ni cambies de ropa todavía si deseas presentar una denuncia: hay evidencia que se puede preservar.",
      "Acude a un centro de salud dentro de las primeras 72 horas: pueden atenderte, prevenir infecciones y embarazo, y documentar lesiones.",
      "Tienes derecho a atención médica y jurídica gratuita, decidas o no denunciar.",
      "Habla con una línea de apoyo cuando te sientas lista. No hay prisa ni forma correcta de reaccionar.",
    ],
    note: "El shock puede hacerte sentir entumecida o confundida. Es una respuesta normal ante algo que no debería pasarle a nadie.",
  },
  "3": {
    title: "Pensamientos de autolesión o suicidio",
    intro: "Que estés aquí ya es un acto de cuidado hacia ti. Estos pensamientos son una señal de dolor, no una orden. Vamos paso a paso.",
    steps: [
      "Aléjate de cualquier objeto con el que puedas hacerte daño. Entrégalo a alguien o sal de donde está.",
      "No estés sola: llama a una línea de crisis o escribe a alguien de tu red ahora.",
      "Comprométete solo con los próximos 10 minutos. Luego otros 10. Nada más.",
      "Prueba la técnica TIPP de abajo para bajar la intensidad emocional rápidamente.",
    ],
    special: "tipp",
    note: "La Línea de la Vida (800 911 2000) atiende 24/7, es gratuita y confidencial. Mereces ser escuchada.",
  },
  "4": {
    title: "Violencia psicológica, control o gaslighting",
    intro: "Que alguien te haga dudar de tu memoria, tu valor o tu percepción también es violencia, aunque no deje marcas visibles.",
    steps: [
      "Valida tu experiencia: si te lastima, es real. No necesitas que nadie más lo confirme.",
      "Lleva un registro privado (fechas, frases, situaciones) en un lugar seguro. Te ayuda a ver patrones y a confiar en tu memoria.",
      "Identifica los límites que te gustaría poner y con quién puedes contar para sostenerlos.",
      "Busca acompañamiento psicológico: la violencia emocional desgasta, y no tienes que atravesarla sola.",
    ],
    note: "Afirmaciones para hoy: “Mi percepción es válida. Merezco respeto. No soy responsable de la conducta de otra persona.”",
  },
  "5": {
    title: "Crisis de ansiedad, pánico o desbordamiento",
    intro: "El pánico es aterrador pero no te va a dañar: es una alarma falsa de tu cuerpo. Vamos a bajarla juntas con la técnica 5-4-3-2-1.",
    steps: [
      "Recuérdate: “Esto es ansiedad. Es incómoda, pero pasará.”",
      "Afloja la ropa ajustada y apoya los pies en el suelo.",
      "Sigue el ejercicio guiado de abajo, paso a paso y sin prisa.",
      "Cuando baje la intensidad, bebe agua y avisa a alguien de confianza cómo te sientes.",
    ],
    special: "grounding",
  },
};

function Tipp() {
  const items = [
    ["T · Temperatura", "Aplica agua fría o hielo envuelto en tela sobre tu cara 15–30 segundos. Activa el reflejo de calma del cuerpo."],
    ["I · Intenso", "Haz ejercicio intenso 1 minuto: saltos, sentadillas, subir escaleras. Quema la descarga de adrenalina."],
    ["P · Pausada", "Respira lento: exhala más largo de lo que inhalas (inhala 4, exhala 6)."],
    ["P · Progresiva", "Tensa y relaja cada grupo muscular, de los pies a la cara."],
  ];
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map(([t, d]) => (
        <div key={t} className="rounded-3xl border border-mauve/30 bg-card p-6">
          <h3 className="text-lg font-semibold text-primary">{t}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{d}</p>
        </div>
      ))}
    </div>
  );
}

const groundingSteps = [
  { n: 5, sense: "cosas que puedes VER", hint: "Nómbralas en voz baja: una luz, una sombra, un color…" },
  { n: 4, sense: "cosas que puedes TOCAR", hint: "La tela de tu ropa, la superficie de la mesa, tu propio cabello…" },
  { n: 3, sense: "sonidos que puedes ESCUCHAR", hint: "El aire, voces lejanas, tu respiración…" },
  { n: 2, sense: "aromas que puedes OLER", hint: "Tu loción, el café, el aire…" },
  { n: 1, sense: "cosa que puedes SABOREAR", hint: "Bebe un sorbo de agua o nota el sabor en tu boca." },
];

function Grounding() {
  const [step, setStep] = useState(0);
  const done = step >= groundingSteps.length;
  const gs = groundingSteps[step];
  return (
    <div className="mt-8 rounded-3xl border border-mauve/30 bg-card p-8 text-center shadow-soft">
      {!done && gs ? (
        <>
          <p className="text-sm text-muted-foreground">Paso {step + 1} de {groundingSteps.length}</p>
          <p className="mt-4 font-display text-6xl text-mauve">{gs.n}</p>
          <p className="mt-2 text-xl font-semibold text-foreground">{gs.sense}</p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">{gs.hint}</p>
          <button
            onClick={() => setStep((s) => s + 1)}
            className="mt-6 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition hover:brightness-110 glow-mauve"
          >
            Listo, continuar
          </button>
        </>
      ) : (
        <>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage text-plum-deep">
            <Check className="h-7 w-7" />
          </span>
          <p className="mt-4 text-xl font-semibold text-foreground">Lo lograste. Estás aquí, en el presente.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Nota cómo se siente tu cuerpo ahora comparado con hace unos minutos. Puedes repetir el ejercicio cuando lo necesites.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => setStep(0)} className="rounded-full border border-mauve/40 px-6 py-3 text-sm font-medium text-foreground transition hover:-translate-y-0.5">
              Repetir ejercicio
            </button>
            <Link to="/respira" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              Ir a respirar
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function NivelDetalle() {
  const { nivel } = Route.useLoaderData();
  const level = LEVELS[nivel];
  if (!level) return null;
  const urgent = ["1", "2", "3"].includes(nivel);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/apoyo" className="text-sm text-muted-foreground hover:text-primary">← Todas las opciones de apoyo</Link>
      <p className={`mt-8 inline-block rounded-full px-4 py-1 text-sm ${urgent ? "bg-alert/15 text-alert" : "bg-sand text-muted-foreground"}`}>
        Nivel {nivel}{urgent ? " · urgente" : ""}
      </p>
      <h1 className="mt-4 text-4xl text-foreground md:text-5xl">{level.title}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">{level.intro}</p>

      {urgent && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {lines.map((c) => (
            <a key={c.n} href={`tel:${c.t}`} className="flex items-center justify-center gap-2 rounded-full bg-alert px-5 py-3 font-semibold text-alert-foreground transition hover:brightness-110 glow-alert">
              <PhoneCall className="h-4 w-4" /> {c.n} · {c.show}
            </a>
          ))}
        </div>
      )}

      <h2 className="mt-12 text-2xl text-foreground">Paso a paso</h2>
      <ol className="mt-5 space-y-4">
        {level.steps.map((s, i) => (
          <li key={i} className="flex gap-4 rounded-3xl border border-mauve/30 bg-card p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand font-semibold text-primary">{i + 1}</span>
            <p className="text-sm leading-relaxed text-foreground">{s}</p>
          </li>
        ))}
      </ol>

      {level.special === "tipp" && (
        <>
          <h2 className="mt-12 text-2xl text-foreground">Técnica TIPP para bajar la intensidad</h2>
          <Tipp />
        </>
      )}
      {level.special === "grounding" && (
        <>
          <h2 className="mt-12 text-2xl text-foreground">Ejercicio guiado 5-4-3-2-1</h2>
          <Grounding />
        </>
      )}

      {level.note && (
        <p className="mt-10 rounded-2xl bg-warm p-5 text-sm text-accent-foreground shadow-soft">{level.note}</p>
      )}
    </div>
  );
}
