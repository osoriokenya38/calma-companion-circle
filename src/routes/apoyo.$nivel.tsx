import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneCall, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  understanding: string;
  professional: string;
  ask: string;
}

const LEVELS: Record<string, Level> = {
  "1": {
    title: "Violencia física o riesgo inminente",
    understanding: "Los golpes, empujones, amenazas y el impedimento para salir son señales de violencia. No necesitas esperar a que haya lesiones para pedir ayuda. Si tu dispositivo es vigilado, busca apoyo desde un teléfono seguro.",
    professional: "Ante peligro inmediato, llama al 911. Cuando estés a salvo, solicita atención médica para revisar lesiones y orientación sobre refugios, Centros de Justicia para las Mujeres y servicios jurídicos de tu localidad. No confrontes a la persona agresora para obtener pruebas.",
    ask: "Estoy en riesgo y necesito ayuda para salir a un lugar seguro. Estoy en [ubicación]. ¿Puedes llamar a emergencias o acompañarme? Comparte tu ubicación solo con personas de confianza y si hacerlo es seguro.",
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
    understanding: "El consentimiento debe ser libre y puede retirarse en cualquier momento. La presión, las amenazas o no poder consentir no son consentimiento. El bloqueo, el miedo o no haberse resistido no te hacen responsable.",
    professional: "Busca atención médica lo antes posible, aunque no haya lesiones visibles. El personal puede valorar lesiones, prevención de infecciones y anticoncepción de emergencia según tu caso. También puedes solicitar apoyo psicológico y orientación jurídica sin decidir de inmediato si denunciarás.",
    ask: "Viví una agresión sexual y necesito atención médica y una persona que me acompañe. Por ahora no quiero contar todos los detalles. ¿Puedes estar conmigo?",
    intro: "Lo que pasó no fue tu culpa. Nada de lo que hicieras, dijeras o vistieras lo provocó. Esto es lo que puedes hacer ahora.",
    steps: [
      "Busca un lugar seguro y, si puedes, a una persona de confianza que te acompañe.",
      "Si deseas preservar evidencia y puedes hacerlo, evita lavar la ropa y guárdala por separado en bolsas de papel. Si ya te bañaste o cambiaste, aún puedes recibir atención y denunciar.",
      "Acude a un centro de salud cuanto antes: algunas medidas preventivas son sensibles al tiempo. Aunque hayan pasado días, sigue siendo importante recibir atención.",
      "Tienes derecho a atención médica y jurídica gratuita, decidas o no denunciar.",
      "Habla con una línea de apoyo cuando te sientas lista. No hay prisa ni forma correcta de reaccionar.",
    ],
    note: "El shock puede hacerte sentir entumecida o confundida. Es una respuesta normal ante algo que no debería pasarle a nadie.",
  },
  "3": {
    title: "Pensamientos de autolesión o suicidio",
    understanding: "Los pensamientos de hacerte daño merecen atención, aunque aparezcan de forma intermitente. Si tienes un plan, acceso a medios o sientes que podrías actuar, busca ayuda de emergencia ahora; un ejercicio de calma no sustituye esa atención.",
    professional: "Si ya te lesionaste, ingeriste una sustancia o no puedes mantenerte a salvo, llama al 911 o acude a urgencias acompañada. La Línea de la Vida puede orientarte durante una crisis. Después, solicita seguimiento psicológico o psiquiátrico para construir un plan de seguridad personal.",
    ask: "Estoy teniendo pensamientos de hacerme daño y necesito que estés conmigo. Ayúdame a alejar los objetos peligrosos y a llamar a una línea de crisis o ir a urgencias.",
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
    understanding: "La humillación, el aislamiento, revisar tu teléfono, controlar tu dinero o negar repetidamente lo que ocurrió pueden formar parte de un patrón de abuso. Las diferencias en una relación no justifican el miedo ni la pérdida de tu autonomía.",
    professional: "Busca apoyo individual con una profesional que tenga experiencia en violencia y perspectiva de género. Los servicios de atención a mujeres pueden orientarte sobre protección y derechos. Si hay amenazas o control, prioriza tu seguridad antes de confrontar o proponer terapia de pareja.",
    ask: "Hay situaciones en mi relación que me hacen sentir miedo y dudar de mí. Necesito que me escuches sin juzgarme y me ayudes a buscar apoyo de forma segura.",
    intro: "Que alguien te haga dudar de tu memoria, tu valor o tu percepción también es violencia, aunque no deje marcas visibles.",
    steps: [
      "Valida tu experiencia: si te lastima, es real. No necesitas que nadie más lo confirme.",
      "Si no aumenta el riesgo, lleva un registro privado (fechas, frases, situaciones) en un lugar al que la otra persona no tenga acceso. No lo guardes si tu dispositivo es vigilado.",
      "Identifica los límites que te gustaría poner y con quién puedes contar para sostenerlos.",
      "Busca acompañamiento psicológico: la violencia emocional desgasta, y no tienes que atravesarla sola.",
    ],
    note: "Afirmaciones para hoy: “Mi percepción es válida. Merezco respeto. No soy responsable de la conducta de otra persona.”",
  },
  "5": {
    title: "Crisis de ansiedad, pánico o desbordamiento",
    intro: "La ansiedad puede sentirse muy intensa. Si reconoces estas sensaciones y estás en un lugar seguro, podemos volver al presente con la técnica 5-4-3-2-1.",
    understanding: "Una crisis puede incluir palpitaciones, temblor, mareo o sensación de falta de aire. Estos síntomas también pueden tener causas médicas: no asumas que todo es ansiedad, especialmente si es la primera vez o se siente distinto.",
    professional: "Si hay dolor de pecho nuevo o intenso, desmayo o dificultad marcada para respirar, busca atención médica urgente. Si las crisis se repiten, afectan tu sueño o te hacen evitar actividades, pide una valoración médica y psicológica. No cambies medicamentos sin indicación profesional.",
    ask: "Estoy sintiendo mucha ansiedad. ¿Puedes quedarte conmigo en un lugar tranquilo y hablarme despacio? Si no mejora o aparecen síntomas nuevos, ayúdame a buscar atención médica.",
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
    ["T · Temperatura", "Si te resulta cómodo, coloca una tela fresca sobre las mejillas. Evita hielo directo, frío extremo e inmersiones; si tienes una condición médica, consulta antes."],
    ["I · Movimiento", "Si estás físicamente bien, prueba caminar o moverte un momento. Evita esfuerzo intenso si hay lesiones, mareo, dolor de pecho o una contraindicación médica."],
    ["P · Pausada", "Respira de forma suave, sin forzar ni retener el aire. Puedes alargar un poco la exhalación. Si te mareas, vuelve a tu respiración natural."],
    ["P · Progresiva", "Tensa suavemente y relaja los músculos, de los pies a la cara, evitando zonas lesionadas. Detente si aparece dolor."],
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
          <Button
            onClick={() => setStep((s) => s + 1)}
            className="mt-6 h-auto rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition hover:brightness-110 glow-mauve"
          >
            Listo, continuar
          </Button>
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
            <Button variant="outline" onClick={() => setStep(0)} className="h-auto rounded-full border border-mauve/40 px-6 py-3 text-sm font-medium text-foreground transition hover:-translate-y-0.5">
              Repetir ejercicio
            </Button>
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

      <section className="mt-12 border-t border-mauve/30 pt-8" aria-label="Información y acompañamiento">
        <h2 className="text-2xl text-foreground">Comprender lo que estás viviendo</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{level.understanding}</p>
        <h2 className="mt-8 text-2xl text-foreground">Cuándo y dónde buscar ayuda profesional</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{level.professional}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild className="h-auto rounded-full px-5 py-3"><a href="tel:8009112000"><PhoneCall aria-hidden />Línea de la Vida · 800 911 2000</a></Button>
          <Button asChild variant="outline" className="h-auto rounded-full px-5 py-3"><Link to="/red">Mi red de apoyo</Link></Button>
        </div>
        <h2 className="mt-8 text-2xl text-foreground">Una forma de pedir acompañamiento</h2>
        <blockquote className="mt-4 border-l-2 border-mauve pl-5 text-sm leading-relaxed text-muted-foreground">{level.ask}</blockquote>
        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">Orientación general para México. Calma no realiza diagnósticos ni sustituye la atención médica, psicológica o jurídica. En peligro inmediato, llama al <a href="tel:911" className="font-semibold text-alert">911</a>.</p>
      </section>
    </div>
  );
}
