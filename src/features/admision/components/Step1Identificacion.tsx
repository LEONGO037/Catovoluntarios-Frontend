import React, { useState } from 'react';
import type { PostulacionFormData, TipoRelacionUcb } from '../types/postulacion.types';
import { CARRERAS_UCB } from '../constants/carreras';
import { ZONAS_RESIDENCIA, EXPEDIDOS_CI } from '../constants/zonas';
import { TIPOS_RELACION_UCB } from '../constants/admision.constants';
import { EMAIL_REGEX, CELULAR_REGEX } from '../hooks/usePostulacionForm';
import { User, Mail, Phone, Calendar, GraduationCap, MapPin, Building2, CheckCircle2 } from 'lucide-react';

interface Step1Props {
  formData: PostulacionFormData;
  updateField: <K extends keyof PostulacionFormData>(
    campo: K,
    valor: PostulacionFormData[K],
  ) => void;
  esRolNoEstudiantil: boolean;
  zonaEspecifica: string;
  setZonaEspecifica: (val: string) => void;
}

export const Step1Identificacion: React.FC<Step1Props> = ({
  formData,
  updateField,
  esRolNoEstudiantil,
  zonaEspecifica,
  setZonaEspecifica,
}) => {
  const [tocadoEmail, setTocadoEmail] = useState(false);
  const [tocadoCelular, setTocadoCelular] = useState(false);
  const [codigoPais, setCodigoPais] = useState('+591');

  const emailValido = EMAIL_REGEX.test(formData.correoElectronico.trim());
  const celularValido = CELULAR_REGEX.test(formData.celular);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-cato-navy flex items-center gap-2">
          <User className="w-5 h-5 text-cato-steel" />
          Paso 1: Identificación y Datos Personales
        </h2>
        <p className="text-sm text-cato-muted mt-1">
          Ingresa tus datos personales para tu registro en Pastoral Universitaria UCB.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Relación con la UCB */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-cato-slate uppercase mb-1">
            Relación Institucional con la UCB *
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={formData.tipoRelacionUcb}
              onChange={(e) => updateField('tipoRelacionUcb', e.target.value as TipoRelacionUcb)}
              className="cato-input pl-9 bg-white text-xs font-medium"
            >
              {TIPOS_RELACION_UCB.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>
          {esRolNoEstudiantil && (
            <p className="text-[11px] text-blue-700 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline" />
              Al postular como familiar o externo, no requieres seleccionar una carrera universitaria.
            </p>
          )}
        </div>

        {/* Nombres */}
        <div>
          <label className="block text-xs font-semibold text-cato-slate uppercase mb-1">
            Nombres *
          </label>
          <input
            type="text"
            value={formData.nombres}
            onChange={(e) => updateField('nombres', e.target.value)}
            placeholder="Ej. Juan Carlos"
            className="cato-input"
            required
          />
        </div>

        {/* Primer Apellido */}
        <div>
          <label className="block text-xs font-semibold text-cato-slate uppercase mb-1">
            Primer Apellido *
          </label>
          <input
            type="text"
            value={formData.primerApellido}
            onChange={(e) => updateField('primerApellido', e.target.value)}
            placeholder="Ej. Pérez"
            className="cato-input"
            required
          />
        </div>

        {/* Segundo Apellido */}
        <div>
          <label className="block text-xs font-semibold text-cato-slate uppercase mb-1">
            Segundo Apellido
          </label>
          <input
            type="text"
            value={formData.segundoApellido || ''}
            onChange={(e) => updateField('segundoApellido', e.target.value)}
            placeholder="Ej. Gómez (opcional)"
            className="cato-input"
          />
        </div>

        {/* Tipo de Documento, Número y Expedición */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-cato-slate uppercase mb-1 whitespace-nowrap">
              Tipo Doc. *
            </label>
            <select
              value={formData.tipoDocumento || 'CI'}
              onChange={(e) =>
                updateField('tipoDocumento', e.target.value as 'CI' | 'PASAPORTE')
              }
              className="cato-input bg-white text-xs font-semibold"
            >
              <option value="CI">C.I.</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
          </div>
          <div className={formData.tipoDocumento === 'PASAPORTE' ? 'sm:col-span-9' : 'sm:col-span-6'}>
            <label className="block text-xs font-semibold text-cato-slate uppercase mb-1 whitespace-nowrap truncate">
              {formData.tipoDocumento === 'PASAPORTE'
                ? 'N° Pasaporte *'
                : 'N° de C.I. *'}
            </label>
            <input
              type="text"
              value={formData.ci}
              onChange={(e) =>
                updateField('ci', e.target.value.replace(/\s+/g, '').toUpperCase())
              }
              placeholder={
                formData.tipoDocumento === 'PASAPORTE' ? 'Ej. PA894512B' : 'Ej. 8421455'
              }
              className="cato-input"
              required
            />
          </div>
          {formData.tipoDocumento !== 'PASAPORTE' && (
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-cato-slate uppercase mb-1 whitespace-nowrap">
                Expedido *
              </label>
              <select
                value={formData.expedido}
                onChange={(e) => updateField('expedido', e.target.value)}
                className="cato-input bg-white text-xs font-semibold"
              >
                {EXPEDIDOS_CI.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Fecha de Nacimiento y Edad Autocalculada */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-cato-slate uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Fecha de Nacimiento *
            </label>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                formData.edad < 18
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {formData.edad ? `${formData.edad} años` : '-- años'}{' '}
              {formData.edad < 18 ? '(Menor de edad)' : ''}
            </span>
          </div>
          <input
            type="date"
            value={formData.fechaNacimiento}
            onChange={(e) => updateField('fechaNacimiento', e.target.value)}
            className="cato-input"
            required
          />
          {formData.edad < 18 && (
            <p className="text-[11px] text-amber-800 mt-1">
              Nota: Al ser menor de 18 años, se solicitará la confirmación de autorización de tus padres.
            </p>
          )}
        </div>

        {/* Celular WhatsApp con Validación Flexible (Nacional / Internacional) */}
        <div>
          <label className="block text-xs font-semibold text-cato-slate uppercase mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Celular (WhatsApp de Contacto) *
          </label>
          <div className="flex">
            <input
              type="text"
              maxLength={5}
              value={codigoPais}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9+]/g, '');
                setCodigoPais(val.startsWith('+') ? val : `+${val}`);
              }}
              aria-label="Código de país"
              className="w-16 text-center px-2 text-xs text-slate-700 bg-slate-100 border border-r-0 border-cato-input rounded-l-md font-semibold focus:outline-none focus:bg-white"
            />
            <input
              type="tel"
              maxLength={15}
              value={formData.celular}
              onBlur={() => setTocadoCelular(true)}
              onChange={(e) => updateField('celular', e.target.value.replace(/\D/g, ''))}
              placeholder="Ej. 70000000 o 56981236"
              className={`cato-input rounded-l-none ${
                tocadoCelular && !celularValido && formData.celular
                  ? 'border-red-400 bg-red-50/30'
                  : ''
              }`}
              required
            />
          </div>
          {tocadoCelular && !celularValido && formData.celular && (
            <p className="text-[11px] text-red-600 mt-1">
              Ingresa un número de celular válido (entre 7 y 15 dígitos).
            </p>
          )}
        </div>

        {/* Correo Electrónico con Validación Estricta RFC 5322 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-cato-slate uppercase mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Correo Electrónico (Institucional o Personal) *
          </label>
          <input
            type="email"
            value={formData.correoElectronico}
            onBlur={() => setTocadoEmail(true)}
            onChange={(e) => updateField('correoElectronico', e.target.value.trim())}
            placeholder="ejemplo@ucb.edu.bo o usuario@gmail.com"
            className={`cato-input ${
              tocadoEmail && !emailValido && formData.correoElectronico
                ? 'border-red-400 bg-red-50/30'
                : ''
            }`}
            required
          />
          {tocadoEmail && !emailValido && formData.correoElectronico && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">
              Por favor, ingresa una dirección con formato de correo completo (ej. usuario@dominio.com).
            </p>
          )}
        </div>

        {/* Carrera UCB (30 opciones oficiales o N/A para familiares/externos) */}
        <div>
          <label className="block text-xs font-semibold text-cato-slate uppercase mb-1 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            Carrera (Regional La Paz) *
          </label>
          {esRolNoEstudiantil ? (
            <input
              type="text"
              disabled
              value="No Aplica (Externo / Familiar)"
              className="cato-input bg-slate-100 text-slate-500 cursor-not-allowed text-xs font-medium"
            />
          ) : (
            <select
              value={formData.carrera}
              onChange={(e) => updateField('carrera', e.target.value)}
              className="cato-input bg-white text-xs font-medium"
            >
              {CARRERAS_UCB.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Zona de Residencia con Opción 'Otro' */}
        <div>
          <label className="block text-xs font-semibold text-cato-slate uppercase mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Zona de Residencia *
          </label>
          <select
            value={
              formData.zonaResidencia.startsWith('Otro:')
                ? 'Otro (Especificar)'
                : formData.zonaResidencia
            }
            onChange={(e) => updateField('zonaResidencia', e.target.value)}
            className="cato-input bg-white text-xs font-medium"
          >
            {ZONAS_RESIDENCIA.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>

          {/* Campo libre cuando selecciona 'Otro' */}
          {(formData.zonaResidencia === 'Otro (Especificar)' ||
            formData.zonaResidencia.startsWith('Otro:')) && (
            <div className="mt-2 animate-in fade-in duration-150">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Especifica tu zona, barrio o municipio: *
              </label>
              <input
                type="text"
                value={zonaEspecifica}
                onChange={(e) => setZonaEspecifica(e.target.value)}
                placeholder="Ej. Mecapaca, Ciudad Satélite Plan 400, etc."
                className="cato-input text-xs"
                required
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
