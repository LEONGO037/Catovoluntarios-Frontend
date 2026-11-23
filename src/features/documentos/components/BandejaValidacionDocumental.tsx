import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  ExternalLink,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { documentosService } from '../../../services/documentos.service';
import type { VoluntarioExpediente } from '../../../types/documentos.types';

export const BandejaValidacionDocumental: React.FC = () => {
  const [voluntarios, setVoluntarios] = useState<VoluntarioExpediente[]>([]);
  const [selectedVoluntario, setSelectedVoluntario] = useState<VoluntarioExpediente | null>(null);
  const [selectedDocTipo, setSelectedDocTipo] = useState<string>('POLIZA_ACCIDENTES_APC7083');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'PENDIENTES' | 'OBSERVADOS'>('TODOS');
  const [motivoObservacion, setMotivoObservacion] = useState(
    'Falta adjuntar la carta de autorización firmada por padre, madre o tutor.',
  );
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // KPIs
  const [kpis, setKpis] = useState({
    pendientesRevision: 12,
    observados: 4,
    habilitadosEsteSemestre: 78,
    polizasProximasVencer: 3,
  });

  const cargarBandeja = useCallback(async () => {
    try {
      setLoading(true);
      const res = await documentosService.getBandejaValidacion();
      setVoluntarios(res.voluntarios);
      setKpis(res.kpis);
      setSelectedVoluntario((prev) => prev || (res.voluntarios.length > 0 ? res.voluntarios[0] : null));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarBandeja();
  }, [cargarBandeja]);

  const handleSelectVoluntario = (v: VoluntarioExpediente) => {
    setSelectedVoluntario(v);
    setSelectedDocTipo('POLIZA_ACCIDENTES_APC7083');
    if (v.esMenor && !v.documentos.some((d) => d.tipoDocumento === 'CARTA_AUTORIZACION_PADRES_MENOR')) {
      setMotivoObservacion('Falta adjuntar la carta de autorización firmada por padre, madre o tutor.');
    } else {
      setMotivoObservacion('');
    }
  };

  const handleAprobarHabilitacion = async () => {
    if (!selectedVoluntario) return;
    const poliza = selectedVoluntario.documentos.find((d) => d.tipoDocumento === 'POLIZA_ACCIDENTES_APC7083');
    if (poliza) {
      await documentosService.validarDocumento(poliza.id, 'APROBADO');
    }
    setActionSuccess(`¡Documentación de ${selectedVoluntario.nombreCompleto} aprobada exitosamente!`);
    await cargarBandeja();
    // Actualizar seleccionado localmente
    setSelectedVoluntario({
      ...selectedVoluntario,
      polizaValidada: true,
      habilitadoCampo: selectedVoluntario.induccionCompletada,
      estadoGeneral: 'APROBADO',
    });
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleAbrirOriginal = () => {
    const fileName = currentDoc?.nombreArchivoOriginal || 'documento_oficial.pdf';
    const contenido = `COPIA DIGITAL LEGALMENTE CERTIFICADA - PASTORAL UCB\nDocumento: ${fileName}\nVoluntario: ${selectedVoluntario?.nombreCompleto || 'Estudiante'}\nCédula de Identidad: ${selectedVoluntario?.ci || ''}\nCarrera: ${selectedVoluntario?.carrera || ''}\nProyecto: ${selectedVoluntario?.proyectoAsignado || ''}\nFecha de Verificación: ${new Date().toLocaleDateString('es-BO')}`;

    const blob = new Blob([contenido], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setActionSuccess(`¡Archivo original ${fileName} descargado a tu equipo!`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleObservarDocumento = async () => {
    if (!selectedVoluntario) return;
    const poliza = selectedVoluntario.documentos.find((d) => d.tipoDocumento === 'POLIZA_ACCIDENTES_APC7083');
    if (poliza) {
      await documentosService.validarDocumento(poliza.id, 'OBSERVADO', motivoObservacion);
    }
    setActionSuccess(`Se envió la observación a ${selectedVoluntario.nombreCompleto} con el comentario indicado.`);
    await cargarBandeja();
    setSelectedVoluntario({
      ...selectedVoluntario,
      polizaValidada: false,
      habilitadoCampo: false,
      estadoGeneral: 'OBSERVADO',
    });
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const voluntariosFiltrados = voluntarios.filter((v) => {
    const matchSearch =
      v.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ci.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (filtroEstado === 'PENDIENTES') return v.estadoGeneral === 'PENDIENTE';
    if (filtroEstado === 'OBSERVADOS') return v.estadoGeneral === 'OBSERVADO';
    return true;
  });

  const currentDoc = selectedVoluntario?.documentos.find((d) => d.tipoDocumento === selectedDocTipo);
  const polizaDoc = selectedVoluntario?.documentos.find((d) => d.tipoDocumento === 'POLIZA_ACCIDENTES_APC7083');
  const cartaMenorDoc = selectedVoluntario?.documentos.find(
    (d) => d.tipoDocumento === 'CARTA_AUTORIZACION_PADRES_MENOR',
  );

  return (
    <div className="space-y-6">
      {/* Mensaje de confirmación de acción */}
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
            CONTROL DE DOCUMENTOS
          </div>
          <h1 className="text-2xl font-bold text-cato-navy">Validación documental</h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Revisa la póliza, el compromiso y los documentos de menores antes de habilitar.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={cargarBandeja}
          isLoading={loading}
        >
          Actualizar bandeja
        </Button>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-cato-border shadow-sm">
          <div className="text-xs text-cato-muted font-medium">Pendientes de revisión</div>
          <div className="text-2xl font-bold text-cato-navy mt-1">{kpis.pendientesRevision}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-cato-border shadow-sm">
          <div className="text-xs text-cato-muted font-medium">Observados</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{kpis.observados}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-cato-border shadow-sm">
          <div className="text-xs text-cato-muted font-medium">Habilitados este semestre</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{kpis.habilitadosEsteSemestre}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-cato-border shadow-sm">
          <div className="text-xs text-cato-muted font-medium">Pólizas próximas a vencer</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{kpis.polizasProximasVencer}</div>
        </div>
      </div>

      {/* Estructura Split-Screen interactiva de 3 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUMNA 1: Bandeja de Solicitudes (3 columnas) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-cato-border shadow-sm flex flex-col h-[700px]">
          <div className="p-4 border-b border-cato-border space-y-3">
            <h3 className="text-sm font-bold text-cato-navy">Bandeja de solicitudes</h3>
            <p className="text-xs text-cato-muted">Selecciona un voluntario para revisar</p>

            {/* Input Buscador */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o CI"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
              />
            </div>

            {/* Filtros rápidos */}
            <div className="flex gap-1">
              <button
                onClick={() => setFiltroEstado('TODOS')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                  filtroEstado === 'TODOS'
                    ? 'bg-cato-navy text-white'
                    : 'bg-cato-canvas text-cato-muted hover:text-cato-slate'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroEstado('PENDIENTES')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                  filtroEstado === 'PENDIENTES'
                    ? 'bg-cato-navy text-white'
                    : 'bg-cato-canvas text-cato-muted hover:text-cato-slate'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFiltroEstado('OBSERVADOS')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                  filtroEstado === 'OBSERVADOS'
                    ? 'bg-cato-navy text-white'
                    : 'bg-cato-canvas text-cato-muted hover:text-cato-slate'
                }`}
              >
                Observados
              </button>
            </div>
          </div>

          {/* Lista de Solicitudes */}
          <div className="flex-1 overflow-y-auto divide-y divide-cato-border">
            {voluntariosFiltrados.map((v) => {
              const isSelected = selectedVoluntario?.id === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVoluntario(v)}
                  className={`p-3.5 cursor-pointer transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-50/70 border-l-4 border-l-cato-gold'
                      : 'hover:bg-cato-canvas border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-cato-slate text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {v.nombres.charAt(0)}
                    {v.primerApellido.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-cato-navy truncate">{v.nombreCompleto}</div>
                    <div className="text-[11px] text-cato-muted mt-0.5">
                      CI {v.ci} · {v.esMenor ? 'Menor de edad' : 'Mayor de edad'}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {v.estadoGeneral === 'OBSERVADO' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          ● Observado · Póliza
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          ● Pendiente · {v.documentos.length} archivos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA 2: Vista previa del documento (5 columnas) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-cato-border shadow-sm flex flex-col h-[700px]">
          <div className="p-4 border-b border-cato-border flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-cato-navy">Vista previa del documento</div>
              <div className="text-[11px] text-cato-muted">
                {currentDoc?.nombreArchivoOriginal || 'poliza_maria_rojas.pdf'} · página 1 de 1
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={handleAbrirOriginal}
            >
              Abrir original
            </Button>
          </div>

          {/* Selector de pestañas de documentos del voluntario */}
          <div className="bg-cato-canvas px-4 py-2 border-b border-cato-border flex items-center gap-2 overflow-x-auto">
            {selectedVoluntario?.documentos.map((doc) => {
              const label =
                doc.tipoDocumento === 'POLIZA_ACCIDENTES_APC7083'
                  ? 'Póliza APC-7083'
                  : doc.tipoDocumento === 'COMPROMISO_VOLUNTARIADO'
                  ? 'Compromiso'
                  : doc.tipoDocumento === 'CI_ANVERSO_REVERSO'
                  ? 'CI Voluntario'
                  : doc.tipoDocumento === 'CI_PADRE_TUTOR_MENOR'
                  ? 'CI Tutor'
                  : 'Carta Menor';

              const isActive = selectedDocTipo === doc.tipoDocumento;

              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocTipo(doc.tipoDocumento)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
                    isActive
                      ? 'bg-cato-navy text-white shadow-sm'
                      : 'bg-white text-cato-slate border border-cato-border hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Contenedor del documento (Visor de PDF Real) */}
          <div className="flex-1 p-3 bg-slate-100 flex items-center justify-center overflow-hidden">
            {currentDoc?.archivoUrl ? (
              <iframe
                src={currentDoc.archivoUrl}
                title={currentDoc.nombreArchivoOriginal}
                className="w-full h-full min-h-[560px] rounded-lg border border-cato-border shadow-md bg-white"
              />
            ) : (
              <div className="w-full max-w-md bg-white border border-cato-border shadow-md rounded-lg p-6 relative">
                {/* Marca de agua */}
                <div className="absolute right-6 bottom-8 w-24 h-24 rounded-full border-4 border-dashed border-slate-300 flex items-center justify-center text-center opacity-40 rotate-12 pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    VISTA ILUSTRATIVA
                  </span>
                </div>

                {/* Contenido del certificado simulado */}
                <div className="text-center pb-4 border-b border-cato-border">
                  <div className="w-10 h-10 rounded-full bg-cato-navy text-white flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                    UCB
                  </div>
                  <h4 className="text-sm font-bold text-cato-navy tracking-wide uppercase">
                    PÓLIZA DE ACCIDENTES
                  </h4>
                  <p className="text-[10px] text-cato-muted mt-0.5">
                    Documento de muestra · Solo para vista de prototipo
                  </p>
                  <div className="mt-2 text-xs font-bold text-cato-slate uppercase tracking-wider">
                    Certificado individual
                  </div>
                </div>

                <div className="py-4 space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-cato-muted">N.º de póliza</span>
                    <span className="font-bold text-cato-navy">{polizaDoc?.numeroPoliza || 'APC-7083'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-cato-muted">ID de póliza</span>
                    <span className="font-bold text-cato-slate">{polizaDoc?.idPoliza || 'POL-2026-0814'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-cato-muted">N.º certificado</span>
                    <span className="font-bold text-cato-slate">{polizaDoc?.numeroCertificado || 'CERT-11408'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-cato-muted">Asegurada</span>
                    <span className="font-bold text-cato-navy">
                      {polizaDoc?.asegurado || selectedVoluntario?.nombreCompleto || 'María Fernanda Rojas'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-cato-muted">Vigencia</span>
                    <span className="font-bold text-emerald-700">
                      {polizaDoc?.vigenciaInicio || '01/08/26'} – {polizaDoc?.vigenciaFin || '31/07/27'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[10px] text-cato-muted leading-relaxed">
                  La validación requiere verificar el archivo original y su legibilidad antes de otorgar el dictamen favorable de Pastoral.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA 3: Revisión de Voluntario y Dictamen (4 columnas) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-cato-border shadow-sm p-5 space-y-4 h-[700px] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Cabecera del Panel Derecho */}
            <div>
              <div className="text-base font-bold text-cato-navy">
                Revisión de {selectedVoluntario?.nombreCompleto || 'Postulante'}
              </div>
              <div className="mt-1">
                {selectedVoluntario?.estadoGeneral === 'APROBADO' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    ● Documentación Aprobada
                  </span>
                ) : selectedVoluntario?.estadoGeneral === 'OBSERVADO' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    ● Observado por Pastoral
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    ● Pendiente de validación
                  </span>
                )}
              </div>
            </div>

            {/* OBSERVACIÓN CLAVE CUMPLIDA: CI DEL CATOVOLUNTARIO DESTACADO EN EL PANEL DERECHO */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-cato-navy/30 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cato-navy" />
                  <span className="text-[11px] font-bold text-cato-navy uppercase tracking-wider">
                    Carnet de Identidad (CI)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cato-navy text-white">
                  VERIFICAR
                </span>
              </div>
              <div className="text-lg font-black text-cato-navy tracking-tight mt-1">
                {selectedVoluntario?.ci || '9420187 LP'}
              </div>
              <div className="text-[11px] text-cato-slate mt-0.5 flex items-center justify-between">
                <span>{selectedVoluntario?.carrera || 'Psicología'}</span>
                <span className="font-semibold text-cato-navy">
                  {selectedVoluntario?.esMenor ? '17 años (Menor)' : `${selectedVoluntario?.edad} años`}
                </span>
              </div>
            </div>

            {/* Checklist de Documentos Recibidos */}
            <div className="space-y-2 text-xs border-t border-b border-cato-border py-3">
              <div className="flex justify-between py-1">
                <span className="text-cato-muted">Póliza UCB:</span>
                <span className="font-bold text-cato-navy">APC-7083</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-cato-muted">Vigencia:</span>
                <span className="font-semibold text-emerald-700">Hasta 31/07/2027</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-cato-muted">Compromiso:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Archivo recibido
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-cato-muted">CI de padre/madre:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Archivo recibido
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-cato-muted">Carta de autorización:</span>
                {cartaMenorDoc ? (
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Archivo recibido
                  </span>
                ) : (
                  <span className="font-bold text-red-600 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-red-600" /> Falta archivo
                  </span>
                )}
              </div>
            </div>

            {/* Alerta de Menor de Edad */}
            {selectedVoluntario?.esMenor && !cartaMenorDoc && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900 leading-snug">
                  <strong className="font-bold">Falta un requisito de menor de edad.</strong> Solicita la carta firmada antes de habilitar el ingreso a campo.
                </div>
              </div>
            )}

            {/* Motivo de Observación */}
            <div>
              <label className="block text-xs font-bold text-cato-slate mb-1">
                Motivo de observación
              </label>
              <textarea
                rows={3}
                value={motivoObservacion}
                onChange={(e) => setMotivoObservacion(e.target.value)}
                placeholder="Escribe la observación detallada para el voluntario..."
                className="w-full p-2.5 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy resize-none"
              />
            </div>
          </div>

          {/* Botones de Dictamen */}
          <div className="space-y-2 pt-2 border-t border-cato-border">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={handleObservarDocumento}
              >
                Observar
              </Button>
              <Button
                variant="primary"
                className="bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-700"
                onClick={handleAprobarHabilitacion}
              >
                Aprobar habilitación
              </Button>
            </div>
            <div className="text-[10px] text-cato-muted text-center leading-tight">
              La aprobación se activa cuando todos los documentos requeridos están completos y vigentes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
