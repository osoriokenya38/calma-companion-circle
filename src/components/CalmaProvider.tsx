import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { emptyVault, type Vault } from '@/lib/calma-data';
import { readVault, writeVault } from '@/lib/vault.functions';

interface CalmaState {
  user: User | null; ready: boolean; busy: boolean; error: string; vault: Vault;
  updateVault: (next: Vault) => Promise<boolean>;
  signOut: () => Promise<void>; clearGuest: () => void;
}
const CalmaContext = createContext<CalmaState | null>(null);
export function CalmaProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [vault, setVault] = useState<Vault>(emptyVault);
  const identity = useRef<string | null>(null);
  const saving = useRef(false);
  const read = useServerFn(readVault);
  const write = useServerFn(writeVault);
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    let active = true;
    let version = 0;
    const synchronize = async () => {
      const currentVersion = ++version;
      const { data } = await supabase.auth.getUser();
      if (!active || currentVersion !== version) return;
      const next = data.user;
      if (identity.current === (next?.id ?? null) && ready) return;
      identity.current = next?.id ?? null;
      setUser(next); setVault(emptyVault()); setError('');
      if (next) {
        setBusy(true);
        try {
          const stored = await read();
          if (active && currentVersion === version) setVault(stored);
        } catch { if (active) setError('No pudimos abrir tus datos. Recarga la página para volver a intentarlo.'); }
      }
      if (active && currentVersion === version) { setBusy(false); setReady(true); }
    };
    // Remove legacy guest data: new guest sessions never read or persist contacts/PIN.
    try { localStorage.removeItem('calma-red'); localStorage.removeItem('calma-pin'); } catch { /* unavailable storage */ }
    void synchronize();
    const { data: listener } = supabase.auth.onAuthStateChange(event => {
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_UPDATED') return;
      if (event === 'SIGNED_OUT') { identity.current = null; setUser(null); setVault(emptyVault()); setError(''); }
      void router.invalidate();
      if (event !== 'SIGNED_OUT') void queryClient.invalidateQueries();
      // Defer auth calls outside the auth callback's lock.
      setTimeout(() => { void synchronize(); }, 0);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [read, router, queryClient]);
  const updateVault = async (next: Vault) => {
    if (saving.current || busy || error) return false;
    if (!user) { setVault(next); return true; }
    saving.current = true; setBusy(true);
    const owner = user.id;
    try {
      await write({ data: next });
      if (identity.current === owner) setVault(next);
      return true;
    } catch { setError('No pudimos guardar. Tus cambios anteriores siguen protegidos. Recarga para intentar nuevamente.'); return false; }
    finally { saving.current = false; setBusy(false); }
  };
  const signOut = async () => {
    await queryClient.cancelQueries(); queryClient.clear();
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) { setError('No se pudo cerrar la sesión. Inténtalo de nuevo.'); return; }
    identity.current = null; setUser(null); setVault(emptyVault());
    await navigate({ to: '/auth', replace: true });
  };
  return <CalmaContext.Provider value={{ user, ready, busy, error, vault, updateVault, signOut, clearGuest: () => setVault(emptyVault()) }}>{children}</CalmaContext.Provider>;
}
export function useCalma() {
  const context = useContext(CalmaContext);
  if (!context) throw new Error('CalmaProvider is required');
  return context;
}