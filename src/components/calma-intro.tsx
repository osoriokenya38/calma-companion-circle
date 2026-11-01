import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, HeartHandshake, Leaf, Compass, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-calma.jpg";
import connection from "@/assets/slide-2.jpg";
import walk from "@/assets/slide-3.jpg";

const moments = [
  { image: hero, alt: "Persona descansando en un paisaje tranquilo", title: "Calma. Un espacio para ti.", text: "No tienes que resolverlo todo hoy. Haz una pausa, escucha lo que sientes y encuentra apoyo a tu propio ritmo.", action: "Comenzar con mi bienestar", target: "bienestar" },
  { image: walk, alt: "Mujer caminando al aire libre entre lavandas", title: "Cada pausa es un comienzo.", text: "Vuelve al presente con una respiración tranquila. Los pequeños momentos de cuidado también cuentan.", action: "Tomar una pausa", target: "respira" },
  { image: connection, alt: "Dos amigas compartiendo una conversación tranquila", title: "No tienes que hacerlo a solas.", text: "Lo que sientes merece ser escuchado. Acércate a alguien de confianza o encuentra una línea de apoyo.", action: "Encontrar apoyo", target: "apoyo" },
];

function goTo(target: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(target)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
}

export function CalmaIntro() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [orientation, setOrientation] = useState(false);
  useEffect(() => {
    if (paused || interacting || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % moments.length), 8000);
    return () => window.clearInterval(timer);
  }, [paused, interacting]);
  const current = moments[index];
  if (!current) return null;
  return (
    <>
      <section aria-label="Un momento de calma" aria-roledescription="carrusel" className="relative isolate overflow-hidden" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
        {moments.map((moment, slide) => (
          <img key={moment.title} src={moment.image} alt={moment.alt} aria-hidden={slide !== index} className={`absolute inset-0 -z-20 h-full w-full object-cover object-center transition-opacity duration-700 motion-reduce:transition-none ${slide === index ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 -z-10 bg-night/50" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/80 via-night/40 to-transparent" />
        <div className="mx-auto flex min-h-[480px] max-w-6xl flex-col justify-center px-6 py-12 md:min-h-[510px] md:py-16">
          <p className="mb-5 text-sm font-medium uppercase tracking-normal text-cream/85">Bienestar · Orientación · Acompañamiento</p>
          <div className="min-h-[270px] max-w-xl sm:min-h-[250px]" aria-live={paused ? "polite" : "off"}>
            <h1 className="text-4xl leading-tight text-cream md:text-5xl">{current.title}</h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/90">{current.text}</p>
            <Button variant="secondary" className="mt-7 h-auto min-h-12 max-w-full whitespace-normal rounded-full px-6 py-3" onClick={() => goTo(current.target)}>{current.action}<ArrowRight /></Button>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Mensaje anterior" title="Mensaje anterior" className="rounded-full text-cream hover:bg-cream/20 hover:text-cream" onClick={() => setIndex((index + moments.length - 1) % moments.length)}><ChevronLeft /></Button>
            {moments.map((moment, slide) => <Button key={moment.title} variant="ghost" size="icon" aria-label={`Ver mensaje ${slide + 1}`} aria-pressed={slide === index} className="h-9 w-7 text-cream hover:bg-cream/20 hover:text-cream" onClick={() => setIndex(slide)}><span className={`h-2 rounded-full ${slide === index ? "w-6 bg-cream" : "w-2 bg-cream/50"}`} /></Button>)}
            <Button variant="ghost" size="icon" aria-label="Mensaje siguiente" title="Mensaje siguiente" className="rounded-full text-cream hover:bg-cream/20 hover:text-cream" onClick={() => setIndex((index + 1) % moments.length)}><ChevronRight /></Button>
            <Button variant="ghost" size="icon" aria-label={paused ? "Reanudar mensajes" : "Pausar mensajes"} title={paused ? "Reanudar mensajes" : "Pausar mensajes"} className="ml-2 rounded-full text-cream hover:bg-cream/20 hover:text-cream" onClick={() => setPaused(!paused)}>{paused ? <Play /> : <Pause />}</Button>
          </div>
        </div>
      </section>
      <section aria-label="Espacios de apoyo" className="border-b bg-background">
        <div className="mx-auto grid max-w-6xl gap-2 px-6 py-7 md:grid-cols-3 md:gap-6">
          <Button variant="ghost" className="h-auto justify-start gap-4 whitespace-normal px-3 py-4 text-left" onClick={() => goTo("bienestar")}><Leaf className="!size-6 text-primary" /><span><span className="block font-medium text-foreground">Bienestar emocional</span><span className="mt-1 block text-sm font-normal text-muted-foreground">Un momento para escucharte</span></span><ArrowRight className="ml-auto" /></Button>
          <Button variant="ghost" aria-expanded={orientation} aria-controls="orientacion-inicio" className="h-auto justify-start gap-4 whitespace-normal px-3 py-4 text-left" onClick={() => setOrientation(!orientation)}><Compass className="!size-6 text-primary" /><span><span className="block font-medium text-foreground">Orientación</span><span className="mt-1 block text-sm font-normal text-muted-foreground">Encuentra tu siguiente paso</span></span><ArrowRight className="ml-auto" /></Button>
          <Button variant="ghost" className="h-auto justify-start gap-4 whitespace-normal px-3 py-4 text-left" onClick={() => goTo("apoyo")}><HeartHandshake className="!size-6 text-primary" /><span><span className="block font-medium text-foreground">Acompañamiento</span><span className="mt-1 block text-sm font-normal text-muted-foreground">Acércate a una red de apoyo</span></span><ArrowRight className="ml-auto" /></Button>
        </div>
        {orientation && <div id="orientacion-inicio" className="mx-auto max-w-6xl border-t px-6 py-8"><h2 className="text-2xl">Encuentra el apoyo que necesitas</h2><p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Puedes comenzar con una pausa para respirar o hablar con alguien de confianza. Si el malestar persiste o afecta tu día a día, busca orientación de un profesional de salud mental. Este espacio no sustituye la atención profesional.</p><div className="mt-5 flex flex-wrap gap-3"><Button variant="outline" onClick={() => goTo("respira")}>Respirar un momento<Leaf /></Button><Button onClick={() => goTo("apoyo")}>Consultar contactos de apoyo<ArrowRight /></Button></div></div>}
      </section>
    </>
  );
}