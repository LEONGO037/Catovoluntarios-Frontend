import React, { useState } from 'react';
import {
  UploadCloud,
  FileBadge,
  CheckCircle2,
  Building2,
  FileText,
  Trash2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../components/ui/Button';

interface VoluntarioCertificadoReceptor {
  id: number;
  nombre: string;
  ci: string;
  carrera: string;
  horasCumplidas: number;
  archivoNombre?: string;
  fechaSubida?: string;
}

const INITIAL_VOLUNTARIOS: VoluntarioCertificadoReceptor[] = [
  {
    id: 3,
    nombre: 'Mateo Flores Aliaga',
    ci: '8392011 LP',
    carrera: 'Ingeniería de Sistemas',
    horasCumplidas: 62,
  },
  {
    id: 105,
    nombre: 'Sofía Alejandra Paz',
    ci: '7412890 LP',
    carrera: 'Arquitectura',
    horasCumplidas: 50,
    archivoNombre: 'Certificado_Hogar_San_Ramon_Sofia_Paz.pdf',
    fechaSubida: '2026-11-22 14:30',
  },
  {
    id: 108,
    nombre: 'Diego Andrés Mamani',
    ci: '9102345 LP',
    carrera: 'Psicología',
    horasCumplidas: 48,
  },
];

export const ReceptorCertificadosPage: React.FC = () => {
  const { user } = useAuth();
  const nombreProyecto = user?.proyectoNombre || 'Hogar San Ramón';

  const [lista, setLista] = useState<VoluntarioCertificadoReceptor[]>(INITIAL_VOLUNTARIOS);
  const [toast, setToast] = useState<string | null>(null);

  const handleFileChange = (volId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nowStr = new Date().toLocaleString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    setLista((prev) =>
      prev.map((v) =>
        v.id === volId
          ? {
              ...v,
              archivoNombre: file.name,
              fechaSubida: nowStr,
            }
          : v,
      ),
    );

    const vol = lista.find((v) => v.id === volId);
    setToast(`Certificado "${file.name}" cargado para ${vol?.nombre}.`);
    setTimeout(() => setToast(null), 4000);
    e.target.value = '';
  };

  const handleRemoveFile = (volId: number) => {
    setLista((prev) =>
      prev.map((v) =>
        v.id === volId ? { ...v, archivoNombre: undefined, fechaSubida: undefined } : v,
      ),
    );
  };

  const subidos = lista.filter((v) => !!v.archivoNombre).length;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-purple-700" />
            {nombreProyecto} · Certificación Institucional
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            Subir Certificados de Fundación
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Carga los certificados emitidos en el formato oficial de tu institución/fundación en formato PDF o imagen para cada Catovoluntario.
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
            Tu fundación emite y sube el certificado con su propio membrete, firma y formato institucional. Pastoral UCB emitirá por separado el certificado universitario oficial.
          </p>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Lista de Voluntarios para subir certificado */}
      <div className="grid grid-cols-1 gap-4">
        {lista.map((vol) => (
          <div
            key={vol.id}
            className="bg-white rounded-2xl border border-cato-border p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-cato-gold" />
                <h3 className="font-black text-base text-cato-navy">{vol.nombre}</h3>
                {vol.archivoNombre ? (
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
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
              {vol.archivoNombre ? (
                <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200 rounded-xl px-3.5 py-2">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-emerald-900 truncate max-w-[200px]">
                      {vol.archivoNombre}
                    </p>
                    <p className="text-[10px] text-emerald-700">Subido: {vol.fechaSubida}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(vol.id)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                    title="Eliminar y subir otro archivo"
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
                  onChange={(e) => handleFileChange(vol.id, e)}
                />
                <Button
                  type="button"
                  variant={vol.archivoNombre ? 'outline' : 'primary'}
                  size="sm"
                  className="pointer-events-none w-full sm:w-auto"
                  leftIcon={<UploadCloud className="w-4 h-4" />}
                >
                  {vol.archivoNombre ? 'Reemplazar PDF' : 'Subir Certificado (PDF/Img)'}
                </Button>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
