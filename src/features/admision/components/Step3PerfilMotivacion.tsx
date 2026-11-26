import React from 'react';
import type { PostulacionFormData } from '../types/postulacion.types';
import {
  POBLACIONES_INTERES,
  HABILIDADES_DISPONIBLES,
} from '../constants/admision.constants';
import {
  Sparkles,
  Heart,
  Baby,
  Users,
  Home,
  Accessibility,
  Activity,
  Trees,
  Check,
  Plus,
  Smile,
  ShieldCheck,
} from 'lucide-react';

interface Step3Props {
  formData: PostulacionFormData;
  updateField: <K extends keyof PostulacionFormData>(
    campo: K,
    valor: PostulacionFormData[K],
  ) => void;
}

export const Step3PerfilMotivacion: React.FC<Step3Props> = ({
  formData,
  updateField,
}) => {
  const toggleHabilidad = (habilidad: string) => {
    const actual = formData.habilidadesDestacadas;
    const existe = actual.includes(habilidad);
    const nueva = existe
      ? actual.filter((h) => h !== habilidad)
      : [...actual, habilidad];
    updateField('habilidadesDestacadas', nueva);
  };

  const togglePoblacion = (poblacion: string) => {
    const actual = formData.poblacionesInteres;
    const existe = actual.includes(poblacion);
    const nueva = existe
      ? actual.filter((p) => p !== poblacion)
      : [...actual, poblacion];
    updateField('poblacionesInteres', nueva);
  };

  const setPalabraPersonalidad = (indice: number, valor: string) => {
    const palabras = [...formData.tresPalabrasPersonalidad] as [string, string, string];
    palabras[indice] = valor;
    updateField('tresPalabrasPersonalidad', palabras);
  };

  const getPoblacionIcon = (id: string) => {
    switch (id) {
      case 'Niños y primera infancia':
        return <Baby className="w-5 h-5 text-blue-600" />;
      case 'Adultos mayores':
        return <Users className="w-5 h-5 text-emerald-600" />;
      case 'Personas en situación de calle / adicciones':
        return <Home className="w-5 h-5 text-amber-600" />;
      case 'Personas con discapacidad':
        return <Accessibility className="w-5 h-5 text-purple-600" />;
      case 'Salud y hospitales':
        return <Activity className="w-5 h-5 text-rose-600" />;
      case 'Cuidado animal y medio ambiente':
      default:
        return <Trees className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-cato-navy flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cato-steel" />
          Paso 3: Perfil, Vocación y Habilidades
        </h2>
        <p className="text-sm text-cato-muted mt-1">
          Queremos conocer tus talentos y áreas de mayor interés para acompañar tu vocación de servicio.
        </p>
      </div>

      {/* Experiencia Previa */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
        <label className="block text-sm font-bold text-cato-slate">
          ¿Tienes experiencia previa en voluntariado o servicio social? *
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
            <input
              type="radio"
              name="experienciaPrevia"
              checked={formData.experienciaVoluntariadoPrevia}
              onChange={() => updateField('experienciaVoluntariadoPrevia', true)}
              className="accent-cato-navy w-4 h-4"
            />
            Sí, he realizado voluntariado antes
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
            <input
              type="radio"
              name="experienciaPrevia"
              checked={!formData.experienciaVoluntariadoPrevia}
              onChange={() => {
                updateField('experienciaVoluntariadoPrevia', false);
                updateField('detalleExperiencia', '');
              }}
              className="accent-cato-navy w-4 h-4"
            />
            No, es mi primera vez postulando
          </label>
        </div>

        {formData.experienciaVoluntariadoPrevia && (
          <div className="mt-2 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-cato-slate uppercase mb-1">
              ¿En qué institución o proyecto participaste y qué labor desempeñabas?
            </label>
            <input
              type="text"
              value={formData.detalleExperiencia || ''}
              onChange={(e) => updateField('detalleExperiencia', e.target.value)}
              placeholder="Ej. Misiones rurales, Scouts, Comedor San Calixto (6 meses)..."
              className="cato-input text-xs"
            />
          </div>
        )}
      </div>

      {/* Habilidades Destacadas */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-cato-slate flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-slate-400" />
          Habilidades y Talentos que te gustaría compartir (selecciona las que apliquen):
        </label>
        <div className="flex flex-wrap gap-2 pt-1">
          {HABILIDADES_DISPONIBLES.map((hab) => {
            const seleccionada = formData.habilidadesDestacadas.includes(hab);
            return (
              <button
                key={hab}
                type="button"
                onClick={() => toggleHabilidad(hab)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  seleccionada
                    ? 'bg-cato-navy text-cato-gold ring-2 ring-cato-navy shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {seleccionada ? (
                  <Check className="w-3.5 h-3.5 text-cato-gold" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
                {hab}
              </button>
            );
          })}
        </div>

        {formData.habilidadesDestacadas.includes('Otros') && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-cato-slate uppercase mb-1">
              Especifica tus otras habilidades o talentos adicionales: *
            </label>
            <input
              type="text"
              value={formData.habilidadesOtras || ''}
              onChange={(e) => updateField('habilidadesOtras', e.target.value)}
              placeholder="Ej. Confección de pelucas, robótica educativa, lengua de señas..."
              className="cato-input text-xs"
              required
            />
          </div>
        )}
      </div>

      {/* 3 Palabras de Personalidad */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-cato-slate flex items-center gap-1.5">
          <Smile className="w-4 h-4 text-slate-400" />
          3 palabras que describan tu personalidad o forma de ser: *
        </label>
        <p className="text-xs text-slate-500">
          Ingresa 3 virtudes o rasgos que te caractericen como persona.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={formData.tresPalabrasPersonalidad[0]}
            onChange={(e) => setPalabraPersonalidad(0, e.target.value)}
            placeholder="1. Ej. Paciente"
            className="cato-input"
            required
          />
          <input
            type="text"
            value={formData.tresPalabrasPersonalidad[1]}
            onChange={(e) => setPalabraPersonalidad(1, e.target.value)}
            placeholder="2. Ej. Alegre"
            className="cato-input"
            required
          />
          <input
            type="text"
            value={formData.tresPalabrasPersonalidad[2]}
            onChange={(e) => setPalabraPersonalidad(2, e.target.value)}
            placeholder="3. Ej. Comprometido"
            className="cato-input"
            required
          />
        </div>
      </div>

      {/* Poblaciones de Interés */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-cato-slate flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          ¿Con qué poblaciones te sentirías más motivado/a para servir? (Selecciona al menos una) *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {POBLACIONES_INTERES.map((pob) => {
            const check = formData.poblacionesInteres.includes(pob.id);
            return (
              <div
                key={pob.id}
                onClick={() => togglePoblacion(pob.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  check
                    ? 'border-cato-navy bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {getPoblacionIcon(pob.id)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-cato-navy">{pob.label}</h4>
                      <input
                        type="checkbox"
                        checked={check}
                        onChange={() => {}} // Manejado por el onClick del contenedor
                        className="accent-cato-navy w-4 h-4 rounded"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pob.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alergias / Precauciones */}
      <div>
        <label className="block text-xs font-semibold text-cato-slate uppercase mb-1">
          Alergias o condiciones médicas que debamos tener en cuenta:
        </label>
        <textarea
          rows={2}
          value={formData.alergiasCondicionesMedicas || ''}
          onChange={(e) => updateField('alergiasCondicionesMedicas', e.target.value)}
          placeholder="Ej. Alergia al polvo, asma, intolerancia, ninguna..."
          className="cato-input py-2 h-auto text-xs"
        />
      </div>
    </div>
  );
};
