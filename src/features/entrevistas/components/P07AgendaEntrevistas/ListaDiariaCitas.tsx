import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Check, ClipboardList, RotateCcw, X } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { ESTADO_CITA } from '../../constants/entrevistas.constants';
import type { CitaVista, EstadoMarcadoRapido } from '../../types/entrevistas.types';
import { formatearDia } from '../../utils/fechas';

interface ListaDiariaCitasProps {
  fecha: string;
  citas: CitaVista[];
  procesandoId: number | null;
  onMarcar: (cita: CitaVista, estado: EstadoMarcadoRapido) => void;
  onReprogramar: (cita: CitaVista) => void;
}

const BOTON = 'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90';

/** Lista diaria de postulantes citados con marcado rápido Asistió / Faltó / Reprogramar. */
export const ListaDiariaCitas: FC<ListaDiariaCitasProps> = ({
  fecha,
  citas,
  procesandoId,
  onMarcar,
  onReprogramar,
}) => (
  <section className="cato-card space-y-4">
    <header>
      <h2 className="text-lg">Postulantes citados</h2>
      <p className="text-xs text-cato-muted capitalize">{formatearDia(fecha)}</p>
    </header>

    {citas.length === 0 ? (
      <p className="text-sm text-cato-muted">No hay citas para este día.</p>
    ) : (
      <ul className="divide-y divide-cato-border">
        {citas.map((cita) => {
          const estado = ESTADO_CITA[cita.estado];
          const bloqueada = !cita.puedeGestionar || cita.fichaRegistrada || procesandoId === cita.id;
          return (
            <li key={cita.id} className="py-3 flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="w-14 shrink-0 text-lg font-bold text-cato-navy">{cita.hora}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-cato-text truncate">{cita.postulante.nombreCompleto}</p>
                <p className="text-xs text-cato-muted">
                  CI {cita.postulante.ci} · {cita.postulante.carrera} · Entrevista: {cita.catoliderNombre ?? 'Sin asignar'}
                </p>
              </div>
              <span className={cn('self-start lg:self-center', estado.clase)}>{estado.etiqueta}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={cn(BOTON, 'bg-semaforo-green-text')}
                  disabled={bloqueada || cita.estado === 'ASISTIO'}
                  onClick={() => onMarcar(cita, 'ASISTIO')}
                >
                  <Check className="w-3.5 h-3.5" /> Asistió
                </button>
                <button
                  type="button"
                  className={cn(BOTON, 'bg-semaforo-red-text')}
                  disabled={bloqueada || cita.estado === 'FALTO'}
                  onClick={() => onMarcar(cita, 'FALTO')}
                >
                  <X className="w-3.5 h-3.5" /> Faltó
                </button>
                <button
                  type="button"
                  className={cn(BOTON, 'bg-semaforo-amber-border')}
                  disabled={bloqueada || cita.estado === 'ASISTIO'}
                  onClick={() => onReprogramar(cita)}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reprogramar
                </button>
                {cita.estado === 'ASISTIO' && cita.puedeGestionar && (
                  <Link to={`/ficha-entrevista/${cita.id}`} className="btn-outline text-xs px-2.5 py-1.5">
                    <ClipboardList className="w-3.5 h-3.5" />
                    {cita.fichaRegistrada ? 'Ver ficha' : 'Llenar ficha'}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    )}
    <p className="text-xs text-cato-muted">
      Solo el Catolíder asignado o Administración Pastoral pueden marcar una cita. Una vez registrada la ficha, el
      estado ya no cambia.
    </p>
  </section>
);
