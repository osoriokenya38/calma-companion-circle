import { useEffect, useState } from "react";
import { HeartHandshake } from "lucide-react";

const KEY = "calma-disclaimer-v1";

export function Disclaimer() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);
  if (!open) return null;
  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* modo incógnito: no se guarda nada */
    }
    setOpen(false);
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-night/70 p-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Aviso importante">
      <div className="w-full max-w-md rounded-3xl border border-mauve/30 bg-card p-8 shadow-soft">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-primary">
          <HeartHandshake className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl text-foreground">Antes de empezar</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Calma es una herramienta de acompañamiento emocional. <strong className="text-foreground">No sustituye la atención médica, psicológica o jurídica profesional.</strong> Si estás en peligro inmediato, llama al 911.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Tus datos se guardan únicamente en este dispositivo. Puedes borrarlos en cualquier momento desde “Mi cuenta”.
        </p>
        <button
          onClick={accept}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Entendido, continuar
        </button>
      </div>
    </div>
  );
}
