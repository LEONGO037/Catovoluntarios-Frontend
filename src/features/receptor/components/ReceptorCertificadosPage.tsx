/* oxlint-disable react/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  FileBadge,
  CheckCircle2,
  Building2,
  FileText,
  Trash2,
  Clock,
  AlertCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useActiveSemester } from '../../../components/layout/active-semester';
import { Button } from '../../../components/ui/Button';
import { semaforosService } from '../../semaforos/services/semaforos.service';
import type { CertificadoFundacionItem } from '../../semaforos/types/semaforo.types';

interface VoluntarioItem {
  id: number;
  nombre: string;
  ci: string;
  carrera: string;
  horasCumplidas: number;
  certificado?: CertificadoFundacionItem;
}

export const ReceptorCertificadosPage: React.FC = () => {
  const { user } = useAuth();
  const semestreActivo = useActiveSemester();
  const proyectoId = user?.proyectoAsignadoId || 1;
  const [nombreProyecto, setNombreProyecto] = useState<string>(
    user?.proyectoNombre || 'Proyecto Receptor',
  );

  const [lista, setLista] = useState<VoluntarioItem[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [subiendoId, setSubiendoId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ tipo: 'success' | 'error'; mensaje: string } | null>(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      // 1. Obtener los voluntarios del proyecto
      const reporte = await semaforosService.obtenerReportesProyecto(proyectoId, 'Noviembre', 2026);
      if (reporte?.proyecto?.nombre) {
        setNombreProyecto(reporte.proyecto.nombre);
      }

      // 2. Obtener los certificados ya subidos por la fundación
      const certs = await semaforosService.obtenerCertificadosFundacionPorProyecto(
        proyectoId,
        semestreActivo,
      );

      const items: VoluntarioItem[] = (reporte?.voluntarios || []).map((v) => {
        const cert = certs.find((c) => c.idUsuario === v.idUsuario);
        return {
          id: v.idUsuario,
          nombre: v.nombreCompleto,
          ci: v.ci,
          carrera: v.carrera,
          horasCumplidas: v.horasMesEstimadas || 60,
          certificado: cert,
        };
      });

      setLista(items);
    } catch (error) {
      console.error('Error cargando datos de certificados de fundación:', error);
      setToast({
        tipo: 'error',
        mensaje: 'Error al conectar con el servidor para consultar los certificados.',
      });
    } finally {
      setCargando(false);
    }
  }, [proyectoId, semestreActivo]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const handleFileChange = async (
    volId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoId(volId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('proyectoId', String(proyectoId));
      formData.append('usuarioId', String(volId));
      formData.append('semestre', semestreActivo);

      const nuevoCert = await semaforosService.subirCertificadoFundacion(formData);

      setLista((prev) =>
        prev.map((v) => (v.id === volId ? { ...v, certificado: nuevoCert } : v)),
      );

      const vol = lista.find((v) => v.id === volId);
      setToast({
        tipo: 'success',
        mensaje: `Certificado "${file.name}" subido exitosamente para ${vol?.nombre}. Se notificó a Pastoral UCB.`,
      });
      setTimeout(() => setToast(null), 5000);
    } catch (err: any) {
      console.error('Error al subir certificado de fundación:', err);
      setToast({
        tipo: 'error',
        mensaje: err.message || 'Error al subir el archivo del certificado.',
      });
    } finally {
      setSubiendoId(null);
      e.target.value = '';
    }
  };

  const handleRemoveFile = async (volId: number, certId?: number) => {
    if (!certId) return;
    if (!window.confirm('¿Estás seguro de eliminar este certificado de la fundación?')) return;

    try {
      await semaforosService.eliminarCertificadoFundacion(certId);
      setLista((prev) =>
        prev.map((v) => (v.id === volId ? { ...v, certificado: undefined } : v)),
      );
      setToast({
        tipo: 'success',
        mensaje: 'Certificado eliminado correctamente.',
      });
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      console.error('Error al eliminar certificado:', err);
      setToast({
        tipo: 'error',
        mensaje: err.message || 'Error al eliminar el certificado.',
      });
    }
  };

  const subidos = lista.filter((v) => !!v.certificado).length;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-700" />
              {nombreProyecto} · Gestión {semestreActivo}
            </span>
            <button
              onClick={() => void cargarDatos()}
              className="p-1 text-cato-muted hover:text-cato-navy rounded-lg hover:bg-slate-100 transition-colors"
              title="Recargar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cargando ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            Subir Certificados de Fundación
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Carga los certificados emitidos en el formato oficial de tu institución o fundación (PDF/Imagen) para cada Catovoluntario participante.
          </p>
        </div>

        <div className="bg-white border border-cato-border rounded-xl px-4 py-2.5 shadow-xs text-right">
          <p className="text-[11px] text-cato-muted font-semibold uppercase">Progreso de Subida</p>
          <p className="text-lg font-black text-cato-navy">
            {subidos} / {lista.length} <span className="text-xs font-medium text-cato-muted">cargados</span>
          </p>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Doble Certificación Pastoral UCB</p>
          <p className="mt-0.5 text-blue-800/90">
            Tu fundación emite y sube el certificado con su propio membrete, firma y formato institucional. Pastoral UCB visualiza este respaldo y emite por separado el certificado universitario oficial.
          </p>
        </div>
      </div>

      {toast && (
        <div
          className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm ${
            toast.tipo === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {toast.tipo === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.mensaje}</span>
        </div>
      )}

      {/* Lista de Voluntarios */}
      {cargando ? (
        <div className="bg-white rounded-2xl border border-cato-border p-12 text-center shadow-card">
          <Loader2 className="w-8 h-8 text-cato-gold animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-cato-navy">Cargando voluntarios asignados a tu institución...</p>
        </div>
      ) : lista.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cato-border p-12 text-center shadow-card">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-cato-navy">No se encontraron voluntarios en este proyecto</h3>
          <p className="text-xs text-cato-muted mt-1 max-w-md mx-auto">
            Asegúrate de que la coordinación pastoral haya concluido las asignaciones de voluntarios para la gestión {semestreActivo}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {lista.map((vol) => (
            <div
              key={vol.id}
              className="bg-white rounded-2xl border border-cato-border p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <FileBadge className="w-5 h-5 text-cato-gold" />
                  <h3 className="font-black text-base text-cato-navy">{vol.nombre}</h3>
                  {vol.certificado ? (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Certificado Subido
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      Pendiente
                    </span>
                  )}
                </div>
                <p className="text-xs text-cato-muted">
                  CI: <strong>{vol.ci}</strong> · Carrera: {vol.carrera}
                </p>
                <p className="text-xs text-cato-slate font-semibold flex items-center gap-1.5 pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-cato-gold" />
                  <span>{vol.horasCumplidas} horas cumplidas en {nombreProyecto}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {vol.certificado ? (
                  <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200 rounded-xl px-3.5 py-2">
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-emerald-900 truncate max-w-[200px]">
                        {vol.certificado.nombreArchivo}
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        Subido: {new Date(vol.certificado.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={vol.certificado.urlPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Ver PDF en nueva pestaña"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(vol.id, vol.certificado?.id)}
                      className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Eliminar certificado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    disabled={subiendoId === vol.id}
                    onChange={(e) => void handleFileChange(vol.id, e)}
                  />
                  <Button
                    type="button"
                    variant={vol.certificado ? 'outline' : 'primary'}
                    size="sm"
                    disabled={subiendoId === vol.id}
                    className="pointer-events-none w-full sm:w-auto"
                    leftIcon={
                      subiendoId === vol.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )
                    }
                  >
                    {subiendoId === vol.id
                      ? 'Subiendo...'
                      : vol.certificado
                      ? 'Reemplazar PDF'
                      : 'Subir Certificado (PDF/Img)'}
                  </Button>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
