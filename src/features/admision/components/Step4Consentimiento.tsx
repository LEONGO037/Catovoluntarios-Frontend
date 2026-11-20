import React from 'react';
import type { PostulacionFormData } from '../types/postulacion.types';
import {
  ShieldAlert,
  CheckCircle2,
  FileCheck,
  UserCheck,
  HeartHandshake,
} from 'lucide-react';

interface Step4Props {
  formData: PostulacionFormData;
  updateField: <K extends keyof PostulacionFormData>(
    campo: K,
    valor: PostulacionFormData[K],
  ) => void;
  esMenorDeEdad: boolean;
}

export const Step4Consentimiento: React.FC<Step4Props> = ({
  formData,
  updateField,
  esMenorDeEdad,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-cato-navy flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cato-steel" />
          Paso 4: Consentimiento y Compromiso
        </h2>
        <p className="text-sm text-cato-muted mt-1">
          Último paso: Revisa los compromisos formativos y confirma tu postulación.
        </p>
      </div>

      {/* Sección especial para menores de 18 años */}
      {esMenorDeEdad && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
              Autorización Requerida para Menores de Edad
            </h3>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Al registrar una edad de <strong>{formData.edad} años</strong>, es un requisito legal y de resguardo institucional de la Universidad Católica Boliviana contar con el consentimiento explícito de tus padres o tutores legales antes de participar en actividades comunitarias.
          </p>

          <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-amber-200 cursor-pointer shadow-xs hover:border-amber-300 transition-colors">
            <input
              type="checkbox"
              checked={formData.autorizacionPadresConfirmada}
              onChange={(e) => updateField('autorizacionPadresConfirmada', e.target.checked)}
              className="accent-cato-navy w-5 h-5 mt-0.5 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-800 leading-normal">
              Declaro que mis padres o tutores legales están en pleno conocimiento y autorizan expresamente mi participación activa en las actividades del Programa Catovoluntarios de Pastoral UCB. *
            </span>
          </label>
        </div>
      )}

      {/* Checks de Compromiso Pastoral */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-cato-slate uppercase flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-slate-400" />
          Compromisos Formativos del Catovoluntario
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Disponibilidad horaria:</strong> Me comprometo a dedicar 4 horas presenciales semanales al proyecto comunitario que se me asigne durante el semestre académico.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Inducción y Capacitación:</strong> Asistiré a la jornada formativa institucional previa al inicio de actividades en campo.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Seguro Estudiantil:</strong> Presentaré la Póliza de Seguro de Accidentes Personales UCB vigente antes del ingreso al centro receptor.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.compromisoAceptado}
              onChange={(e) => updateField('compromisoAceptado', e.target.checked)}
              className="accent-cato-navy w-5 h-5 mt-0.5 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-cato-navy">
              Acepto los términos, compromisos formativos y el tratamiento de mis datos personales en el marco de las actividades de Pastoral Universitaria UCB Regional La Paz. *
            </span>
          </label>
        </div>
      </div>

      {/* Resumen Final de Datos Clave */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-cato-slate space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-cato-navy mb-1">
          <UserCheck className="w-4 h-4 text-cato-navy" />
          <span>Resumen de tu postulación:</span>
        </div>
        <p>
          • Postulante: <strong>{formData.nombres} {formData.primerApellido} {formData.segundoApellido || ''}</strong> (C.I.: {formData.ci} {formData.expedido})
        </p>
        <p>
          • Carrera: <strong>{formData.carrera}</strong> | Carga declarada: <strong>{formData.numeroMaterias} materias</strong>
        </p>
        <p>
          • Celular: <strong>+591 {formData.celular}</strong> | Correo: <strong>{formData.correoElectronico}</strong>
        </p>
      </div>
    </div>
  );
};
