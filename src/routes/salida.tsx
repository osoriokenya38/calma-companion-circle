import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/salida")({
  head: () => ({
    meta: [
      { title: "Calculadora" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Salida,
});

const keys = ["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "⌫", "="];

function calc(a: number, b: number, op: string) {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function Salida() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const press = (k: string) => {
    if (/^[0-9.]$/.test(k)) {
      setDisplay((d) => {
        if (fresh || d === "0") return k === "." ? "0." : k;
        if (k === "." && d.includes(".")) return d;
        return d + k;
      });
      setFresh(false);
      return;
    }
    if (k === "C") { setDisplay("0"); setAcc(null); setOp(null); setFresh(true); return; }
    if (k === "⌫") { setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0")); return; }
    if (k === "±") { setDisplay((d) => String(-parseFloat(d) || 0)); return; }
    if (k === "%") { setDisplay((d) => String((parseFloat(d) || 0) / 100)); return; }
    if (["+", "−", "×", "÷"].includes(k)) {
      setAcc(parseFloat(display) || 0);
      setOp(k);
      setFresh(true);
      return;
    }
    if (k === "=" && op !== null && acc !== null) {
      const r = calc(acc, parseFloat(display) || 0, op);
      setDisplay(Number.isFinite(r) ? String(Math.round(r * 1e10) / 1e10) : "Error");
      setAcc(null);
      setOp(null);
      setFresh(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-6">
      <div className="w-full max-w-xs rounded-3xl bg-neutral-800 p-5 shadow-2xl">
        <div className="mb-4 truncate rounded-2xl bg-neutral-950 px-4 py-6 text-right font-mono text-4xl text-neutral-100">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className={`h-14 rounded-2xl text-lg font-medium transition active:scale-95 ${
                ["÷", "×", "−", "+", "="].includes(k)
                  ? "bg-amber-500 text-neutral-950"
                  : ["C", "±", "%", "⌫"].includes(k)
                    ? "bg-neutral-600 text-neutral-100"
                    : "bg-neutral-700 text-neutral-100"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
