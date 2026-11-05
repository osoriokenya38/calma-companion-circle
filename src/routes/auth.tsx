import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { EyeOff, Leaf, LockKeyhole, Eye, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCalma } from '@/components/CalmaProvider';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/auth')({ head: () => ({ meta: [
  { title: 'Tu espacio privado — Calma' }, { name: 'description', content: 'Entra a tu espacio de Calma, crea una cuenta o encuentra apoyo sin registro.' },
  { property: 'og:title', content: 'Tu espacio privado — Calma' }, { property: 'og:description', content: 'Un espacio privado de acompañamiento emocional para mujeres.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
] }), component: Auth });
function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const { user, signOut, ready } = useCalma(); const navigate = useNavigate();
  useEffect(() => { if (new URLSearchParams(window.location.search).get('modo') === 'registro') setMode('signup'); }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setMessage(''); setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (error) { setMessage('No pudimos crear tu cuenta. Revisa tus datos e inténtalo más tarde.'); return; }
        if (!data.session) { setMessage('Revisa tu correo para confirmar tu cuenta. Puedes usar Calma sin registro mientras tanto.'); setPassword(''); return; }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setMessage('No pudimos entrar. Revisa tu correo, contraseña y la confirmación de tu cuenta.'); return; }
      }
      await navigate({ to: '/' });
    } catch { setMessage('No se pudo conectar. Inténtalo de nuevo.'); } finally { setBusy(false); }
  };
  const reset = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessage('Escribe tu correo para recibir un enlace de recuperación.'); return; }
    setBusy(true);
    try { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' }); setMessage(error ? 'No pudimos enviar el enlace. Inténtalo más tarde.' : 'Si existe una cuenta con ese correo, recibirás un enlace para cambiar tu contraseña.'); }
    catch { setMessage('No se pudo conectar. Inténtalo de nuevo.'); } finally { setBusy(false); }
  };
  return <main className="mx-auto max-w-md px-6 py-10 md:py-14">
    <Button asChild variant="ghost" className="mb-6"><Link to="/"><ArrowLeft />Inicio</Link></Button>
    <div className="text-center"><span className="mx-auto flex size-16 items-center justify-center rounded-full border border-mauve/30 bg-secondary text-primary glow-mauve"><Leaf size={30} strokeWidth={1.5} /></span>
      <h1 className="mt-5 text-4xl font-bold">Calma</h1><p className="mt-3 text-muted-foreground">Un espacio privado para escucharte, respirar y encontrar a quien pueda acompañarte.</p></div>
    {ready && user ? <div className="mt-8 space-y-4 text-center"><p>Tu sesión está abierta.</p><Button asChild className="h-12 w-full"><Link to="/cuenta">Ir a mi espacio</Link></Button><Button variant="outline" onClick={() => void signOut()}>Cerrar sesión</Button></div> :
    <div className="mt-8 rounded-3xl border border-mauve/30 bg-card p-6 shadow-soft">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1" role="tablist" aria-label="Acceso"><Button role="tab" aria-selected={mode === 'login'} variant={mode === 'login' ? 'default' : 'ghost'} onClick={() => { setMode('login'); setMessage(''); }}>Entrar</Button><Button role="tab" aria-selected={mode === 'signup'} variant={mode === 'signup' ? 'default' : 'ghost'} onClick={() => { setMode('signup'); setMessage(''); }}>Crear cuenta</Button></div>
      <form onSubmit={submit} className="mt-6 space-y-5"><label className="block text-sm">Correo<input required type="email" autoComplete="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} className="calma-input mt-2" /></label>
        <label className="block text-sm">Contraseña<span className="relative mt-2 block"><input required minLength={8} type={show ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="Mínimo 8 caracteres" value={password} onChange={e => setPassword(e.target.value)} className="calma-input pr-12" /><Button type="button" variant="ghost" size="icon" onClick={() => setShow(!show)} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-2 top-1.5">{show ? <EyeOff /> : <Eye />}</Button></span></label>
        <Button disabled={busy || !ready} type="submit" className="h-12 w-full">{busy ? 'Un momento…' : mode === 'login' ? 'Entrar a mi espacio' : 'Crear mi espacio'}</Button>
      </form>
      {mode === 'login' && <Button variant="link" disabled={busy} onClick={() => void reset()} className="mt-2 w-full">Olvidé mi contraseña</Button>}
      {message && <p role="status" className="mt-4 text-sm text-muted-foreground">{message}</p>}
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />o<span className="h-px flex-1 bg-border" /></div>
      <Button asChild variant="outline" className="h-12 w-full"><Link to="/"><EyeOff />Uso sin registro</Link></Button>
      <p className="mt-5 flex gap-2 text-xs leading-relaxed text-muted-foreground"><LockKeyhole className="mt-0.5 size-4 shrink-0" />Sin cuenta, tus estados y contactos no se guardan después de cerrar la app ni quedan asociados a ti.</p>
    </div>}
  </main>;
}