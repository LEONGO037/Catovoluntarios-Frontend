import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  Plus,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { documentosService } from '../../../services/documentos.service';
import type { ParticipanteInduccion, EstadoInduccion } from '../../../types/documentos.types';
import type { UserRole } from '../../../types/auth.types';

export const ControlInduccion: React.FC = () => {
  const [participantes, setParticipantes] = useState<ParticipanteInduccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProyecto, setSelectedProyecto] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal para registrar asistencia a inducción
  const [modalRegistro, setModalRegistro] = useState<{
    isOpen: boolean;
    participante: ParticipanteInduccion | null;
    asistioCharla: boolean;
    fechaCharla: string;
    asistioRecorrido: boolean;
    fechaRecorrido: string;
    estadoInduccion: EstadoInduccion;
    observaciones: string;
  }>({
    isOpen: false,
    participante: null,
    asistioCharla: true,
    fechaCharla: '2026-09-08',
    asistioRecorrido: true,
    fechaRecorrido: '2026-09-09',
    estadoInduccion: 'COMPLETADA',
    observaciones: '',
  });

  // Modal para nueva sesión de inducción
  const [modalNuevaSesion, setModalNuevaSesion] = useState<{
    isOpen: boolean;
    titulo: string;
    fechaHora: string;
    modalidad: 'PRESENCIAL' | 'VIRTUAL';
    lugarEnlace: string;
    facilitador: string;
    proyecto: string;
  }>({
    isOpen: false,
    titulo: '',
    fechaHora: '',
    modalidad: 'PRESENCIAL',
    lugarEnlace: '',
    facilitador: '',
    proyecto: '',
  });

  // KPIs
  const [kpis, setKpis] = useState({
    voluntariosHabilitados: 0,
    induccionCompletada: 0,
    pendientesInduccion: 0,
    reprogramarAsistencia: 0,
  });

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await documentosService.getParticipantesInduccion(selectedProyecto);
      setParticipantes(res.participantes);
      setKpis(res.kpis);
    } finally {
      setLoading(false);
    }
  }, [selectedProyecto]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleAbrirRegistro = (p: ParticipanteInduccion) => {
    const isCharlaOk = p.fechaCharla && p.fechaCharla !== 'No asistió' && p.fechaCharla !== 'Pendiente';
    const isRecorridoOk = p.recorridoSitio && p.recorridoSitio !== 'Por registrar' && p.recorridoSitio !== '—' && p.recorridoSitio !== 'Pendiente';

    setModalRegistro({
      isOpen: true,
      participante: p,
      asistioCharla: Boolean(isCharlaOk),
      fechaCharla: isCharlaOk ? '2026-09-08' : '',
      asistioRecorrido: Boolean(isRecorridoOk),
      fechaRecorrido: isRecorridoOk ? '2026-09-09' : '',
      estadoInduccion: p.estadoInduccion,
      observaciones: p.observaciones || '',
    });
  };

  const handleGuardarAsistencia = async () => {
    if (!modalRegistro.participante) return;

    // Calcular estado automático si marca ambos
    let estadoFinal = modalRegistro.estadoInduccion;
    if (modalRegistro.asistioCharla && modalRegistro.asistioRecorrido) {
      estadoFinal = 'COMPLETADA';
    } else if (modalRegistro.asistioCharla && !modalRegistro.asistioRecorrido) {
      estadoFinal = 'EN_PROCESO';
    }

    await documentosService.registrarAsistenciaInduccion(modalRegistro.participante.id, {
      asistioCharla: modalRegistro.asistioCharla,
      fechaCharla: modalRegistro.fechaCharla || '08/09/2026',
      asistioRecorrido: modalRegistro.asistioRecorrido,
      fechaRecorrido: modalRegistro.fechaRecorrido || '09/09/2026',
      estadoInduccion: estadoFinal,
      observaciones: modalRegistro.observaciones,
    });

    setModalRegistro({ ...modalRegistro, isOpen: false });
    setActionSuccess(`¡Asistencia de ${modalRegistro.participante.nombreCompleto} actualizada a ${estadoFinal}!`);
    await cargarDatos();
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleCrearSesion = async () => {
    await documentosService.crearSesionInduccion({
      titulo: modalNuevaSesion.titulo,
      fechaHora: modalNuevaSesion.fechaHora,
      modalidad: modalNuevaSesion.modalidad,
      lugarEnlace: modalNuevaSesion.lugarEnlace,
      facilitador: modalNuevaSesion.facilitador,
      proyectoNombre: modalNuevaSesion.proyecto,
    });

    setModalNuevaSesion({ ...modalNuevaSesion, isOpen: false });
    setActionSuccess(`¡Sesión de inducción "${modalNuevaSesion.titulo}" agendada exitosamente!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleExportarLista = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Nombre Completo,CI,Rol,Catolider,Documentos Habilitados,Fecha Charla,Recorrido Sitio,Estado Induccion\n' +
      participantes
        .map(
          (p) =>
            `"${p.id}","${p.nombreCompleto}","${p.ci}","${p.rol}","${p.catolider}","${p.documentosHabilitados}","${p.fechaCharla || ''}","${p.recorridoSitio || ''}","${p.estadoInduccion}"`,
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Induccion_${selectedProyecto.replace(/\s+/g, '_')}_2_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const participantesFiltrados = participantes.filter((p) => {
    if (filtroEstado === 'TODOS') return true;
    return p.estadoInduccion === filtroEstado;
  });

  // OBSERVACIÓN CLAVE CUMPLIDA: Asignación cromática estricta para cada rol
  const renderRoleBadge = (rol: UserRole | string) => {
    switch (rol) {
      case 'VOLUNTARIO':
        // Cato voluntario - amarillo
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF9C3] text-[#854D0E] border border-amber-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
            Catovoluntario
          </span>
        );
      case 'CATOLIDER':
        // Catolider - rojo
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#991B1B] border border-red-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Catolíder
          </span>
        );
      case 'POSTULANTE':
        // Postulante - azul
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DBEAFE] text-[#1E40AF] border border-blue-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            Postulante
          </span>
        );
      case 'INTERESADO':
        // Interesado - celeste
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-sky-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
            Interesado
          </span>
        );
      case 'ADMIN_PASTORAL':
      default:
        // Administración - verde
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D1FAE5] text-[#065F46] border border-emerald-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Administración
          </span>
        );
    }
  };

  const completadosCount = participantes.filter((p) => p.estadoInduccion === 'COMPLETADA').length;
  const totalCount = participantes.length;
  const porcentajeAvance = totalCount > 0 ? Math.round((completadosCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cato-navy mx-auto mb-3" />
          <p className="text-sm text-cato-muted">Cargando control de inducción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerta de acción completada */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 text-emerald-800 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-cato-navy tracking-wider uppercase mb-1">
            PRIMERA SEMANA EN PROYECTO
          </div>
          <h1 className="text-2xl font-bold text-cato-navy">Control de inducción</h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Registra la charla y el recorrido inicial de voluntarios documentalmente habilitados.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setModalNuevaSesion({ ...modalNuevaSesion, isOpen: true })}
        >
          Registrar sesión de inducción
        </Button>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-cato-border shadow-sm">
          <div className="text-xs text-cato-muted font-medium">Voluntarios habilitados</div>
          <div className="text-2xl font-bold text-cato-navy mt-1">{kpis.voluntariosHabilitados}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-cato-border shadow-sm">
          <div className="text-xs text-cato-muted font-medium">Inducción completada</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{kpis.induccionCompletada}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-cato-border shadow-sm">
          <div className="text-xs text-cato-muted font-medium">Pendientes de inducción</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{kpis.pendientesInduccion}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-cato-border shadow-sm">
          <div className="text-xs text-cato-muted font-medium">Reprogramar asistencia</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{kpis.reprogramarAsistencia}</div>
        </div>
      </div>

      {/* Barra de Filtros y Acciones */}
      <div className="bg-white rounded-xl border border-cato-border p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-cato-muted">Filtrar por:</span>
          <select
            value={selectedProyecto}
            onChange={(e) => setSelectedProyecto(e.target.value)}
            className="px-3 py-1.5 text-xs bg-cato-canvas border border-cato-border rounded-lg font-semibold text-cato-navy focus:outline-none focus:border-cato-navy"
          >
            <option value="Todos">Todos los Proyectos</option>
          </select>

          <select className="px-3 py-1.5 text-xs bg-cato-canvas border border-cato-border rounded-lg font-semibold text-cato-slate focus:outline-none focus:border-cato-navy">
            <option>Septiembre 2026</option>
            <option>Agosto 2026</option>
            <option>Octubre 2026</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 text-xs bg-cato-canvas border border-cato-border rounded-lg font-semibold text-cato-slate focus:outline-none focus:border-cato-navy"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="COMPLETADA">Completada</option>
            <option value="EN_PROCESO">En proceso</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="REPROGRAMAR">Reprogramar</option>
          </select>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={handleExportarLista}
        >
          Exportar lista
        </Button>
      </div>

      {/* Card Principal: Tabla de Control de Inducción */}
      <div className="bg-white rounded-xl border border-cato-border shadow-sm overflow-hidden">
        {/* Cabecera del bloque */}
        <div className="p-5 border-b border-cato-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-cato-canvas/40">
          <div>
            <h3 className="text-base font-bold text-cato-navy">
              {selectedProyecto} · Inducción inicial
            </h3>
            <p className="text-xs text-cato-muted mt-0.5">
              Charla de bienvenida y recorrido en sitio · {participantes.length} voluntarios en este proyecto
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cato-navy text-white self-start sm:self-center shadow-xs">
            ● Semana 1 · 7–13 sep
          </span>
        </div>

        {/* Tabla Responsiva */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cato-canvas text-cato-muted font-bold uppercase tracking-wider border-b border-cato-border">
              <tr>
                <th className="py-3 px-4">Voluntario</th>
                <th className="py-3 px-4">Documentos</th>
                <th className="py-3 px-4">Fecha de Charla</th>
                <th className="py-3 px-4">Recorrido en Sitio</th>
                <th className="py-3 px-4">Inducción</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cato-border">
              {participantesFiltrados.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-cato-canvas/60 transition">
                    {/* Voluntario + Badge de Rol Oficial */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {p.nombreCompleto.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-cato-navy">{p.nombreCompleto}</div>
                          <div className="text-[11px] text-cato-muted">CI: {p.ci}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {/* ROL CROMÁTICO OFICIAL */}
                            {renderRoleBadge(p.rol)}
                            <span className="text-[11px] text-cato-muted">
                              Líder: {p.catolider}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Documentos */}
                    <td className="py-3.5 px-4">
                      {p.documentosHabilitados ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          ● Habilitado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          ● En revisión
                        </span>
                      )}
                    </td>

                    {/* Fecha Charla */}
                    <td className="py-3.5 px-4 text-cato-slate font-medium">
                      {p.fechaCharla === 'No asistió' ? (
                        <span className="text-red-600 font-bold">No asistió</span>
                      ) : (
                        p.fechaCharla || 'Pendiente'
                      )}
                    </td>

                    {/* Recorrido Sitio */}
                    <td className="py-3.5 px-4 text-cato-slate font-medium">
                      {p.recorridoSitio === 'Por registrar' ? (
                        <span className="text-amber-600 italic">Por registrar</span>
                      ) : (
                        p.recorridoSitio || '—'
                      )}
                    </td>

                    {/* Estado Inducción */}
                    <td className="py-3.5 px-4">
                      {p.estadoInduccion === 'COMPLETADA' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          ● Completada
                        </span>
                      )}
                      {p.estadoInduccion === 'EN_PROCESO' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          ● En proceso
                        </span>
                      )}
                      {p.estadoInduccion === 'PENDIENTE' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          ● Pendiente
                        </span>
                      )}
                      {p.estadoInduccion === 'REPROGRAMAR' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          ● Reprogramar
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      {p.estadoInduccion === 'COMPLETADA' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAbrirRegistro(p)}
                        >
                          Ver registro
                        </Button>
                      ) : p.estadoInduccion === 'REPROGRAMAR' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => handleAbrirRegistro(p)}
                        >
                          Reprogramar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleAbrirRegistro(p)}
                        >
                          Registrar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer de Paginación */}
        <div className="p-4 border-t border-cato-border flex items-center justify-between text-xs text-cato-muted bg-cato-canvas/20">
          <div>Mostrando {participantesFiltrados.length} de {participantes.length} voluntarios</div>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded bg-white border border-cato-border text-cato-slate hover:bg-cato-canvas disabled:opacity-50" disabled>
              ‹ Anterior
            </button>
            <button className="px-2.5 py-1 rounded bg-cato-navy text-white font-bold">1</button>
            <button className="px-2 py-1 rounded bg-white border border-cato-border text-cato-slate hover:bg-cato-canvas disabled:opacity-50" disabled>
              Siguiente ›
            </button>
          </div>
        </div>
      </div>

      {/* Bloque Inferior Informativo y de Avance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regla de Oro Pastoral */}
        <div className="bg-white rounded-xl border border-cato-border p-5 shadow-sm space-y-2">
          <h4 className="text-sm font-bold text-cato-navy flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cato-navy" />
            Regla de habilitación institucional
          </h4>
          <p className="text-xs text-cato-muted leading-relaxed">
            Solo los voluntarios con documentos aprobados pueden figurar en esta lista. Cuando un voluntario tiene marcados{' '}
            <strong className="text-cato-navy">Póliza Validada = TRUE</strong> e{' '}
            <strong className="text-cato-navy">Inducción Completada = TRUE</strong>, su estado cambia automáticamente a{' '}
            <span className="font-bold text-emerald-700">HABILITADO PARA CAMPO</span>, desbloqueando el registro de horas de voluntariado.
          </p>
        </div>

        {/* Avance del Proyecto */}
        <div className="bg-white rounded-xl border border-cato-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-cato-navy">Avance del proyecto</h4>
            <span className="text-xs font-bold text-cato-navy">{porcentajeAvance}%</span>
          </div>
          <p className="text-xs text-cato-muted">
            {completadosCount} de {totalCount} voluntarios completaron la inducción inicial.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-cato-gold h-full rounded-full transition-all duration-500"
              style={{ width: `${porcentajeAvance}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modal para Registrar/Editar Asistencia */}
      <Modal
        isOpen={modalRegistro.isOpen}
        onClose={() => setModalRegistro({ ...modalRegistro, isOpen: false })}
        title={`Registro de Inducción: ${modalRegistro.participante?.nombreCompleto || ''}`}
        subtitle={`CI: ${modalRegistro.participante?.ci || ''} · Proyecto: ${selectedProyecto}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-cato-border space-y-2">
            <div className="text-xs font-bold text-cato-navy uppercase tracking-wider">
              Control de Habilitación Pre-Campo
            </div>
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modalRegistro.asistioCharla}
                  onChange={(e) =>
                    setModalRegistro({ ...modalRegistro, asistioCharla: e.target.checked })
                  }
                  className="rounded text-cato-navy focus:ring-cato-navy w-4 h-4"
                />
                <span className="text-xs font-semibold text-cato-slate">
                  Asistió a la Charla Institucional de Bienvenida
                </span>
              </label>

              {modalRegistro.asistioCharla && (
                <div className="pl-6">
                  <label className="block text-[11px] text-cato-muted mb-0.5">Fecha de Charla</label>
                  <input
                    type="date"
                    value={modalRegistro.fechaCharla}
                    onChange={(e) =>
                      setModalRegistro({ ...modalRegistro, fechaCharla: e.target.value })
                    }
                    className="px-2.5 py-1 text-xs bg-white border border-cato-border rounded focus:outline-none focus:border-cato-navy"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={modalRegistro.asistioRecorrido}
                  onChange={(e) =>
                    setModalRegistro({ ...modalRegistro, asistioRecorrido: e.target.checked })
                  }
                  className="rounded text-cato-navy focus:ring-cato-navy w-4 h-4"
                />
                <span className="text-xs font-semibold text-cato-slate">
                  Completó el Recorrido en Sitio / Instalaciones
                </span>
              </label>

              {modalRegistro.asistioRecorrido && (
                <div className="pl-6">
                  <label className="block text-[11px] text-cato-muted mb-0.5">Fecha de Recorrido</label>
                  <input
                    type="date"
                    value={modalRegistro.fechaRecorrido}
                    onChange={(e) =>
                      setModalRegistro({ ...modalRegistro, fechaRecorrido: e.target.value })
                    }
                    className="px-2.5 py-1 text-xs bg-white border border-cato-border rounded focus:outline-none focus:border-cato-navy"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-cato-slate mb-1">
              Estado de la Inducción
            </label>
            <select
              value={modalRegistro.estadoInduccion}
              onChange={(e) =>
                setModalRegistro({
                  ...modalRegistro,
                  estadoInduccion: e.target.value as EstadoInduccion,
                })
              }
              className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy font-semibold text-cato-navy"
            >
              <option value="COMPLETADA">Completada (Desbloquea horas si la póliza está aprobada)</option>
              <option value="EN_PROCESO">En proceso (Falta charla o recorrido)</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="REPROGRAMAR">Reprogramar (Justificado por examen/salud)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-cato-slate mb-1">
              Observaciones o justificación
            </label>
            <textarea
              rows={2}
              value={modalRegistro.observaciones}
              onChange={(e) =>
                setModalRegistro({ ...modalRegistro, observaciones: e.target.value })
              }
              placeholder="Ej: Cumplió ambas etapas satisfactoriamente..."
              className="w-full p-2.5 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-cato-border">
            <Button
              variant="outline"
              onClick={() => setModalRegistro({ ...modalRegistro, isOpen: false })}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardarAsistencia}>
              Guardar y actualizar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para Crear Nueva Sesión de Inducción */}
      <Modal
        isOpen={modalNuevaSesion.isOpen}
        onClose={() => setModalNuevaSesion({ ...modalNuevaSesion, isOpen: false })}
        title="Agendar Nueva Sesión de Inducción"
        subtitle="Programa el taller institucional previo al inicio de campo"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-cato-slate mb-1">Título de la Sesión</label>
            <input
              type="text"
              value={modalNuevaSesion.titulo}
              onChange={(e) =>
                setModalNuevaSesion({ ...modalNuevaSesion, titulo: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-cato-slate mb-1">Fecha y Hora</label>
              <input
                type="datetime-local"
                value={modalNuevaSesion.fechaHora}
                onChange={(e) =>
                  setModalNuevaSesion({ ...modalNuevaSesion, fechaHora: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-cato-slate mb-1">Modalidad</label>
              <select
                value={modalNuevaSesion.modalidad}
                onChange={(e) =>
                  setModalNuevaSesion({
                    ...modalNuevaSesion,
                    modalidad: e.target.value as 'PRESENCIAL' | 'VIRTUAL',
                  })
                }
                className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
              >
                <option value="PRESENCIAL">Presencial</option>
                <option value="VIRTUAL">Virtual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-cato-slate mb-1">Lugar o Enlace Meet/Zoom</label>
            <input
              type="text"
              value={modalNuevaSesion.lugarEnlace}
              onChange={(e) =>
                setModalNuevaSesion({ ...modalNuevaSesion, lugarEnlace: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cato-slate mb-1">Facilitador / Expositor</label>
            <input
              type="text"
              value={modalNuevaSesion.facilitador}
              onChange={(e) =>
                setModalNuevaSesion({ ...modalNuevaSesion, facilitador: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-cato-border">
            <Button
              variant="outline"
              onClick={() => setModalNuevaSesion({ ...modalNuevaSesion, isOpen: false })}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCrearSesion}>
              Agendar Sesión
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
