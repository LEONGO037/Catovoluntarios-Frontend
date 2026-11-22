import React from 'react';
import type { PostulacionFormData } from '../types/postulacion.types';
import { BookOpen, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { NotificationModal } from '../../../components/feedback/NotificationModal';

interface Step2Props {
  formData: PostulacionFormData;
  updateField: <K extends keyof PostulacionFormData>(
    campo: K,
    valor: PostulacionFormData[K],
  ) => void;
  alertaSobrecargaAbierta: boolean;
  setAlertaSobrecargaAbierta: (abierta: boolean) => void;
}

export const Step2FiltroAcademico: React.FC<Step2Props> = ({
  formData,
  updateField,
  alertaSobrecargaAbierta,
  setAlertaSobrecargaAbierta,
}) => {
  const tieneSobrecarga = formData.numeroMaterias > 6;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-cato-navy flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cato-steel" />
          Paso 2: Carga Académica y Disponibilidad
        </h2>
        <p className="text-sm text-cato-muted mt-1">
          El voluntariado es formativo y promovemos el equilibrio indispensable con tu rendimiento universitario.
        </p>
      </div>

      {/* Control de Materias con Slider Fluido y Medidor Visual */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-cato-slate">
            ¿Cuántas materias tienes inscritas en el semestre actual? *
          </label>
          <span className="text-xs text-slate-500 font-medium">Límite pastoral: 6 materias</span>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={formData.numeroMaterias}
            onChange={(e) => updateField('numeroMaterias', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cato-navy"
          />
          <div
            className={`w-14 h-12 rounded-xl flex items-center justify-center font-bold text-xl border transition-all duration-200 shadow-xs ${
              tieneSobrecarga
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            {formData.numeroMaterias}
          </div>
        </div>

        {/* Medidor Visual Reactivo (Sin popups intrusivos mientras se arrastra) */}
        {tieneSobrecarga ? (
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-900 text-xs flex items-start gap-3 animate-in fade-in duration-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-amber-950">
                Observación por Carga Académica Elevada
              </p>
              <p className="leading-relaxed">
                Has seleccionado <strong>{formData.numeroMaterias} materias</strong>. La normativa de Pastoral Universitaria UCB establece un máximo de <strong>6 materias</strong> para asegurar que puedas cumplir con las 4 horas semanales de servicio sin comprometer tus materias.
              </p>
              <button
                type="button"
                onClick={() => setAlertaSobrecargaAbierta(true)}
                className="mt-1 text-xs font-bold text-cato-navy underline hover:text-cato-navy-dark"
              >
                Ver alternativas de ajuste y orientación pastoral
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">Carga compatible con el voluntariado</p>
              <p className="text-emerald-800 mt-0.5">
                Cursar {formData.numeroMaterias} materia(s) permite un balance óptimo entre tu formación académica y las actividades en el proyecto receptor.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Materias de Alta Exigencia */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-cato-slate">
          ¿Cursas alguna materia considerada de alta exigencia (taller de grado, laboratorio crítico o prácticas)? *
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
            <input
              type="radio"
              name="tieneMateriasPesadas"
              checked={formData.tieneMateriasPesadas}
              onChange={() => updateField('tieneMateriasPesadas', true)}
              className="accent-cato-navy w-4 h-4"
            />
            Sí, curso materias de alta exigencia
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
            <input
              type="radio"
              name="tieneMateriasPesadas"
              checked={!formData.tieneMateriasPesadas}
              onChange={() => {
                updateField('tieneMateriasPesadas', false);
                updateField('detalleMateriasPesadas', '');
              }}
              className="accent-cato-navy w-4 h-4"
            />
            No, es una carga estándar
          </label>
        </div>

        {formData.tieneMateriasPesadas && (
          <div className="mt-2 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-cato-slate uppercase mb-1">
              Especifica qué materias consideras de alta exigencia: *
            </label>
            <textarea
              rows={2}
              value={formData.detalleMateriasPesadas || ''}
              onChange={(e) => updateField('detalleMateriasPesadas', e.target.value)}
              placeholder="Ej. Taller de Grado I, Circuitos II, Prácticas Hospitalarias..."
              className="cato-input py-2 h-auto text-xs"
            />
          </div>
        )}
      </div>

      {/* Actividades Extracurriculares */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-cato-slate flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-slate-400" />
          ¿En cuántas actividades extracurriculares adicionales participas actualmente?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { valor: 0, label: 'Ninguna (0)' },
            { valor: 1, label: '1 Actividad' },
            { valor: 2, label: '2 o más actividades' },
          ].map((item) => (
            <button
              key={item.valor}
              type="button"
              onClick={() => updateField('actividadesExtracurriculares', item.valor)}
              className={`p-3 text-xs font-bold rounded-xl border text-center transition-all ${
                formData.actividadesExtracurriculares === item.valor
                  ? 'bg-cato-navy text-white border-cato-navy shadow-sm'
                  : 'bg-white text-cato-slate border-cato-border hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {formData.actividadesExtracurriculares > 1 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              La dedicación a múltiples actividades se dialogará en tu entrevista para organizar tus horarios de servicio.
            </span>
          </div>
        )}

        {formData.actividadesExtracurriculares > 0 && (
          <div className="mt-2 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-cato-slate uppercase mb-1">
              Menciona brevemente tus otras actividades:
            </label>
            <input
              type="text"
              value={formData.detalleActividades || ''}
              onChange={(e) => updateField('detalleActividades', e.target.value)}
              placeholder="Ej. Elenco de Teatro UCB, Auxiliatura de docencia, Deportes..."
              className="cato-input text-xs"
            />
          </div>
        )}
      </div>

      {/* Modal Amigable de Orientación de Sobrecarga (reemplaza modal tosco) */}
      <NotificationModal
        abierto={alertaSobrecargaAbierta}
        tipo="warning"
        titulo="Política de Prevención de Sobrecarga Académica"
        mensaje={`Has seleccionado ${formData.numeroMaterias} materias. Para resguardar tu bienestar integral y desempeño universitario, Pastoral UCB promueve no superar las 6 materias. ¿Deseas ajustar tu postulación a 6 materias para continuar?`}
        textoBoton="Ajustar a 6 materias y continuar"
        onCerrar={() => setAlertaSobrecargaAbierta(false)}
        onConfirmar={() => {
          updateField('numeroMaterias', 6);
          setAlertaSobrecargaAbierta(false);
        }}
      />
    </div>
  );
};
