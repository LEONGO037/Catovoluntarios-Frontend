import { ZONA_HORARIA_AGENDA } from '../constants/entrevistas.constants';

function dosDigitos(n: number): string {
  return n.toString().padStart(2, '0');
}

/** Fecha de hoy en La Paz, formato YYYY-MM-DD. */
export function hoyEnLaPaz(): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA_AGENDA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return partes; // en-CA ya produce YYYY-MM-DD
}

export function sumarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return `${d.getUTCFullYear()}-${dosDigitos(d.getUTCMonth() + 1)}-${dosDigitos(d.getUTCDate())}`;
}

/** "lunes 23 de noviembre" a partir de YYYY-MM-DD. */
export function formatearDia(fecha: string): string {
  return new Intl.DateTimeFormat('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${fecha}T00:00:00Z`));
}

/** "lun 23" a partir de YYYY-MM-DD. */
export function formatearDiaCorto(fecha: string): { nombre: string; numero: string } {
  const d = new Date(`${fecha}T00:00:00Z`);
  return {
    nombre: new Intl.DateTimeFormat('es-BO', { weekday: 'short', timeZone: 'UTC' }).format(d),
    numero: String(d.getUTCDate()),
  };
}

/** Fecha y hora de un instante ISO en hora de La Paz. */
export function formatearFechaHora(iso: string): string {
  return new Intl.DateTimeFormat('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ZONA_HORARIA_AGENDA,
  }).format(new Date(iso));
}
