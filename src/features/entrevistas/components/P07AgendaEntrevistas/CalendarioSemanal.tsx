import type { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../utils/cn';
import type { DisponibilidadSemanal, FranjaDisponible } from '../../types/entrevistas.types';
import { formatearDia, formatearDiaCorto } from '../../utils/fechas';

const COLUMNAS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
};

interface CalendarioSemanalProps {
  disponibilidad: DisponibilidadSemanal;
  onCambiarSemana: (desplazamientoDias: number) => void;
  /** Modo selección (Postulante / reprogramar): permite elegir una franja libre. */
  franjaSeleccionada?: string | null;
  onSeleccionarFranja?: (franja: FranjaDisponible) => void;
  /** Modo consulta (Admin / Catolíder): permite elegir el día que se muestra abajo. */
  diaSeleccionado?: string;
  onSeleccionarDia?: (fecha: string) => void;
}

/** Calendario semanal de franjas configurables (por defecto L–V, 12:00–17:00, bloques de 20 min). */
export const CalendarioSemanal: FC<CalendarioSemanalProps> = ({
  disponibilidad,
  onCambiarSemana,
  franjaSeleccionada,
  onSeleccionarFranja,
  diaSeleccionado,
  onSeleccionarDia,
}) => {
  const { dias } = disponibilidad;
  const ultimo = dias[dias.length - 1]?.fecha ?? disponibilidad.semanaInicio;

  return (
    <section className="cato-card space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg">Calendario semanal</h2>
          <p className="text-xs text-cato-muted">
            Del {formatearDia(disponibilidad.semanaInicio)} al {formatearDia(ultimo)} · bloques de{' '}
            {disponibilidad.duracionMinutos} min ({disponibilidad.horaInicio}–{disponibilidad.horaFin})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onCambiarSemana(-7)} aria-label="Semana anterior">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onCambiarSemana(7)} aria-label="Semana siguiente">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-4 text-xs text-cato-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-white border border-cato-navy" /> Disponible
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cato-canvas border border-cato-border" /> Sin cupo / pasada
        </span>
        {onSeleccionarFranja && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cato-navy" /> Seleccionada
          </span>
        )}
      </div>

      {dias.length === 0 ? (
        <p className="text-sm text-cato-muted">No hay días de entrevista configurados en esta semana.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className={cn('grid gap-3 min-w-[640px]', COLUMNAS[dias.length] ?? 'grid-cols-7')}>
            {dias.map((dia) => {
              const { nombre, numero } = formatearDiaCorto(dia.fecha);
              const libres = dia.franjas.filter((f) => f.disponible).length;
              const activo = diaSeleccionado === dia.fecha;
              return (
                <div key={dia.fecha} className="space-y-2">
                  <button
                    type="button"
                    disabled={!onSeleccionarDia}
                    onClick={() => onSeleccionarDia?.(dia.fecha)}
                    className={cn(
                      'w-full rounded-lg border px-2 py-2 text-center transition-colors',
                      activo ? 'bg-cato-navy border-cato-navy text-white' : 'bg-cato-surface-header border-cato-border text-cato-slate',
                      onSeleccionarDia && !activo && 'hover:border-cato-navy',
                    )}
                  >
                    <span className="block text-xs uppercase font-semibold">{nombre}</span>
                    <span className="block text-lg font-bold leading-tight">{numero}</span>
                    <span className={cn('block text-[11px]', activo ? 'text-cato-gold' : 'text-cato-muted')}>
                      {libres} libre{libres === 1 ? '' : 's'}
                    </span>
                  </button>
                  <ul className="space-y-1.5">
                    {dia.franjas.map((franja) => {
                      const seleccionada = franjaSeleccionada === franja.inicio;
                      const seleccionable = Boolean(onSeleccionarFranja) && franja.disponible;
                      return (
                        <li key={franja.inicio}>
                          <button
                            type="button"
                            disabled={!seleccionable}
                            onClick={() => onSeleccionarFranja?.(franja)}
                            title={`${franja.ocupadas} de ${franja.capacidad} cupos ocupados`}
                            className={cn(
                              'w-full flex items-center justify-between rounded-md border px-2 py-1 text-xs transition-colors',
                              seleccionada && 'bg-cato-navy border-cato-navy text-white',
                              !seleccionada && franja.disponible && 'bg-white border-cato-navy/40 text-cato-navy',
                              !seleccionada && !franja.disponible && 'bg-cato-canvas border-cato-border text-cato-muted',
                              seleccionable && !seleccionada && 'hover:bg-cato-gold-light',
                              !seleccionable && 'cursor-default',
                            )}
                          >
                            <span className="font-semibold">{franja.hora}</span>
                            <span>
                              {franja.ocupadas}/{franja.capacidad}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
