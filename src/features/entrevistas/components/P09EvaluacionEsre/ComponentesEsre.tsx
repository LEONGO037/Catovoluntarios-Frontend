import { useRef, type FC } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FileText, Lock, Upload } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { cn } from '../../../../utils/cn';
import { DICTAMEN_PSICOLOGICO, POBLACIONES } from '../../constants/entrevistas.constants';
import type { DictamenPsicologico, PoblacionSugerida, PostulanteCita } from '../../types/entrevistas.types';
import { AreaTexto } from '../AreaTexto';

export const TAMANO_MAXIMO_PDF = 10 * 1024 * 1024;

export interface EsreFormValues {
  puntajeGlobalEsre: string;
  socializacion: string;
  eficacia: string;
  proactividad: string;
  gestionPersonal: string;
  dictamen: DictamenPsicologico | '';
  poblacionesSugeridas: PoblacionSugerida[];
  observacionesConfidenciales: string;
}

export const FichaResumenPostulante: FC<{ postulante: PostulanteCita }> = ({ postulante }) => (
  <section className="cato-card">
    <div className="flex items-center gap-2 mb-3">
      <span className="badge-role-postulante">Postulante</span>
      <span className="text-xs text-cato-muted">{postulante.codigoPostulacion}</span>
    </div>
    <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
      {[
        ['Nombre', postulante.nombreCompleto],
        ['CI', postulante.ci],
        ['Carrera', postulante.carrera],
        ['Edad', `${postulante.edad} años`],
      ].map(([etiqueta, valor]) => (
        <div key={etiqueta}>
          <dt className="text-xs font-semibold text-cato-slate uppercase tracking-wider">{etiqueta}</dt>
          <dd className="mt-1 font-medium text-cato-text">{valor}</dd>
        </div>
      ))}
    </dl>
  </section>
);

const reglaPuntaje = (requerido: boolean) => ({
  required: requerido ? 'Obligatorio' : false,
  validate: (v: string) => {
    if (v.trim() === '') return true;
    const n = Number(v);
    if (Number.isNaN(n) || n < 0 || n > 999.99) return 'Valor entre 0 y 999.99';
    return /^\d+(\.\d{1,2})?$/.test(v.trim()) || 'Máximo 2 decimales';
  },
});

interface PuntajesEsreProps {
  register: UseFormRegister<EsreFormValues>;
  errors: FieldErrors<EsreFormValues>;
}

export const PuntajesEsre: FC<PuntajesEsreProps> = ({ register, errors }) => (
  <section className="cato-card space-y-4">
    <h2 className="text-lg">Puntajes E-SRE</h2>
    <div className="max-w-xs">
      <Input
        label="Puntaje global E-SRE"
        required
        inputMode="decimal"
        error={errors.puntajeGlobalEsre?.message}
        {...register('puntajeGlobalEsre', reglaPuntaje(true))}
      />
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {(
        [
          ['socializacion', 'Socialización'],
          ['eficacia', 'Eficacia'],
          ['proactividad', 'Proactividad'],
          ['gestionPersonal', 'Gestión personal'],
        ] as const
      ).map(([campo, etiqueta]) => (
        <Input
          key={campo}
          label={etiqueta}
          inputMode="decimal"
          error={errors[campo]?.message}
          {...register(campo, reglaPuntaje(false))}
        />
      ))}
    </div>
  </section>
);

interface InformePdfUploadProps {
  nombreEsperado: string;
  archivo: File | null;
  error: string | null;
  informeActual: string | null;
  onSeleccionar: (archivo: File | null) => void;
  onVerActual: () => void;
}

export function validarInforme(archivo: File, nombreEsperado: string): string | null {
  if (archivo.name !== nombreEsperado) return `El archivo debe llamarse exactamente ${nombreEsperado}`;
  if (archivo.type !== 'application/pdf') return 'El archivo debe ser un PDF';
  if (archivo.size > TAMANO_MAXIMO_PDF) return 'El PDF supera el tamaño máximo de 10 MB';
  return null;
}

export const InformePdfUpload: FC<InformePdfUploadProps> = ({
  nombreEsperado,
  archivo,
  error,
  informeActual,
  onSeleccionar,
  onVerActual,
}) => {
  const entrada = useRef<HTMLInputElement>(null);
  return (
    <section className="cato-card space-y-3">
      <h2 className="text-lg">
        Informe psicológico (PDF) {!informeActual && <span className="text-rose-500 text-base">*</span>}
      </h2>
      <p className="text-xs text-cato-muted">
        Nombre obligatorio: <span className="font-mono font-semibold text-cato-slate">{nombreEsperado}</span> · máximo 10 MB
      </p>
      {informeActual && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-cato-border bg-cato-canvas px-3 py-2">
          <FileText className="w-4 h-4 text-cato-navy" />
          <span className="text-sm font-medium">{informeActual}</span>
          <Button type="button" variant="ghost" size="sm" onClick={onVerActual}>
            Ver informe
          </Button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={entrada}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onSeleccionar(e.target.files?.[0] ?? null)}
        />
        <Button type="button" variant="outline" leftIcon={<Upload className="w-4 h-4" />} onClick={() => entrada.current?.click()}>
          {informeActual ? 'Reemplazar PDF' : 'Seleccionar PDF'}
        </Button>
        {archivo && <span className="text-sm text-cato-text">{archivo.name}</span>}
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </section>
  );
};

interface DictamenPsicologicoSelectProps {
  valor: DictamenPsicologico | '';
  onCambiar: (valor: DictamenPsicologico) => void;
  error?: string;
}

export const DictamenPsicologicoSelect: FC<DictamenPsicologicoSelectProps> = ({ valor, onCambiar, error }) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold text-cato-slate uppercase tracking-wider">
      Dictamen clínico / psicológico <span className="text-rose-500">*</span>
    </p>
    <div role="radiogroup" className="grid sm:grid-cols-3 gap-3">
      {(Object.keys(DICTAMEN_PSICOLOGICO) as DictamenPsicologico[]).map((clave) => (
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
          <span className={DICTAMEN_PSICOLOGICO[clave].clase}>{DICTAMEN_PSICOLOGICO[clave].etiqueta}</span>
        </button>
      ))}
    </div>
    {error && <p className="text-xs text-rose-600">{error}</p>}
  </div>
);

interface PoblacionesMultiSelectProps {
  valor: PoblacionSugerida[];
  onCambiar: (valor: PoblacionSugerida[]) => void;
  error?: string;
}

export const PoblacionesMultiSelect: FC<PoblacionesMultiSelectProps> = ({ valor, onCambiar, error }) => {
  const alternar = (codigo: PoblacionSugerida) =>
    onCambiar(valor.includes(codigo) ? valor.filter((v) => v !== codigo) : [...valor, codigo]);
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-cato-slate uppercase tracking-wider">
        Poblaciones sugeridas <span className="text-rose-500">*</span>
      </p>
      <p className="text-xs text-cato-muted">
        Marca las poblaciones para las que el postulante es apto. Las no marcadas se consideran no recomendadas en la
        Ubicación de Voluntarios.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {POBLACIONES.map((p) => {
          const marcada = valor.includes(p.codigo);
          return (
            <label
              key={p.codigo}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors',
                marcada ? 'border-cato-navy bg-cato-gold-light text-cato-navy font-medium' : 'border-cato-border bg-white',
              )}
            >
              <input type="checkbox" checked={marcada} onChange={() => alternar(p.codigo)} className="accent-cato-navy" />
              {p.etiqueta}
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
};

export const ObservacionesConfidenciales: FC<{ register: UseFormRegister<EsreFormValues> }> = ({ register }) => (
  <section className="cato-card space-y-3 border-cato-navy">
    <h2 className="text-lg flex items-center gap-2">
      <Lock className="w-4 h-4" /> Observaciones restringidas
    </h2>
    <p className="text-xs text-cato-muted">Confidencial: solo visible para Administración Pastoral.</p>
    <AreaTexto rows={5} {...register('observacionesConfidenciales')} />
  </section>
);
