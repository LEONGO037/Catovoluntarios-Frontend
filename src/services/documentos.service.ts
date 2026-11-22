import { apiClient } from './api.client';
import type {
  VoluntarioExpediente,
  ParticipanteInduccion,
  SesionInduccion,
  DocumentoVoluntario,
  EstadoDocumento,
  EstadoInduccion,
} from '../types/documentos.types';

// Mock data fiel a los mockups P-10, P-11 y P-12
const INITIAL_EXPEDIENTES: VoluntarioExpediente[] = [
  {
    id: 1,
    ci: '9420187 LP',
    nombreCompleto: 'María Fernanda Rojas',
    nombres: 'María Fernanda',
    primerApellido: 'Rojas',
    segundoApellido: 'Paz',
    email: 'maria.rojas@ucb.edu.bo',
    telefono: '76512345',
    carrera: 'Psicología - 3er Semestre',
    semestreCarrera: '3er Semestre',
    edad: 17,
    esMenor: true,
    rol: 'VOLUNTARIO',
    proyectoAsignado: 'Hogar San Ramón - Área Memoria',
    catoliderAsignado: 'Valeria Sanjinés',
    polizaValidada: false,
    induccionCompletada: false,
    habilitadoCampo: false,
    estadoGeneral: 'PENDIENTE',
    documentos: [
      {
        id: 101,
        tipoDocumento: 'POLIZA_ACCIDENTES_APC7083',
        archivoUrl: '/docs/mock/poliza_maria_rojas.pdf',
        nombreArchivoOriginal: 'poliza_maria_rojas.pdf',
        tamanio: '1.8 MB',
        fechaSubida: '08/09/2026',
        numeroPoliza: 'APC-7083',
        idPoliza: 'POL-2026-0814',
        numeroCertificado: 'CERT-11408',
        vigenciaInicio: '2026-08-01',
        vigenciaFin: '2027-07-31',
        asegurado: 'María Fernanda Rojas',
        estado: 'PENDIENTE',
      },
      {
        id: 102,
        tipoDocumento: 'COMPROMISO_VOLUNTARIADO',
        archivoUrl: '/docs/mock/compromiso_maria_rojas.pdf',
        nombreArchivoOriginal: 'compromiso_firmado.pdf',
        tamanio: '620 KB',
        fechaSubida: '08/09/2026',
        estado: 'APROBADO',
      },
      {
        id: 103,
        tipoDocumento: 'CI_ANVERSO_REVERSO',
        archivoUrl: '/docs/mock/ci_maria_rojas.pdf',
        nombreArchivoOriginal: 'ci_anverso_reverso.pdf',
        tamanio: '890 KB',
        fechaSubida: '08/09/2026',
        estado: 'APROBADO',
      },
      {
        id: 104,
        tipoDocumento: 'CI_PADRE_TUTOR_MENOR',
        archivoUrl: '/docs/mock/ci_padre_tutor.pdf',
        nombreArchivoOriginal: 'ci_padre_tutor.pdf',
        tamanio: '750 KB',
        fechaSubida: '08/09/2026',
        estado: 'APROBADO',
      },
    ],
  },
  {
    id: 2,
    ci: '8392160 LP',
    nombreCompleto: 'Lucas C. Vargas',
    nombres: 'Lucas',
    primerApellido: 'Vargas',
    segundoApellido: 'Calle',
    email: 'lucas.vargas@ucb.edu.bo',
    telefono: '71298456',
    carrera: 'Ingeniería Comercial',
    semestreCarrera: '5to Semestre',
    edad: 20,
    esMenor: false,
    rol: 'VOLUNTARIO',
    proyectoAsignado: 'Hogar San Ramón - Terapia Ocupacional',
    catoliderAsignado: 'Valeria Sanjinés',
    polizaValidada: true,
    induccionCompletada: true,
    habilitadoCampo: true,
    estadoGeneral: 'APROBADO',
    documentos: [
      {
        id: 201,
        tipoDocumento: 'POLIZA_ACCIDENTES_APC7083',
        archivoUrl: '/docs/mock/poliza_lucas_vargas.pdf',
        nombreArchivoOriginal: 'poliza_lucas_vargas.pdf',
        tamanio: '2.1 MB',
        fechaSubida: '07/09/2026',
        numeroPoliza: 'APC-7083',
        idPoliza: 'POL-2026-0512',
        numeroCertificado: 'CERT-09941',
        vigenciaInicio: '2026-08-01',
        vigenciaFin: '2027-07-31',
        asegurado: 'Lucas C. Vargas',
        estado: 'APROBADO',
      },
      {
        id: 202,
        tipoDocumento: 'COMPROMISO_VOLUNTARIADO',
        archivoUrl: '/docs/mock/compromiso_lucas.pdf',
        nombreArchivoOriginal: 'compromiso_firmado.pdf',
        tamanio: '580 KB',
        fechaSubida: '07/09/2026',
        estado: 'APROBADO',
      },
      {
        id: 203,
        tipoDocumento: 'CI_ANVERSO_REVERSO',
        archivoUrl: '/docs/mock/ci_lucas.pdf',
        nombreArchivoOriginal: 'ci_lucas_vargas.pdf',
        tamanio: '1.1 MB',
        fechaSubida: '07/09/2026',
        estado: 'APROBADO',
      },
    ],
  },
  {
    id: 3,
    ci: '7631194 LP',
    nombreCompleto: 'Andrea T. Pérez',
    nombres: 'Andrea',
    primerApellido: 'Pérez',
    segundoApellido: 'Tejada',
    email: 'andrea.perez@ucb.edu.bo',
    telefono: '72549102',
    carrera: 'Derecho',
    semestreCarrera: '4to Semestre',
    edad: 22,
    esMenor: false,
    rol: 'VOLUNTARIO',
    proyectoAsignado: 'Hogar San Ramón - Área Legal',
    catoliderAsignado: 'Valeria Sanjinés',
    polizaValidada: false,
    induccionCompletada: true,
    habilitadoCampo: false,
    estadoGeneral: 'OBSERVADO',
    documentos: [
      {
        id: 301,
        tipoDocumento: 'POLIZA_ACCIDENTES_APC7083',
        archivoUrl: '/docs/mock/poliza_andrea_perez.pdf',
        nombreArchivoOriginal: 'poliza_andrea_perez.pdf',
        tamanio: '1.4 MB',
        fechaSubida: '06/09/2026',
        numeroPoliza: 'APC-7083',
        idPoliza: 'POL-2025-0100',
        numeroCertificado: 'CERT-04123',
        vigenciaInicio: '2025-08-01',
        vigenciaFin: '2026-07-31',
        asegurado: 'Andrea T. Pérez',
        estado: 'OBSERVADO',
        observacionesValidacion: 'La póliza presentada expiró el 31/07/2026. Es obligatorio presentar el certificado renovado vigente al semestre 2/2026.',
      },
      {
        id: 302,
        tipoDocumento: 'COMPROMISO_VOLUNTARIADO',
        archivoUrl: '/docs/mock/compromiso_andrea.pdf',
        nombreArchivoOriginal: 'compromiso_andrea.pdf',
        tamanio: '610 KB',
        fechaSubida: '06/09/2026',
        estado: 'APROBADO',
      },
    ],
  },
  {
    id: 4,
    ci: '9982473 LP',
    nombreCompleto: 'Diego M. Quispe',
    nombres: 'Diego',
    primerApellido: 'Quispe',
    segundoApellido: 'Mamani',
    email: 'diego.quispe@ucb.edu.bo',
    telefono: '77891234',
    carrera: 'Ciencias de la Comunicación',
    semestreCarrera: '2do Semestre',
    edad: 17,
    esMenor: true,
    rol: 'POSTULANTE',
    proyectoAsignado: 'Comedor Santa Rita - Prensa y Redes',
    catoliderAsignado: 'Valeria Sanjinés',
    polizaValidada: false,
    induccionCompletada: false,
    habilitadoCampo: false,
    estadoGeneral: 'PENDIENTE',
    documentos: [
      {
        id: 401,
        tipoDocumento: 'POLIZA_ACCIDENTES_APC7083',
        archivoUrl: '/docs/mock/poliza_diego.pdf',
        nombreArchivoOriginal: 'poliza_diego_quispe.pdf',
        tamanio: '2.4 MB',
        fechaSubida: '09/09/2026',
        numeroPoliza: 'APC-7083',
        idPoliza: 'POL-2026-1109',
        numeroCertificado: 'CERT-12001',
        vigenciaInicio: '2026-08-01',
        vigenciaFin: '2027-07-31',
        asegurado: 'Diego M. Quispe',
        estado: 'PENDIENTE',
      },
      {
        id: 402,
        tipoDocumento: 'COMPROMISO_VOLUNTARIADO',
        archivoUrl: '/docs/mock/compromiso_diego.pdf',
        nombreArchivoOriginal: 'compromiso_firmado.pdf',
        tamanio: '490 KB',
        fechaSubida: '09/09/2026',
        estado: 'PENDIENTE',
      },
      {
        id: 403,
        tipoDocumento: 'CI_ANVERSO_REVERSO',
        archivoUrl: '/docs/mock/ci_diego.pdf',
        nombreArchivoOriginal: 'ci_diego_quispe.pdf',
        tamanio: '950 KB',
        fechaSubida: '09/09/2026',
        estado: 'PENDIENTE',
      },
      {
        id: 404,
        tipoDocumento: 'CARTA_AUTORIZACION_PADRES_MENOR',
        archivoUrl: '/docs/mock/carta_padres_diego.pdf',
        nombreArchivoOriginal: 'carta_autorizacion_padres.pdf',
        tamanio: '1.2 MB',
        fechaSubida: '09/09/2026',
        estado: 'PENDIENTE',
      },
    ],
  },
];

const INITIAL_PARTICIPANTES: ParticipanteInduccion[] = [
  {
    id: 1,
    userId: 2,
    nombreCompleto: 'Lucas C. Vargas',
    ci: '8392160 LP',
    rol: 'VOLUNTARIO', // Amarillo
    catolider: 'Valeria Sanjinés',
    documentosHabilitados: true,
    fechaCharla: '08/09/2026',
    recorridoSitio: '09/09/2026',
    estadoInduccion: 'COMPLETADA',
    proyectoNombre: 'Hogar San Ramón',
  },
  {
    id: 2,
    userId: 10,
    nombreCompleto: 'Valeria Sanjinés',
    ci: '6819203 LP',
    rol: 'CATOLIDER', // Rojo
    catolider: 'Andrea Moscoso (Pastoral)',
    documentosHabilitados: true,
    fechaCharla: '05/09/2026',
    recorridoSitio: '06/09/2026',
    estadoInduccion: 'COMPLETADA',
    proyectoNombre: 'Hogar San Ramón',
  },
  {
    id: 3,
    userId: 3,
    nombreCompleto: 'Andrea T. Pérez',
    ci: '7631194 LP',
    rol: 'VOLUNTARIO', // Amarillo
    catolider: 'Valeria Sanjinés',
    documentosHabilitados: true,
    fechaCharla: '08/09/2026',
    recorridoSitio: '09/09/2026',
    estadoInduccion: 'COMPLETADA',
    proyectoNombre: 'Hogar San Ramón',
  },
  {
    id: 4,
    userId: 5,
    nombreCompleto: 'Daniel C. Molina',
    ci: '8710293 LP',
    rol: 'POSTULANTE', // Azul
    catolider: 'Valeria Sanjinés',
    documentosHabilitados: true,
    fechaCharla: '10/09/2026',
    recorridoSitio: 'Por registrar',
    estadoInduccion: 'EN_PROCESO',
    proyectoNombre: 'Hogar San Ramón',
  },
  {
    id: 5,
    userId: 6,
    nombreCompleto: 'Sofía V. Arce',
    ci: '9102834 LP',
    rol: 'INTERESADO', // Celeste
    catolider: 'Valeria Sanjinés',
    documentosHabilitados: true,
    fechaCharla: '11/09/2026',
    recorridoSitio: 'Pendiente',
    estadoInduccion: 'PENDIENTE',
    proyectoNombre: 'Hogar San Ramón',
  },
  {
    id: 6,
    userId: 7,
    nombreCompleto: 'José M. Paredes',
    ci: '7492019 LP',
    rol: 'VOLUNTARIO', // Amarillo
    catolider: 'Valeria Sanjinés',
    documentosHabilitados: true,
    fechaCharla: 'No asistió',
    recorridoSitio: '—',
    estadoInduccion: 'REPROGRAMAR',
    proyectoNombre: 'Hogar San Ramón',
    observaciones: 'Cruce con examen parcial. Reprogramar para la sesión del sábado.',
  },
  {
    id: 7,
    userId: 1,
    nombreCompleto: 'María Fernanda Rojas',
    ci: '9420187 LP',
    rol: 'VOLUNTARIO', // Amarillo
    catolider: 'Valeria Sanjinés',
    documentosHabilitados: false,
    fechaCharla: '08/09/2026',
    recorridoSitio: '09/09/2026',
    estadoInduccion: 'EN_PROCESO',
    proyectoNombre: 'Hogar San Ramón',
    observaciones: 'Documentos pendientes de subsanación.',
  },
  {
    id: 8,
    userId: 12,
    nombreCompleto: 'Lic. Mateo L. Beltrán',
    ci: '5928103 LP',
    rol: 'ADMIN_PASTORAL', // Verde
    catolider: 'Dirección Pastoral',
    documentosHabilitados: true,
    fechaCharla: '01/09/2026',
    recorridoSitio: '01/09/2026',
    estadoInduccion: 'COMPLETADA',
    proyectoNombre: 'Coordinación Central',
  },
];

let stateExpedientes = [...INITIAL_EXPEDIENTES];
let stateParticipantes = [...INITIAL_PARTICIPANTES];

export const documentosService = {
  // P-10: Obtener expediente de usuario actual
  async getMisDocumentos(): Promise<VoluntarioExpediente> {
    try {
      const response = await apiClient.get<any>('/documentos/mis-documentos');
      return response;
    } catch {
      // Fallback local garantizado para María Fernanda Rojas (P-10)
      return stateExpedientes[0];
    }
  },

  // P-10: Subir un documento
  async subirDocumento(data: Partial<DocumentoVoluntario>): Promise<DocumentoVoluntario> {
    try {
      return await apiClient.post<DocumentoVoluntario>('/documentos/upload', data);
    } catch {
      const nuevoDoc: DocumentoVoluntario = {
        id: Date.now(),
        tipoDocumento: data.tipoDocumento || 'OTRO_RESPALDO',
        archivoUrl: data.archivoUrl || '/docs/mock/documento_cargado.pdf',
        nombreArchivoOriginal: data.nombreArchivoOriginal || 'archivo_cargado.pdf',
        tamanio: '1.2 MB',
        fechaSubida: new Date().toLocaleDateString('es-BO'),
        numeroPoliza: data.numeroPoliza,
        idPoliza: data.idPoliza,
        numeroCertificado: data.numeroCertificado,
        vigenciaInicio: data.vigenciaInicio,
        vigenciaFin: data.vigenciaFin,
        asegurado: data.asegurado,
        estado: 'PENDIENTE',
      };

      const exp = stateExpedientes[0];
      const idx = exp.documentos.findIndex((d) => d.tipoDocumento === data.tipoDocumento);
      if (idx >= 0) {
        exp.documentos[idx] = nuevoDoc;
      } else {
        exp.documentos.push(nuevoDoc);
      }
      return nuevoDoc;
    }
  },

  // P-10: Descargar plantilla oficial
  async descargarModeloCartaMenores(): Promise<{ url: string; nombre: string }> {
    try {
      return await apiClient.get('/documentos/modelo-carta-menores');
    } catch {
      return {
        url: '#',
        nombre: 'Modelo_Oficial_Autorizacion_Padres_Pastoral_UCB.docx',
      };
    }
  },

  // P-11: Obtener bandeja de validación para Pastoral
  async getBandejaValidacion(): Promise<{
    kpis: {
      pendientesRevision: number;
      observados: number;
      habilitadosEsteSemestre: number;
      polizasProximasVencer: number;
    };
    voluntarios: VoluntarioExpediente[];
  }> {
    try {
      const response = await apiClient.get<any>('/documentos/bandeja-validacion');
      return response;
    } catch {
      return {
        kpis: {
          pendientesRevision: stateExpedientes.filter((e) => e.documentos.some((d) => d.estado === 'PENDIENTE')).length,
          observados: stateExpedientes.filter((e) => e.documentos.some((d) => d.estado === 'OBSERVADO')).length,
          habilitadosEsteSemestre: 78,
          polizasProximasVencer: 3,
        },
        voluntarios: stateExpedientes,
      };
    }
  },

  // P-11: Validar un documento específico u observar
  async validarDocumento(
    documentoId: number,
    estado: EstadoDocumento,
    observaciones?: string,
  ): Promise<DocumentoVoluntario> {
    try {
      return await apiClient.patch<DocumentoVoluntario>(`/documentos/${documentoId}/validar`, {
        estado,
        observacionesValidacion: observaciones,
      });
    } catch {
      let docEncontrado: DocumentoVoluntario | null = null;

      stateExpedientes = stateExpedientes.map((exp) => {
        const docIdx = exp.documentos.findIndex((d) => d.id === documentoId);
        if (docIdx >= 0) {
          const doc = {
            ...exp.documentos[docIdx],
            estado,
            observacionesValidacion: observaciones,
          };
          docEncontrado = doc;
          const updatedDocs = [...exp.documentos];
          updatedDocs[docIdx] = doc;

          // Si se aprueba la póliza, actualizar estado
          const polizaAprobada = updatedDocs.some(
            (d) => d.tipoDocumento === 'POLIZA_ACCIDENTES_APC7083' && d.estado === 'APROBADO',
          );

          return {
            ...exp,
            documentos: updatedDocs,
            polizaValidada: polizaAprobada,
            habilitadoCampo: polizaAprobada && exp.induccionCompletada,
            estadoGeneral: (estado === 'OBSERVADO' ? 'OBSERVADO' : (polizaAprobada ? 'APROBADO' : 'PENDIENTE')) as any,
          };
        }
        return exp;
      });

      return docEncontrado!;
    }
  },

  // P-12: Participantes de inducción
  async getParticipantesInduccion(proyecto = 'Hogar San Ramón'): Promise<{
    kpis: {
      voluntariosHabilitados: number;
      induccionCompletada: number;
      pendientesInduccion: number;
      reprogramarAsistencia: number;
    };
    participantes: ParticipanteInduccion[];
  }> {
    try {
      return await apiClient.get<any>(`/documentos/induccion/participantes?proyecto=${encodeURIComponent(proyecto)}`);
    } catch {
      return {
        kpis: {
          voluntariosHabilitados: 78,
          induccionCompletada: stateParticipantes.filter((p) => p.estadoInduccion === 'COMPLETADA').length + 57,
          pendientesInduccion: stateParticipantes.filter((p) => p.estadoInduccion === 'PENDIENTE' || p.estadoInduccion === 'EN_PROCESO').length + 12,
          reprogramarAsistencia: stateParticipantes.filter((p) => p.estadoInduccion === 'REPROGRAMAR').length + 2,
        },
        participantes: stateParticipantes,
      };
    }
  },

  // P-12: Registrar asistencia a inducción
  async registrarAsistenciaInduccion(
    participanteId: number,
    data: {
      asistioCharla: boolean;
      fechaCharla?: string;
      asistioRecorrido: boolean;
      fechaRecorrido?: string;
      estadoInduccion: EstadoInduccion;
      observaciones?: string;
    },
  ): Promise<ParticipanteInduccion> {
    try {
      return await apiClient.post<ParticipanteInduccion>('/documentos/induccion/asistencia', {
        asistenciaId: participanteId,
        ...data,
      });
    } catch {
      let actualizado: ParticipanteInduccion | null = null;
      stateParticipantes = stateParticipantes.map((p) => {
        if (p.id === participanteId) {
          actualizado = {
            ...p,
            fechaCharla: data.asistioCharla ? (data.fechaCharla || new Date().toLocaleDateString('es-BO')) : 'No asistió',
            recorridoSitio: data.asistioRecorrido ? (data.fechaRecorrido || new Date().toLocaleDateString('es-BO')) : 'Pendiente',
            estadoInduccion: data.estadoInduccion,
            observaciones: data.observaciones,
          };
          return actualizado;
        }
        return p;
      });
      return actualizado!;
    }
  },

  // P-12: Crear nueva sesión de inducción
  async crearSesionInduccion(sesion: Partial<SesionInduccion>): Promise<SesionInduccion> {
    try {
      return await apiClient.post<SesionInduccion>('/documentos/induccion/sesiones', sesion);
    } catch {
      return {
        id: Date.now(),
        titulo: sesion.titulo || 'Nueva Sesión de Inducción',
        fechaHora: sesion.fechaHora || new Date().toISOString(),
        modalidad: sesion.modalidad || 'PRESENCIAL',
        lugarEnlace: sesion.lugarEnlace || 'Auditorio San Pablo',
        facilitador: sesion.facilitador || 'Equipo de Pastoral',
        proyectoNombre: sesion.proyectoNombre || 'Hogar San Ramón',
        semana: 'Semana 1',
      };
    }
  },
};
