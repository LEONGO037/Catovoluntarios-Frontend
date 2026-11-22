import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  ShieldCheck,
  User,
  ArrowRight,
  FileCheck,
  Info,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { documentosService } from '../../../services/documentos.service';
import type { VoluntarioExpediente, DocumentoVoluntario } from '../../../types/documentos.types';

export const PortalCargaDocumental: React.FC = () => {
  const [expediente, setExpediente] = useState<VoluntarioExpediente | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Modal para ver archivo
  const [viewerModal, setViewerModal] = useState<{
    isOpen: boolean;
    title: string;
    docType: string;
    fileName: string;
  }>({
    isOpen: false,
    title: '',
    docType: '',
    fileName: '',
  });

  // Campos de la póliza
  const [polizaData, setPolizaData] = useState({
    numeroPoliza: 'APC-7083',
    idPoliza: 'POL-2026-0814',
    numeroCertificado: 'CERT-11408',
    vigenciaDesde: '2026-08-01',
    vigenciaHasta: '2027-07-31',
    asegurado: 'María Fernanda Rojas',
  });

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await documentosService.getMisDocumentos();
      setExpediente(data);
      const poliza = data.documentos.find((d) => d.tipoDocumento === 'POLIZA_ACCIDENTES_APC7083');
      if (poliza) {
        setPolizaData({
          numeroPoliza: poliza.numeroPoliza || 'APC-7083',
          idPoliza: poliza.idPoliza || 'POL-2026-0814',
          numeroCertificado: poliza.numeroCertificado || 'CERT-11408',
          vigenciaDesde: poliza.vigenciaInicio || '2026-08-01',
          vigenciaHasta: poliza.vigenciaFin || '2027-07-31',
          asegurado: poliza.asegurado || data.nombreCompleto,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const getDoc = (tipo: string): DocumentoVoluntario | undefined => {
    return expediente?.documentos.find((d) => d.tipoDocumento === tipo);
  };

  const handleDescargarPlantillaMenores = () => {
    const contenido = `PASTORAL UNIVERSITARIA SAN PABLO - REGIONAL LA PAZ
PROGRAMA CATOVOLUNTARIOS
AUTORIZACIÓN OFICIAL PARA MENORES DE EDAD (SEMESTRE 2/2026)

Yo, _________________________________________________, con C.I. ____________________,
en calidad de Padre / Madre / Tutor Legal del estudiante menor de edad:
Nombre: ${expediente?.nombreCompleto || 'María Fernanda Rojas'}
C.I.: ${expediente?.ci || '9420187 LP'}      Carrera: ${expediente?.carrera || 'Psicología'}

Por la presente AUTORIZO expresamente a mi hijo/a o tutelado/a a participar activamente
en las actividades formativas y de voluntariado en campo asignadas por Pastoral UCB.

Firma del Padre / Madre o Tutor: _____________________________________
Lugar y Fecha: La Paz, ______ de ________________ de 2026`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Modelo_Autorizacion_Padres_Pastoral_UCB.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSimularSubida = async (tipo: any, nombreArchivo: string) => {
    setSaving(true);
    try {
      await documentosService.subirDocumento({
        tipoDocumento: tipo,
        nombreArchivoOriginal: nombreArchivo,
        numeroPoliza: polizaData.numeroPoliza,
        idPoliza: polizaData.idPoliza,
        numeroCertificado: polizaData.numeroCertificado,
        vigenciaInicio: polizaData.vigenciaDesde,
        vigenciaFin: polizaData.vigenciaHasta,
        asegurado: polizaData.asegurado,
      });
      await cargarDatos();
      setBannerSuccess(`Documento "${nombreArchivo}" subido correctamente.`);
      setTimeout(() => setBannerSuccess(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleEnviarRevision = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setBannerSuccess('¡Documentación enviada a revisión con éxito! Pastoral te notificará.');
      setTimeout(() => setBannerSuccess(null), 5000);
    }, 800);
  };

  const abrirVisor = (title: string, docType: string, fileName: string) => {
    setViewerModal({
      isOpen: true,
      title,
      docType,
      fileName,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cato-navy mx-auto mb-3" />
          <p className="text-sm text-cato-muted">Cargando expediente documental...</p>
        </div>
      </div>
    );
  }

  const polizaDoc = getDoc('POLIZA_ACCIDENTES_APC7083');
  const compromisoDoc = getDoc('COMPROMISO_VOLUNTARIADO');
  const ciDoc = getDoc('CI_ANVERSO_REVERSO');
  const cartaMenorDoc = getDoc('CARTA_AUTORIZACION_PADRES_MENOR');
  const ciPadreDoc = getDoc('CI_PADRE_TUTOR_MENOR');

  return (
    <div className="space-y-6">
      {/* Mensaje de confirmación interactivo */}
      {bannerSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 text-emerald-800 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{bannerSuccess}</span>
        </div>
      )}

      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-cato-navy tracking-wider uppercase mb-1">
            P-10 · HABILITACIÓN DOCUMENTAL
          </div>
          <h1 className="text-2xl font-bold text-cato-navy">Mis documentos</h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Sube los requisitos para continuar tu incorporación al proyecto.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          3 de 4 requisitos por completar
        </div>
      </div>

      {/* Stepper Horizontal */}
      <div className="bg-white rounded-xl border border-cato-border p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Paso 1 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-cato-navy">1. Postulación</div>
              <div className="text-xs text-cato-muted">Formulario recibido</div>
            </div>
          </div>

          {/* Paso 2 (Activo) */}
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-cato-border pt-3 md:pt-0 md:pl-4">
            <div className="w-8 h-8 rounded-full bg-cato-navy text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-cato-navy">2. Documentos</div>
              <div className="text-xs text-cato-navy font-medium">Completa y envía para revisión</div>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-cato-border pt-3 md:pt-0 md:pl-4 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-slate-600">3. Inducción</div>
              <div className="text-xs text-slate-500">Después de la aprobación</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta Institucional de Oro */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold">La póliza vigente es obligatoria antes del ingreso a campo.</strong>{' '}
          Tu asignación al proyecto está confirmada, pero tus horas en campo permanecerán bloqueadas hasta la validación de tu seguro estudiantil UCB (APC-7083). Pastoral revisará tus archivos y te avisará si debes corregir alguno.
        </div>
      </div>

      {/* Grid Principal (2 columnas izquierda, 1 columna lateral) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Requisitos Documentales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 01: Póliza contra accidentes UCB */}
          <div className="bg-white rounded-xl border border-cato-border p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-cato-navy flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cato-navy" />
                  01 · Póliza contra accidentes UCB
                </h3>
                <p className="text-xs text-cato-muted mt-0.5">
                  Sube una imagen o PDF legible de tu póliza vigente (APC-7083).
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                ● En revisión
              </span>
            </div>

            {/* Archivo cargado */}
            <div className="p-3.5 bg-cato-canvas border border-dashed border-cato-border rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold text-xs">
                  PDF
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-cato-navy truncate">
                    {polizaDoc?.nombreArchivoOriginal || 'poliza_maria_rojas.pdf'}
                  </div>
                  <div className="text-[11px] text-cato-muted">
                    PDF · {polizaDoc?.tamanio || '1.8 MB'} · Cargado el {polizaDoc?.fechaSubida || '08/09/2026'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                  onClick={() =>
                    abrirVisor(
                      'Póliza contra Accidentes UCB',
                      'POLIZA_ACCIDENTES_APC7083',
                      polizaDoc?.nombreArchivoOriginal || 'poliza_maria_rojas.pdf',
                    )
                  }
                >
                  Ver archivo
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  onClick={() => handleSimularSubida('POLIZA_ACCIDENTES_APC7083', 'poliza_renovada_2026.pdf')}
                  isLoading={saving}
                >
                  Reemplazar
                </Button>
              </div>
            </div>

            {/* Campos de la póliza */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-cato-slate mb-1">N.º de póliza</label>
                <input
                  type="text"
                  value={polizaData.numeroPoliza}
                  onChange={(e) => setPolizaData({ ...polizaData, numeroPoliza: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
                  placeholder="APC-7083"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-cato-slate mb-1">ID de póliza</label>
                <input
                  type="text"
                  value={polizaData.idPoliza}
                  onChange={(e) => setPolizaData({ ...polizaData, idPoliza: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
                  placeholder="POL-2026-0814"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-cato-slate mb-1">N.º de certificado</label>
                <input
                  type="text"
                  value={polizaData.numeroCertificado}
                  onChange={(e) => setPolizaData({ ...polizaData, numeroCertificado: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
                  placeholder="CERT-11408"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-cato-slate mb-1">Vigente desde</label>
                <input
                  type="date"
                  value={polizaData.vigenciaDesde}
                  onChange={(e) => setPolizaData({ ...polizaData, vigenciaDesde: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-cato-slate mb-1">Vigente hasta</label>
                <input
                  type="date"
                  value={polizaData.vigenciaHasta}
                  onChange={(e) => setPolizaData({ ...polizaData, vigenciaHasta: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-cato-slate mb-1">Asegurado/a</label>
                <input
                  type="text"
                  value={polizaData.asegurado}
                  onChange={(e) => setPolizaData({ ...polizaData, asegurado: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
                  placeholder="Nombre del estudiante"
                />
              </div>
            </div>
          </div>

          {/* Card 02: Compromiso Catovoluntario */}
          <div className="bg-white rounded-xl border border-cato-border p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-cato-navy flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-cato-navy" />
                  02 · Compromiso Catovoluntario
                </h3>
                <p className="text-xs text-cato-muted mt-0.5">
                  Adjunta el documento firmado correspondiente al periodo académico.
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● Aprobado
              </span>
            </div>

            <div className="p-3.5 bg-cato-canvas border border-dashed border-cato-border rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold text-xs">
                  PDF
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-cato-navy truncate">
                    {compromisoDoc?.nombreArchivoOriginal || 'compromiso_firmado.pdf'}
                  </div>
                  <div className="text-[11px] text-cato-muted">
                    PDF · {compromisoDoc?.tamanio || '620 KB'} · Validado por Pastoral
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                onClick={() =>
                  abrirVisor(
                    'Compromiso de Voluntariado',
                    'COMPROMISO_VOLUNTARIADO',
                    compromisoDoc?.nombreArchivoOriginal || 'compromiso_firmado.pdf',
                  )
                }
              >
                Ver archivo
              </Button>
            </div>
          </div>

          {/* Card 03: Fotocopia de Carnet de Identidad */}
          <div className="bg-white rounded-xl border border-cato-border p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-cato-navy flex items-center gap-2">
                  <User className="w-5 h-5 text-cato-navy" />
                  03 · Fotocopia de Carnet de Identidad (CI)
                </h3>
                <p className="text-xs text-cato-muted mt-0.5">
                  Fotocopia legible anverso y reverso del CI vigente del postulante.
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● Aprobado
              </span>
            </div>

            <div className="p-3.5 bg-cato-canvas border border-dashed border-cato-border rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                  CI
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-cato-navy truncate">
                    {ciDoc?.nombreArchivoOriginal || 'ci_anverso_reverso.pdf'}
                  </div>
                  <div className="text-[11px] text-cato-muted">
                    PDF · {ciDoc?.tamanio || '890 KB'} · CI 9420187 LP
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                onClick={() =>
                  abrirVisor(
                    'Carnet de Identidad (Anverso/Reverso)',
                    'CI_ANVERSO_REVERSO',
                    ciDoc?.nombreArchivoOriginal || 'ci_anverso_reverso.pdf',
                  )
                }
              >
                Ver archivo
              </Button>
            </div>
          </div>

          {/* Card 04: Sección Dinámica Menores de 18 Años */}
          <div className="bg-white rounded-xl border-2 border-amber-300 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-cato-navy">Por ser menor de 18 años</h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                    Requerido
                  </span>
                </div>
                <p className="text-xs text-cato-muted mt-0.5">
                  Se necesitan documentos de tu padre, madre o tutor legal para habilitar tu participación.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={handleDescargarPlantillaMenores}
              >
                Descargar Modelo Oficial de Carta
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Carga CI Tutor */}
              <div
                onClick={() => handleSimularSubida('CI_PADRE_TUTOR_MENOR', 'ci_tutor_firmado.pdf')}
                className="p-4 bg-cato-canvas border border-dashed border-cato-border hover:border-cato-navy rounded-lg cursor-pointer transition text-center group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 mx-auto flex items-center justify-center mb-2 group-hover:bg-cato-navy group-hover:text-white transition">
                  {ciPadreDoc ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Upload className="w-4 h-4" />}
                </div>
                <div className="text-xs font-bold text-cato-navy">+ CI de padre/madre</div>
                <div className="text-[11px] text-cato-muted mt-0.5">
                  {ciPadreDoc ? 'Archivo cargado · ci_padre_tutor.pdf' : 'JPG, PNG o PDF'}
                </div>
              </div>

              {/* Carga Carta Firmada */}
              <div
                onClick={() => handleSimularSubida('CARTA_AUTORIZACION_PADRES_MENOR', 'carta_autorizacion_firmada.pdf')}
                className="p-4 bg-cato-canvas border border-dashed border-amber-400 hover:border-amber-600 rounded-lg cursor-pointer transition text-center group"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-2 group-hover:bg-amber-500 group-hover:text-white transition">
                  {cartaMenorDoc ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Upload className="w-4 h-4" />}
                </div>
                <div className="text-xs font-bold text-cato-navy">+ Carta firmada</div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  {cartaMenorDoc ? 'Archivo cargado' : 'Formato pendiente de subida'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-cato-muted bg-slate-50 p-2.5 rounded-lg">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                La carta debe estar firmada físicamente por tu padre/madre/tutor. Formato oficial pendiente de confirmación por Pastoral.
              </span>
            </div>
          </div>
        </div>

        {/* Panel Lateral: Estado de Habilitación */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-cato-border p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-cato-navy">Estado de habilitación</h3>
            <p className="text-xs text-cato-muted">Requisitos previos al ingreso a campo</p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between py-2 border-b border-cato-border">
                <span className="text-xs font-medium text-cato-slate">Compromiso firmado</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  ● Aprobado
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-cato-border">
                <span className="text-xs font-medium text-cato-slate">Póliza vigente</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  ● En revisión
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-cato-border">
                <span className="text-xs font-medium text-cato-slate">Documentos de menor</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                  ● Pendiente
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-cato-slate">Inducción inicial</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  ● Por realizar
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Proyecto Asignado */}
          <div className="bg-cato-canvas rounded-xl border border-cato-border p-4 space-y-3">
            <div className="text-xs font-bold text-cato-navy uppercase tracking-wider">
              Asignación Actual
            </div>
            <div className="text-sm font-bold text-cato-slate">
              {expediente?.proyectoAsignado || 'Hogar San Ramón - Área Memoria'}
            </div>
            <div className="text-xs text-cato-muted">
              Líder tutor: <strong>{expediente?.catoliderAsignado || 'Valeria Sanjinés'}</strong>
            </div>
            <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
              Horas de voluntariado bloqueadas hasta validación de póliza.
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-2 pt-2">
            <Button
              className="w-full"
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleEnviarRevision}
              isLoading={saving}
            >
              Enviar documentos a revisión
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                setBannerSuccess('Borrador guardado localmente.');
                setTimeout(() => setBannerSuccess(null), 3000);
              }}
            >
              Guardar borrador
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Visor de Documento */}
      <Modal
        isOpen={viewerModal.isOpen}
        onClose={() => setViewerModal({ ...viewerModal, isOpen: false })}
        title={viewerModal.title}
        subtitle={`Archivo: ${viewerModal.fileName}`}
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="bg-slate-50 border border-cato-border rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
            <FileText className="w-16 h-16 text-cato-navy mb-3 opacity-80" />
            <h4 className="text-base font-bold text-cato-navy">{viewerModal.fileName}</h4>
            <p className="text-xs text-cato-muted mt-1 max-w-md">
              Vista previa oficial del documento cargado en el portal de Pastoral UCB. Documento digital legalmente resguardado.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Documento legible y verificado
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setViewerModal({ ...viewerModal, isOpen: false })}
            >
              Cerrar visor
            </Button>
            <Button
              variant="primary"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => {
                alert(`Descargando copia local de ${viewerModal.fileName}`);
              }}
            >
              Descargar archivo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
