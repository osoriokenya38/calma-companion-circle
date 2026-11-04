import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { emptyVault, vaultSchema } from './calma-data';

async function vaultKey(secret: string, userId: string) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new TextEncoder().encode(userId), info: new TextEncoder().encode('calma-vault-v1') }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
const encode = (bytes: Uint8Array) => btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''));
const decode = (value: string) => Uint8Array.from(atob(value), c => c.charCodeAt(0));

export const readVault = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  setResponseHeader('Cache-Control', 'no-store');
  const { data, error } = await context.supabase.from('private_vaults').select('ciphertext, iv').eq('user_id', context.userId).maybeSingle();
  if (error) throw new Error('No pudimos abrir tus datos. Inténtalo de nuevo.');
  if (!data) return emptyVault();
  const secret = process.env['CALMA_VAULT_KEY'];
  if (!secret) throw new Error('Tu espacio privado no está disponible ahora.');
  const key = await vaultKey(secret, context.userId);
  const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(data.iv), additionalData: new TextEncoder().encode(context.userId) }, key, decode(data.ciphertext));
  return vaultSchema.parse(JSON.parse(new TextDecoder().decode(raw)));
});

export const writeVault = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(input => vaultSchema.parse(input)).handler(async ({ context, data }) => {
  setResponseHeader('Cache-Control', 'no-store');
  const secret = process.env['CALMA_VAULT_KEY'];
  if (!secret) throw new Error('Tu espacio privado no está disponible ahora.');
  const key = await vaultKey(secret, context.userId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(context.userId) }, key, new TextEncoder().encode(JSON.stringify(data)));
  const { error } = await context.supabase.from('private_vaults').upsert({ user_id: context.userId, ciphertext: encode(new Uint8Array(encrypted)), iv: encode(iv), updated_at: new Date().toISOString() });
  if (error) throw new Error('No pudimos guardar los cambios. Inténtalo de nuevo.');
  return { saved: true };
});