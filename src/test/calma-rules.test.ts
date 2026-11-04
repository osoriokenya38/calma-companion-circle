import { describe, expect, it } from 'vitest';
import { breathingAt, contactSchema, emptyVault } from '@/lib/calma-data';
const contact = { id: '123e4567-e89b-42d3-a456-426614174000', nombre: 'María', apellido1: 'García', apellido2: 'López', telefono: '5512345678' };
describe('Calma rules', () => {
  it('requires exactly ten numeric phone digits', () => {
    expect(contactSchema.safeParse(contact).success).toBe(true);
    for (const telefono of ['551234567', '55123456789', '55123a5678']) expect(contactSchema.safeParse({ ...contact, telefono }).success).toBe(false);
  });
  it('requires name and both surnames', () => {
    for (const field of ['nombre', 'apellido1', 'apellido2']) expect(contactSchema.safeParse({ ...contact, [field]: '' }).success).toBe(false);
  });
  it('holds each of the four breathing phases for four seconds', () => {
    expect(Array.from({ length: 17 }, (_, s) => breathingAt(s).phase)).toEqual([0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,0]);
    expect([0,1,2,3,4].map(s => breathingAt(s).count)).toEqual([4,3,2,1,4]);
  });
  it('starts a new guest session without contacts or mood records', () => {
    const previous = emptyVault(); previous.contacts.push(contact);
    expect(emptyVault()).toEqual({ contacts: [], moods: [] });
  });
});