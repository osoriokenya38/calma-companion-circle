import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
export const Route = createFileRoute('/reset-password')({ head: () => ({ meta: [
  { title: 'Restablecer contraseña — Calma' }, { name: 'description', content: 'Recupera el acceso a tu espacio privado de Calma.' },
  { property: 'og:title', content: 'Restablecer contraseña — Calma' }, { property: 'og:description', content: 'Establece una nueva contraseña de forma segura.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
] }), component: ResetPassword });
function ResetPassword() {
  const [valid, setValid] = useState(false); const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState(''); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [done, setDone] = useState(false);
  useEffect(() => { setValid(new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'); }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); if (password !== confirmation) { setMessage('Las contraseñas no coinciden.'); return; }
    setBusy(true);
    try { const { error } = await supabase.auth.updateUser({ password }); if (error) setMessage('El enlace no es válido o ha caducado. Solicita uno nuevo.'); else { setDone(true); setPassword(''); setConfirmation(''); } }
    catch { setMessage('No se pudo conectar. Inténtalo de nuevo.'); } finally { setBusy(false); }
  };
  return <main className="mx-auto max-w-md px-6 py-16"><h1 className="text-3xl">Una nueva contraseña</h1>{done ? <p className="mt-6" role="status">Tu contraseña se actualizó.</p> : valid ? <form onSubmit={submit} className="mt-8 space-y-5"><label className="block">Nueva contraseña<input required type="password" minLength={8} autoComplete="new-password" className="calma-input mt-2" value={password} onChange={e => setPassword(e.target.value)} /></label><label className="block">Confirmar contraseña<input required type="password" minLength={8} autoComplete="new-password" className="calma-input mt-2" value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label><Button type="submit" disabled={busy} className="h-12 w-full">Guardar contraseña</Button>{message && <p role="status">{message}</p>}</form> : <p className="mt-6 text-muted-foreground">Abre el enlace de recuperación de tu correo. Si caducó, solicita uno nuevo.</p>}<Button asChild variant="link" className="mt-6"><Link to="/auth">Volver al acceso</Link></Button></main>;
}