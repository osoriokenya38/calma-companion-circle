import { z } from 'zod';

export const contactSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().trim().min(1).max(50),
  apellido1: z.string().trim().min(1).max(50),
  apellido2: z.string().trim().min(1).max(50),
  telefono: z.string().regex(/^\d{10}$/),
});
export const moodSchema = z.object({ mood: z.enum(['Triste', 'Ansiosa', 'Neutral', 'Bien', 'Feliz']), date: z.string().datetime() });
export const vaultSchema = z.object({ contacts: z.array(contactSchema).max(100), moods: z.array(moodSchema).max(365) });
export type Contacto = z.infer<typeof contactSchema>;
export type Vault = z.infer<typeof vaultSchema>;
export const emptyVault = (): Vault => ({ contacts: [], moods: [] });
export const breathingAt = (seconds: number) => ({ phase: Math.floor(seconds / 4) % 4, count: 4 - seconds % 4 });