import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneCall, Trash2, UserPlus } from "lucide-react";

export const Route = createFileRoute("/red")({
  head: () => ({
    meta: [
      { title: "Mi red de apoyo — Calma" },
      { name: "description", content: "Registra a tus personas de confianza para contactarlas rápido cuando lo necesites." },
      { property: "og:title", content: "Mi red de apoyo — Calma" },
      { property: "og:description", content: "Tus personas de confianza, a un toque de distancia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Red,
});

interface Contacto {
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
}

const KEY = "calma-red";

function load(): Contacto[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Contacto[];
  } catch {
    return [];
  }
}

function Red() {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setContactos(load());
  }, []);

  const save = (list: Contacto[]) => {
    setContactos(list);
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* incógnito: solo vive en memoria */
    }
  };

  const onPhone = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 10);
    setTelefono(digits);
    setError(digits.length > 0 && digits.length < 10 ? "El teléfono debe tener exactamente 10 dígitos." : "");
  };

  const add = () => {
    if (!nombre.trim() || !apellido1.trim() || !apellido2.trim()) {
      setError("Completa nombre y ambos apellidos.");
      return;
    }
    if (!/^\d{10}$/.test(telefono)) {
      setError("El teléfono debe tener exactamente 10 dígitos numéricos.");
      return;
    }
    save([...contactos, { nombre: nombre.trim(), apellido1: apellido1.trim(), apellido2: apellido2.trim(), telefono }]);
    setNombre(""); setApellido1(""); setApellido2(""); setTelefono(""); setError("");
  };

  const remove = (i: number) => save(contactos.filter((_, k) => k !== i));

  const inputCls = "w-full rounded-2xl border border-mauve/30 bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:glow-mauve placeholder:text-muted-foreground";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Volver al inicio</Link>
      <h1 className="mt-8 text-4xl text-foreground md:text-5xl">Mi red de <em className="text-mauve">apoyo</em></h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Registra a las personas de confianza a las que puedes llamar cuando lo necesites. Los datos se guardan solo en este dispositivo.
      </p>

      <div className="mt-10 rounded-3xl border border-mauve/30 bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <UserPlus className="h-5 w-5 text-primary" /> Agregar contacto
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">Nombre *</span>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={50} className={inputCls} placeholder="María" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">Primer apellido *</span>
            <input value={apellido1} onChange={(e) => setApellido1(e.target.value)} maxLength={50} className={inputCls} placeholder="García" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">Segundo apellido *</span>
            <input value={apellido2} onChange={(e) => setApellido2(e.target.value)} maxLength={50} className={inputCls} placeholder="López" />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs text-muted-foreground">Teléfono (10 dígitos) *</span>
          <input
            value={telefono}
            onChange={(e) => onPhone(e.target.value)}
            inputMode="numeric"
            autoComplete="tel"
            className={inputCls}
            placeholder="5512345678"
          />
        </label>
        {error && <p className="mt-2 text-sm text-alert">{error}</p>}
        <button
          onClick={add}
          className="mt-5 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Guardar contacto
        </button>
      </div>

      <div className="mt-10 grid gap-4">
        {contactos.length === 0 && (
          <p className="rounded-2xl bg-sand p-5 text-sm text-muted-foreground">
            Aún no tienes contactos. Agregar a alguien de confianza es un primer paso valioso.
          </p>
        )}
        {contactos.map((c, i) => (
          <div key={`${c.telefono}-${i}`} className="flex items-center gap-4 rounded-3xl border border-mauve/30 bg-card p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand font-display text-lg text-primary">
              {c.nombre[0]?.toUpperCase()}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{c.nombre} {c.apellido1} {c.apellido2}</p>
              <p className="text-sm text-muted-foreground">{c.telefono.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3")}</p>
            </div>
            <a href={`tel:${c.telefono}`} aria-label={`Llamar a ${c.nombre}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:brightness-110">
              <PhoneCall className="h-5 w-5" />
            </a>
            <button onClick={() => remove(i)} aria-label={`Eliminar a ${c.nombre}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-mauve/30 text-muted-foreground transition hover:text-alert">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
