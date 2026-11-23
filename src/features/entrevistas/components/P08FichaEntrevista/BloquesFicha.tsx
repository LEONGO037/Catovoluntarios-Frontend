import type { FC, ReactNode } from 'react';
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../utils/cn';
import { DIAS_SEMANA, DICTAMEN_ENTREVISTA, PREGUNTA_GUIA_PENDIENTE } from '../../constants/entrevistas.constants';
import type { CitaVista, DictamenEntrevista, HorarioDisponible } from '../../types/entrevistas.types';
import { formatearFechaHora } from '../../utils/fechas';

export interface FichaFormValues {
  observacionesMotivacion: string;
  manejoTransporte: string;
  tiempoSemanal: string;
  horariosDisponibles: HorarioDisponible[];
  observacionesCompromiso: string;
  observacionesTrabajoEquipo: string;
  aperturaReligiosaEscala: number | null;
  observacionesRecomendaciones: string;
  proyectoReceptorSugeridoId: string;
  dictamen: DictamenEntrevista | '';
}

export const EncabezadoFicha: FC<{ cita: CitaVista }> = ({ cita }) => (
  <section className="cato-card">
    <dl className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
      {[
        ['Postulante', cita.postulante.nombreCompleto],
        ['CI', cita.postulante.ci],
        ['Carrera', cita.postulante.carrera],
        ['Catolíder entrevistador', cita.catoliderNombre ?? '—'],
        ['Fecha y hora', formatearFechaHora(cita.fechaHora)],
      ].map(([etiqueta, valor]) => (
        <div key={etiqueta}>
          <dt className="text-xs font-semibold text-cato-slate uppercase tracking-wider">{etiqueta}</dt>
          <dd className="mt-1 font-medium text-cato-text first-letter:uppercase">{valor}</dd>
        </div>
      ))}
    </dl>
  </section>
);

interface BloqueFichaProps {
  numero: number;
  titulo: string;
  conPreguntaGuia?: boolean;
  destacado?: boolean;
  children: ReactNode;
}

export const BloqueFicha: FC<BloqueFichaProps> = ({ numero, titulo, conPreguntaGuia = true, destacado, children }) => (
  <section className={cn('cato-card space-y-4', destacado && 'border-cato-gold')}>
    <header className="flex items-center gap-3">
      <span className="w-8 h-8 shrink-0 rounded-full bg-cato-navy text-white flex items-center justify-center text-sm font-bold">
        {numero}
      </span>
      <h2 className="text-lg">{titulo}</h2>
    </header>
    {conPreguntaGuia && (
      <p className="text-xs italic text-cato-muted bg-cato-canvas border border-dashed border-cato-border rounded-lg px-3 py-2">
        {PREGUNTA_GUIA_PENDIENTE}
      </p>
    )}
    {children}
  </section>
);

interface EscalaAperturaProps {
  valor: number | null;
  onCambiar: (valor: number) => void;
  error?: string;
}

export const EscalaApertura: FC<EscalaAperturaProps> = ({ valor, onCambiar, error }) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold text-cato-slate uppercase tracking-wider">
      Escala de apertura religiosa <span className="text-rose-500">*</span>
    </p>
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          onClick={() => onCambiar(n)}
          className={cn(
            'w-10 h-10 rounded-lg border text-sm font-bold transition-colors',
            valor === n ? 'bg-cato-navy border-cato-navy text-white' : 'bg-white border-cato-input text-cato-slate hover:border-cato-navy',
          )}
        >
          {n}
        </button>
      ))}
    </div>
    <div className="flex justify-between text-[11px] text-cato-muted max-w-[480px]">
      <span>1 · Baja apertura</span>
      <span>10 · Alta afinidad</span>
    </div>
    {error && <p className="text-xs text-rose-600">{error}</p>}
  </div>
);

interface HorariosPostulanteProps {
  control: Control<FichaFormValues>;
  register: UseFormRegister<FichaFormValues>;
}

export const HorariosPostulante: FC<HorariosPostulanteProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'horariosDisponibles' });
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-cato-slate uppercase tracking-wider">Horarios disponibles del postulante</p>
      {fields.length === 0 && <p className="text-xs text-cato-muted">Sin horarios registrados.</p>}
      {fields.map((campo, i) => (
        <div key={campo.id} className="flex flex-wrap items-center gap-2">
          <select {...register(`horariosDisponibles.${i}.dia` as const)} className="cato-input w-40" aria-label="Día">
            {DIAS_SEMANA.map((d) => (
              <option key={d.valor} value={d.valor}>
                {d.etiqueta}
              </option>
            ))}
          </select>
          <input type="time" {...register(`horariosDisponibles.${i}.horaInicio` as const, { required: true })} className="cato-input w-32" aria-label="Desde" />
          <span className="text-xs text-cato-muted">a</span>
          <input type="time" {...register(`horariosDisponibles.${i}.horaFin` as const, { required: true })} className="cato-input w-32" aria-label="Hasta" />
          <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)} aria-label="Quitar horario">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<Plus className="w-4 h-4" />}
        onClick={() => append({ dia: 'LUNES', horaInicio: '14:00', horaFin: '18:00' })}
      >
        Agregar horario
      </Button>
    </div>
  );
};

interface DictamenPreliminarProps {
  valor: DictamenEntrevista | '';
  onCambiar: (valor: DictamenEntrevista) => void;
  error?: string;
}

export const DictamenPreliminar: FC<DictamenPreliminarProps> = ({ valor, onCambiar, error }) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold text-cato-slate uppercase tracking-wider">
      Dictamen preliminar del Catolíder <span className="text-rose-500">*</span>
    </p>
    <div role="radiogroup" className="grid sm:grid-cols-3 gap-3">
      {(Object.keys(DICTAMEN_ENTREVISTA) as DictamenEntrevista[]).map((clave) => (
        <button
          key={clave}
          type="button"
          role="radio"
          aria-checked={valor === clave}
          onClick={() => onCambiar(clave)}
          className={cn(
            'rounded-xl border-2 px-4 py-3 text-left transition-colors',
            valor === clave ? 'border-cato-navy bg-cato-gold-light' : 'border-cato-border bg-white hover:border-cato-steel',
          )}
        >
          <span className={DICTAMEN_ENTREVISTA[clave].clase}>{DICTAMEN_ENTREVISTA[clave].etiqueta}</span>
        </button>
      ))}
    </div>
    {error && <p className="text-xs text-rose-600">{error}</p>}
  </div>
);
