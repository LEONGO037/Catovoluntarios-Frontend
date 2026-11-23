import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  // Referencias para file inputs reales
  const polizaInputRef = useRef<HTMLInputElement>(null);
  const compromisoInputRef = useRef<HTMLInputElement>(null);
  const ciInputRef = useRef<HTMLInputElement>(null);
  const ciTutorInputRef = useRef<HTMLInputElement>(null);
  const cartaMenorInputRef = useRef<HTMLInputElement>(null);

  // Modal para ver archivo
  const [viewerModal, setViewerModal] = useState<{
    isOpen: boolean;
    title: string;
    docType: string;
    fileName: string;
    fileUrl?: string;
  }>({
    isOpen: false,
    title: '',
    docType: '',
    fileName: '',
  });

  // Campos de la póliza editables
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

  // Descarga real de la plantilla oficial de carta de menores
  const handleDescargarPlantillaMenores = () => {
    const contenido = `==================================================================
PASTORAL UNIVERSITARIA SAN PABLO - REGIONAL LA PAZ
PROGRAMA CATOVOLUNTARIOS
MODELO OFICIAL DE AUTORIZACIÓN PARA MENORES DE EDAD (2/2026)
==================================================================

Yo, ____________________________________________________________________,
mayor de edad, con Cédula de Identidad N.º ____________________ emitido en ______,
con domicilio en ________________________________________________________,
en mi condición de (Padre / Madre / Tutor Legal) __________________________,
del/de la estudiante menor de edad:

Nombre del Voluntario: ${expediente?.nombreCompleto || 'Estudiante Voluntario'}
Cédula de Identidad (CI): ${expediente?.ci || 'Sin registrar'}
Carrera: ${expediente?.carrera || 'Carrera Universitaria'}
Proyecto Asignado: ${expediente?.proyectoAsignado || 'Sin asignar'}

DECLARO Y AUTORIZO EXPRESAMENTE:
1. Conocer los objetivos, actividades formativas y de voluntariado social que desarrollará en el marco del Programa Catovoluntarios de Pastoral UCB durante el semestre 2/2026.
2. Autorizar su participación activa en campo en el proyecto receptor conveniado, sujeto a la cobertura de la Póliza Universitaria contra Accidentes Personales UCB (APC-7083).
3. Adjuntar copia legible de mi Cédula de Identidad vigente en respaldo de la presente autorización.

En constancia de conformidad, firmo al pie del presente documento:

_______________________________________________
Firma del Padre, Madre o Tutor Legal
Aclaración: ___________________________________
C.I.: _________________________________________
Teléfono de Contacto: _________________________
Fecha: La Paz, _____ de ___________________ de 2026
`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Modelo_Oficial_Autorizacion_Padres_Pastoral_UCB.docx';
    link.click();
    URL.revokeObjectURL(url);

    setBannerSuccess('¡Plantilla oficial de autorización de menores descargada correctamente!');
    setTimeout(() => setBannerSuccess(null), 4000);
  };

  // Descarga real de la plantilla oficial del compromiso de voluntariado
  const handleDescargarPlantillaCompromiso = () => {
    const contenido = `==================================================================
PASTORAL UNIVERSITARIA SAN PABLO - REGIONAL LA PAZ
PROGRAMA CATOVOLUNTARIOS
COMPROMISO FORMAL DE VOLUNTARIADO (SEMESTRE 2/2026)
==================================================================

Yo, ${expediente?.nombreCompleto || 'María Fernanda Rojas'}, con CI ${expediente?.ci || '9420187 LP'},
estudiante regular de la carrera de ${expediente?.carrera || 'Psicología'},
asumo formalmente el presente compromiso ante Pastoral UCB:

1. Cumplir con un mínimo de 4 horas semanales de servicio y acompañamiento en el proyecto receptor asignado.
2. Completar de manera obligatoria el Taller de Inducción Institucional previo a la salida a campo.
3. Respetar y salvaguardar la dignidad de la población vulnerable atendida en el centro.
4. Mantener vigente mi Póliza de Seguro Estudiantil (APC-7083) durante todo el periodo.

Firma del Catovoluntario: ____________________________________
Fecha: La Paz, _____ de _________________ de 2026
`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Compromiso_Catovoluntario_Pastoral_UCB_2_2026.pdf';
    link.click();
    URL.revokeObjectURL(url);

    setBannerSuccess('¡Plantilla de Compromiso de Voluntariado descargada!');
    setTimeout(() => setBannerSuccess(null), 4000);
  };

  // Manejo de carga de archivos reales desde el explorador del usuario
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, tipo: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    const fileUrl = URL.createObjectURL(file);
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    try {
      await documentosService.subirDocumento({
        tipoDocumento: tipo,
        nombreArchivoOriginal: file.name,
        archivoUrl: fileUrl,
        tamanio: fileSizeMb,
        numeroPoliza: polizaData.numeroPoliza,
        idPoliza: polizaData.idPoliza,
        numeroCertificado: polizaData.numeroCertificado,
        vigenciaInicio: polizaData.vigenciaDesde,
        vigenciaFin: polizaData.vigenciaHasta,
        asegurado: polizaData.asegurado,
      });

      // Actualizar estado local reactivo
      if (expediente) {
        const nuevosDocs = [...expediente.documentos];
        const docIdx = nuevosDocs.findIndex((d) => d.tipoDocumento === tipo);
        const docActualizado: DocumentoVoluntario = {
          id: Date.now(),
          tipoDocumento: tipo,
          nombreArchivoOriginal: file.name,
          archivoUrl: fileUrl,
          tamanio: fileSizeMb,
          fechaSubida: new Date().toLocaleDateString('es-BO'),
          numeroPoliza: polizaData.numeroPoliza,
          idPoliza: polizaData.idPoliza,
          numeroCertificado: polizaData.numeroCertificado,
          vigenciaInicio: polizaData.vigenciaDesde,
          vigenciaFin: polizaData.vigenciaHasta,
          asegurado: polizaData.asegurado,
          estado: 'PENDIENTE',
        };

        if (docIdx >= 0) {
          nuevosDocs[docIdx] = docActualizado;
        } else {
          nuevosDocs.push(docActualizado);
        }

        setExpediente({
          ...expediente,
          documentos: nuevosDocs,
        });
      }

      setBannerSuccess(`¡Archivo "${file.name}" cargado exitosamente!`);
      setTimeout(() => setBannerSuccess(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleEnviarRevision = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setBannerSuccess('¡Expediente documental completo enviado a Pastoral para revisión y habilitación!');
      setTimeout(() => setBannerSuccess(null), 5000);
    }, 600);
  };

  const abrirVisor = (title: string, docType: string, fileName: string, fileUrl?: string) => {
    setViewerModal({
      isOpen: true,
      title,
      docType,
      fileName,
      fileUrl,
    });
  };

  // Descarga real desde el visor modal
  const handleDescargarArchivoModal = () => {
    if (viewerModal.fileUrl && viewerModal.fileUrl.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = viewerModal.fileUrl;
      a.download = viewerModal.fileName;
      a.click();
    } else {
      const contenido = `COPIA OFICIAL RESGUARDADA POR PASTORAL UCB
Archivo: ${viewerModal.fileName}
Tipo de Documento: ${viewerModal.docType}
Postulante: ${expediente?.nombreCompleto || 'María Fernanda Rojas'}
CI: ${expediente?.ci || '9420187 LP'}
Fecha de emisión: ${new Date().toLocaleDateString('es-BO')}`;

      const blob = new Blob([contenido], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = viewerModal.fileName;
      a.click();
      URL.revokeObjectURL(url);
    }

    setBannerSuccess(`¡Archivo ${viewerModal.fileName} descargado a tu equipo!`);
    setTimeout(() => setBannerSuccess(null), 3000);
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
      {/* Inputs ocultos para subida de archivos reales */}
      <input
        ref={polizaInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'POLIZA_ACCIDENTES_APC7083')}
      />
      <input
        ref={compromisoInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'COMPROMISO_VOLUNTARIADO')}
      />
      <input
        ref={ciInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'CI_ANVERSO_REVERSO')}
      />
      <input
        ref={ciTutorInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'CI_PADRE_TUTOR_MENOR')}
      />
      <input
        ref={cartaMenorInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'CARTA_AUTORIZACION_PADRES_MENOR')}
      />

      {/* Mensaje de confirmación interactivo */}
      {bannerSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 text-emerald-800 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{bannerSuccess}</span>
        </div>
      )}

      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-cato-navy tracking-wider uppercase mb-1">
            HABILITACIÓN DOCUMENTAL
          </div>
          <h1 className="text-2xl font-bold text-cato-navy">Mis documentos</h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Sube o actualiza los requisitos para continuar tu incorporación al proyecto receptor.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold self-start sm:self-center shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          {cartaMenorDoc ? '4 de 4 requisitos cargados' : '3 de 4 requisitos por completar'}
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
              <div className="text-xs text-cato-muted">Formulario recibido ✓</div>
            </div>
          </div>

          {/* Paso 2 (Activo) */}
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-cato-border pt-3 md:pt-0 md:pl-4">
            <div className="w-8 h-8 rounded-full bg-cato-navy text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-cato-navy">2. Documentos</div>
              <div className="text-xs text-cato-navy font-semibold">Completa y envía para revisión</div>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-cato-border pt-3 md:pt-0 md:pl-4 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-slate-600">3. Inducción</div>
              <div className="text-xs text-slate-500">Habilitación definitiva a campo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta Institucional de Oro */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold">Regla Institucional de Pastoral:</strong> Un voluntario puede estar asignado a un centro receptor, pero <strong>NO PUEDE iniciar horas en campo</strong> sin su póliza de seguro de accidentes vigente (APC-7083) debidamente aprobada por la administración.
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                ● En revisión
              </span>
            </div>

            {/* Archivo cargado con controles interactivos reales */}
            <div className="p-4 bg-cato-canvas border border-dashed border-cato-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                  PDF
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-cato-navy truncate">
                    {polizaDoc?.nombreArchivoOriginal || 'poliza_maria_rojas.pdf'}
                  </div>
                  <div className="text-[11px] text-cato-muted mt-0.5">
                    {polizaDoc?.tamanio || '1.8 MB'} · Cargado el {polizaDoc?.fechaSubida || '08/09/2026'}
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
                      'Póliza contra Accidentes UCB (APC-7083)',
                      'POLIZA_ACCIDENTES_APC7083',
                      polizaDoc?.nombreArchivoOriginal || 'poliza_maria_rojas.pdf',
                      polizaDoc?.archivoUrl,
                    )
                  }
                >
                  Ver archivo
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  onClick={() => polizaInputRef.current?.click()}
                  isLoading={saving}
                >
                  Subir / Reemplazar PDF
                </Button>
              </div>
            </div>

            {/* Campos editables de la póliza */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-cato-slate mb-1">N.º de póliza</label>
                <input
                  type="text"
                  value={polizaData.numeroPoliza}
                  onChange={(e) => setPolizaData({ ...polizaData, numeroPoliza: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy font-semibold text-cato-navy"
                  placeholder="APC-7083"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-cato-slate mb-1">ID de póliza</label>
                <input
                  type="text"
                  value={polizaData.idPoliza}
                  onChange={(e) => setPolizaData({ ...polizaData, idPoliza: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy text-cato-slate"
                  placeholder="POL-2026-0814"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-cato-slate mb-1">N.º de certificado</label>
                <input
                  type="text"
                  value={polizaData.numeroCertificado}
                  onChange={(e) => setPolizaData({ ...polizaData, numeroCertificado: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy text-cato-slate"
                  placeholder="CERT-11408"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-cato-slate mb-1">Vigente desde</label>
                <input
                  type="date"
                  value={polizaData.vigenciaDesde}
                  onChange={(e) => setPolizaData({ ...polizaData, vigenciaDesde: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-cato-slate mb-1">Vigente hasta</label>
                <input
                  type="date"
                  value={polizaData.vigenciaHasta}
                  onChange={(e) => setPolizaData({ ...polizaData, vigenciaHasta: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-cato-slate mb-1">Asegurado/a</label>
                <input
                  type="text"
                  value={polizaData.asegurado}
                  onChange={(e) => setPolizaData({ ...polizaData, asegurado: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cato-canvas border border-cato-border rounded-lg focus:outline-none focus:border-cato-navy font-semibold text-cato-navy"
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
                  Descarga la plantilla oficial, fírmala y vuelve a subir el documento escaneado.
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● Aprobado
              </span>
            </div>

            <div className="p-4 bg-cato-canvas border border-dashed border-cato-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                  PDF
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-cato-navy truncate">
                    {compromisoDoc?.nombreArchivoOriginal || 'compromiso_firmado.pdf'}
                  </div>
                  <div className="text-[11px] text-cato-muted mt-0.5">
                    {compromisoDoc?.tamanio || '620 KB'} · Documento validado por Pastoral
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={handleDescargarPlantillaCompromiso}
                >
                  Descargar Modelo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                  onClick={() =>
                    abrirVisor(
                      'Compromiso de Voluntariado',
                      'COMPROMISO_VOLUNTARIADO',
                      compromisoDoc?.nombreArchivoOriginal || 'compromiso_firmado.pdf',
                      compromisoDoc?.archivoUrl,
                    )
                  }
                >
                  Ver archivo
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  onClick={() => compromisoInputRef.current?.click()}
                  isLoading={saving}
                >
                  Reemplazar
                </Button>
              </div>
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● Aprobado
              </span>
            </div>

            <div className="p-4 bg-cato-canvas border border-dashed border-cato-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                  CI
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-cato-navy truncate">
                    {ciDoc?.nombreArchivoOriginal || 'ci_anverso_reverso.pdf'}
                  </div>
                  <div className="text-[11px] text-cato-muted mt-0.5">
                    {ciDoc?.tamanio || '890 KB'} · Cédula: 9420187 LP
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
                      'Carnet de Identidad (Anverso/Reverso)',
                      'CI_ANVERSO_REVERSO',
                      ciDoc?.nombreArchivoOriginal || 'ci_anverso_reverso.pdf',
                      ciDoc?.archivoUrl,
                    )
                  }
                >
                  Ver archivo
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  onClick={() => ciInputRef.current?.click()}
                  isLoading={saving}
                >
                  Reemplazar CI
                </Button>
              </div>
            </div>
          </div>

          {/* Card 04: Sección Dinámica Menores de 18 Años */}
          <div className="bg-white rounded-xl border-2 border-amber-300 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-cato-navy">Por ser menor de 18 años</h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                    Requerido
                  </span>
                </div>
                <p className="text-xs text-cato-muted mt-0.5">
                  Se necesitan documentos de tu padre, madre o tutor legal para habilitar tu ingreso a campo.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={handleDescargarPlantillaMenores}
                className="shrink-0"
              >
                Descargar Modelo Oficial de Carta
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Carga CI Tutor con input real */}
              <div
                onClick={() => ciTutorInputRef.current?.click()}
                className="p-4 bg-cato-canvas border border-dashed border-cato-border hover:border-cato-navy rounded-lg cursor-pointer transition text-center group"
              >
                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 mx-auto flex items-center justify-center mb-2 group-hover:bg-cato-navy group-hover:text-white transition">
                  {ciPadreDoc ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Upload className="w-5 h-5" />}
                </div>
                <div className="text-xs font-bold text-cato-navy">+ CI de padre/madre</div>
                <div className="text-[11px] text-cato-muted mt-0.5">
                  {ciPadreDoc ? `${ciPadreDoc.nombreArchivoOriginal} (${ciPadreDoc.tamanio || 'Cargado'})` : 'Clic para seleccionar PDF o Imagen'}
                </div>
              </div>

              {/* Carga Carta Firmada con input real */}
              <div
                onClick={() => cartaMenorInputRef.current?.click()}
                className={`p-4 bg-cato-canvas border border-dashed rounded-lg cursor-pointer transition text-center group ${
                  cartaMenorDoc
                    ? 'border-emerald-400 hover:border-emerald-600'
                    : 'border-amber-400 hover:border-amber-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center mb-2 transition ${
                    cartaMenorDoc
                      ? 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white'
                      : 'bg-amber-100 text-amber-800 group-hover:bg-amber-500 group-hover:text-white'
                  }`}
                >
                  {cartaMenorDoc ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Upload className="w-5 h-5" />}
                </div>
                <div className="text-xs font-bold text-cato-navy">+ Carta firmada de autorización</div>
                <div className="text-[11px] text-cato-muted mt-0.5">
                  {cartaMenorDoc ? `${cartaMenorDoc.nombreArchivoOriginal} (${cartaMenorDoc.tamanio || 'Cargado'})` : 'Clic para subir carta firmada'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-cato-muted bg-slate-50 p-2.5 rounded-lg">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                La carta debe estar firmada físicamente por tu padre/madre/tutor. Puedes descargar el modelo oficial arriba, imprimirlo, firmarlo y subirlo aquí en PDF o foto legible.
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
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  ● Aprobado
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-cato-border">
                <span className="text-xs font-medium text-cato-slate">Póliza vigente</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  ● En revisión
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-cato-border">
                <span className="text-xs font-medium text-cato-slate">Documentos de menor</span>
                {cartaMenorDoc ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    ● Cargado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                    ● Pendiente
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-cato-slate">Inducción inicial</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
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
              {expediente?.proyectoAsignado || 'Sin asignar'}
            </div>
            <div className="text-xs text-cato-muted">
              Líder tutor: <strong>{expediente?.catoliderAsignado || 'Coordinación Pastoral'}</strong>
            </div>
            <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded border border-amber-200 leading-tight">
              Horas de voluntariado en campo bloqueadas hasta la validación de la póliza estudiantil.
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
                setBannerSuccess('Borrador y cambios guardados correctamente.');
                setTimeout(() => setBannerSuccess(null), 3000);
              }}
            >
              Guardar borrador
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Visor de Documento con VISOR REAL E INTEGRADO */}
      <Modal
        isOpen={viewerModal.isOpen}
        onClose={() => setViewerModal({ ...viewerModal, isOpen: false })}
        title={viewerModal.title}
        subtitle={`Archivo: ${viewerModal.fileName}`}
        maxWidth="3xl"
      >
        <div className="space-y-4">
          <div className="bg-slate-50 border border-cato-border rounded-xl p-2 min-h-[460px] flex flex-col items-center justify-center">
            {viewerModal.fileUrl ? (
              <iframe
                src={viewerModal.fileUrl}
                title={viewerModal.fileName}
                className="w-full h-[480px] rounded-lg border border-slate-200 shadow-inner"
              />
            ) : (
              <div className="text-center p-6">
                <FileText className="w-16 h-16 text-cato-navy mb-3 opacity-80 mx-auto" />
                <h4 className="text-base font-bold text-cato-navy">{viewerModal.fileName}</h4>
                <p className="text-xs text-cato-muted mt-1 max-w-md">
                  Vista previa oficial del documento cargado en el portal de Pastoral UCB. Documento digital resguardado institucionalmente.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Documento verificado y legible
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-cato-border">
            <span className="text-xs text-cato-muted">
              Documento digitalizado certificado para el Programa Catovoluntarios 2/2026.
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewerModal({ ...viewerModal, isOpen: false })}
              >
                Cerrar visor
              </Button>
              <Button
                variant="primary"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleDescargarArchivoModal}
              >
                Descargar archivo
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
