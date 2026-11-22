import { useState, useMemo, useCallback } from 'react';
import type { PostulacionFormData, TipoRelacionUcb } from '../types/postulacion.types';

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const CELULAR_REGEX = /^[67]\d{7}$/;

export const INITIAL_FORM_DATA: PostulacionFormData = {
  tipoRelacionUcb: 'Estudiante Regular',
  nombres: '',
  primerApellido: '',
  segundoApellido: '',
  ci: '',
  complemento: '',
  expedido: 'LP',
  fechaNacimiento: '',
  edad: 20,
  celular: '',
  correoElectronico: '',
  carrera: 'Ingeniería de Sistemas',
  zonaResidencia: 'Centro / San Jorge / Sopocachi',

  numeroMaterias: 5,
  tieneMateriasPesadas: false,
  detalleMateriasPesadas: '',
  actividadesExtracurriculares: 0,
  detalleActividades: '',

  experienciaVoluntariadoPrevia: false,
  detalleExperiencia: '',
  habilidadesDestacadas: [],
  conocimientoComputacion: true,
  tresPalabrasPersonalidad: ['', '', ''],
  alergiasCondicionesMedicas: '',
  poblacionesInteres: ['Niños y primera infancia'],

  requiereAutorizacionPadres: false,
  autorizacionPadresConfirmada: false,
  compromisoAceptado: true,
};

export function calcularEdadDesdeFecha(fechaIso: string): number {
  if (!fechaIso) return 0;
  const [y, m, d] = fechaIso.split('-').map(Number);
  const nacimiento = new Date(y, m - 1, d);
  const hoy = new Date();
  const diffMs = hoy.getTime() - nacimiento.getTime();
  if (isNaN(diffMs) || diffMs < 0) return 0;
  return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
}

export function usePostulacionForm() {
  const [pasoActual, setPasoActual] = useState<number>(1);
  const [formData, setFormData] = useState<PostulacionFormData>(INITIAL_FORM_DATA);
  const [zonaEspecifica, setZonaEspecifica] = useState<string>('');

  // Modal de notificación profesional (reemplaza alert nativo)
  const [notificacion, setNotificacion] = useState<{
    abierto: boolean;
    tipo: 'error' | 'warning' | 'success' | 'info';
    titulo: string;
    mensaje: string;
  }>({
    abierto: false,
    tipo: 'warning',
    titulo: '',
    mensaje: '',
  });

  const mostrarNotificacion = useCallback(
    (titulo: string, mensaje: string, tipo: 'error' | 'warning' | 'success' | 'info' = 'warning') => {
      setNotificacion({
        abierto: true,
        tipo,
        titulo,
        mensaje,
      });
    },
    [],
  );

  const cerrarNotificacion = useCallback(() => {
    setNotificacion((prev) => ({ ...prev, abierto: false }));
  }, []);

  const esRolNoEstudiantil = useMemo(() => {
    return (
      formData.tipoRelacionUcb === 'Familiar de personal UCB' ||
      formData.tipoRelacionUcb === 'Externo autorizado'
    );
  }, [formData.tipoRelacionUcb]);

  const updateField = useCallback(
    <K extends keyof PostulacionFormData>(campo: K, valor: PostulacionFormData[K]) => {
      setFormData((prev) => {
        const updated = { ...prev, [campo]: valor };

        if (campo === 'tipoRelacionUcb') {
          const val = valor as TipoRelacionUcb;
          if (val === 'Familiar de personal UCB' || val === 'Externo autorizado') {
            updated.carrera = 'N/A';
          } else if (prev.carrera === 'N/A') {
            updated.carrera = 'Ingeniería de Sistemas';
          }
        }

        if (campo === 'fechaNacimiento' && typeof valor === 'string') {
          const edadCalculada = calcularEdadDesdeFecha(valor);
          updated.edad = edadCalculada;
          updated.requiereAutorizacionPadres = edadCalculada < 18;
          if (edadCalculada >= 18) {
            updated.autorizacionPadresConfirmada = false;
          }
        }

        return updated;
      });
    },
    [],
  );

  const tieneSobrecarga = useMemo(() => formData.numeroMaterias > 6, [formData.numeroMaterias]);
  const esMenorDeEdad = useMemo(() => formData.edad < 18, [formData.edad]);

  const validarPasoActual = useCallback((): { valido: boolean; titulo?: string; mensaje?: string } => {
    if (pasoActual === 1) {
      if (!formData.nombres.trim() || !formData.primerApellido.trim()) {
        return {
          valido: false,
          titulo: 'Datos Incompletos',
          mensaje: 'Por favor, ingresa tus nombres y primer apellido para continuar.',
        };
      }
      if (!formData.ci.trim() || formData.ci.trim().length < 5) {
        return {
          valido: false,
          titulo: 'Documento de Identidad',
          mensaje: 'El Carnet de Identidad debe contener al menos 5 caracteres válidos.',
        };
      }
      if (!formData.fechaNacimiento) {
        return {
          valido: false,
          titulo: 'Fecha de Nacimiento',
          mensaje: 'Por favor, selecciona tu fecha de nacimiento.',
        };
      }
      if (!CELULAR_REGEX.test(formData.celular)) {
        return {
          valido: false,
          titulo: 'Número Celular Inválido',
          mensaje: 'El celular debe tener 8 dígitos y comenzar con 6 o 7 para contacto de WhatsApp.',
        };
      }
      if (!EMAIL_REGEX.test(formData.correoElectronico.trim())) {
        return {
          valido: false,
          titulo: 'Correo Electrónico Inválido',
          mensaje: 'Ingresa una dirección de correo válida con dominio completo (ej. nombre@dominio.com o nombre@ucb.edu.bo).',
        };
      }
      if (formData.zonaResidencia === 'Otro (Especificar)' && !zonaEspecifica.trim()) {
        return {
          valido: false,
          titulo: 'Zona de Residencia',
          mensaje: 'Por favor, especifica el nombre de tu zona o barrio de residencia.',
        };
      }
      return { valido: true };
    }

    if (pasoActual === 2) {
      if (formData.numeroMaterias > 6) {
        return {
          valido: false,
          titulo: 'Límite de Materias Excedido',
          mensaje:
            'La normativa de Pastoral UCB establece un máximo de 6 materias inscritas para postular al voluntariado. Te invitamos a ajustar tu selección para continuar.',
        };
      }
      if (formData.tieneMateriasPesadas && !formData.detalleMateriasPesadas?.trim()) {
        return {
          valido: false,
          titulo: 'Detalle de Materias',
          mensaje: 'Por favor, describe brevemente cuáles materias consideras de alta exigencia.',
        };
      }
      return { valido: true };
    }

    if (pasoActual === 3) {
      if (formData.poblacionesInteres.length === 0) {
        return {
          valido: false,
          titulo: 'Poblaciones de Servicio',
          mensaje: 'Selecciona al menos una población con la que te sientas motivado/a a servir.',
        };
      }
      const [p1, p2, p3] = formData.tresPalabrasPersonalidad;
      if (!p1.trim() || !p2.trim() || !p3.trim()) {
        return {
          valido: false,
          titulo: 'Palabras de Personalidad',
          mensaje: 'Completa las 3 palabras que mejor describan tu personalidad o forma de ser.',
        };
      }
      return { valido: true };
    }

    if (pasoActual === 4) {
      if (esMenorDeEdad && !formData.autorizacionPadresConfirmada) {
        return {
          valido: false,
          titulo: 'Consentimiento Parental Requerido',
          mensaje: 'Para menores de 18 años es indispensable confirmar la autorización de tus padres o tutores legales.',
        };
      }
      if (!formData.compromisoAceptado) {
        return {
          valido: false,
          titulo: 'Compromiso Pastoral',
          mensaje: 'Debes aceptar los términos y compromisos formativos del programa para enviar tu postulación.',
        };
      }
      return { valido: true };
    }

    return { valido: true };
  }, [pasoActual, formData, esMenorDeEdad, zonaEspecifica]);

  const avanzarPaso = useCallback(() => {
    const res = validarPasoActual();
    if (!res.valido) {
      mostrarNotificacion(res.titulo || 'Atención', res.mensaje || 'Verifica los campos obligatorios');
      return false;
    }

    // Si seleccionó zona otro, consolidarla
    if (pasoActual === 1 && formData.zonaResidencia === 'Otro (Especificar)' && zonaEspecifica.trim()) {
      updateField('zonaResidencia', `Otro: ${zonaEspecifica.trim()}`);
    }

    setPasoActual((p) => Math.min(p + 1, 4));
    return true;
  }, [validarPasoActual, mostrarNotificacion, pasoActual, formData.zonaResidencia, zonaEspecifica, updateField]);

  const retrocederPaso = useCallback(() => {
    setPasoActual((p) => Math.max(p - 1, 1));
  }, []);

  return {
    pasoActual,
    setPasoActual,
    formData,
    updateField,
    zonaEspecifica,
    setZonaEspecifica,
    tieneSobrecarga,
    esMenorDeEdad,
    esRolNoEstudiantil,
    notificacion,
    mostrarNotificacion,
    cerrarNotificacion,
    validarPasoActual,
    avanzarPaso,
    retrocederPaso,
  };
}
