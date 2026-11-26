import React, { useState } from 'react';
import {
  Clock,
  Building2,
  PlusCircle,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  UserCheck,
  Smile,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../components/ui/Button';

interface RegistroHora {
  id: number;
  fecha: string;
  proyecto: string;
  horas: number;
  actividad: string;
  estado: 'APROBADO' | 'PENDIENTE';
}

const INITIAL_REGISTROS: RegistroHora[] = [
  {
    id: 1,
    fecha: '2026-11-21',
    proyecto: 'Hogar San Ramón',
    horas: 4,
    actividad: 'Taller de estimulación cognitiva y lectura grupal con abuelitos',
    estado: 'APROBADO',
  },
  {
    id: 2,
    fecha: '2026-11-14',
    proyecto: 'Hogar San Ramón',
    horas: 4,
    actividad: 'Apoyo en almuerzo y juegos de mesa recreativos',
    estado: 'APROBADO',
  },
  {
    id: 3,
    fecha: '2026-11-07',
    proyecto: 'Hogar San Ramón',
    horas: 4,
    actividad: 'Dinámicas musicales y acompañamiento en patio',
    estado: 'APROBADO',
  },
];

export const PortalVoluntarioPage: React.FC = () => {
  const { user } = useAuth();
  const proyectoNombre = user?.proyectoNombre || 'Hogar San Ramón';

  const [registros, setRegistros] = useState<RegistroHora[]>(INITIAL_REGISTROS);
  const [fecha, setFecha] = useState('2026-11-25');
  const [horas, setHoras] = useState(4);
  const [actividad, setActividad] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const horasBasePrevias = 50; // Horas acumuladas previas en el semestre
  const totalHoras = horasBasePrevias + registros.reduce((acc, r) => acc + r.horas, 0);
  const metaHoras = 64;
  const porcentaje = Math.min(100, Math.round((totalHoras / metaHoras) * 100));

  const handleRegistrarHoras = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actividad.trim() || horas <= 0) return;

    const nuevo: RegistroHora = {
      id: Date.now(),
      fecha,
      proyecto: proyectoNombre,
      horas: Number(horas),
      actividad: actividad.trim(),
      estado: 'PENDIENTE',
    };

    setRegistros((prev) => [nuevo, ...prev]);
    setActividad('');
    setToast('¡Tus horas fueron registradas y enviadas a tu Catolíder para validación!');
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-amber-700" />
            Portal del Catovoluntario
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            Mis Voluntariados y Registro de Horas
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Hola <strong className="text-cato-navy">{user?.nombres}</strong>, consulta tu proyecto asignado, horas acumuladas y registra tus jornadas.
          </p>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Tarjetas de Mi Voluntariado y Progreso */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mi Voluntariado Asignado */}
        <div className="bg-white rounded-2xl border border-cato-border p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-cato-muted tracking-wider">
              Voluntariado Actual
            </span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Activo
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cato-navy text-cato-gold flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-cato-navy">{proyectoNombre}</h3>
              <p className="text-xs text-cato-muted">Obrajes, Zona Sur · Sábados 09:00 - 13:00</p>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-cato-slate">
            <p className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-cato-gold" />
              <span>
                Catolíder: <strong>Camila Rojas Quispe</strong>
              </span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Seguro Estudiantil: <strong className="text-emerald-700">Vigente y Validado</strong>
              </span>
            </p>
          </div>
        </div>

        {/* Progreso de Horas */}
        <div className="bg-white rounded-2xl border border-cato-border p-5 shadow-card flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-cato-muted tracking-wider">
              Mis Horas Acumuladas
            </span>
            <Clock className="w-5 h-5 text-cato-gold" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cato-navy">{totalHoras}</span>
              <span className="text-sm text-cato-muted font-semibold">/ {metaHoras} hrs meta</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-cato-navy to-cato-gold rounded-full transition-all duration-300"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <p className="text-xs text-cato-muted mt-2 font-medium">
              Has completado el <strong className="text-cato-navy">{porcentaje}%</strong> de tu meta semestral.
            </p>
          </div>
        </div>

        {/* Formulario Rápido Registrar Horas */}
        <div className="bg-white rounded-2xl border border-cato-border p-5 shadow-card">
          <h3 className="font-black text-sm text-cato-navy flex items-center gap-2 mb-3">
            <PlusCircle className="w-4 h-4 text-cato-gold" />
            Registrar Mis Horas de Jornada
          </h3>
          <form onSubmit={handleRegistrarHoras} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-cato-slate mb-1">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  className="w-full border border-cato-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-cato-slate mb-1">Horas</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={horas}
                  onChange={(e) => setHoras(Number(e.target.value))}
                  required
                  className="w-full border border-cato-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-cato-slate mb-1">
                Actividad realizada
              </label>
              <input
                type="text"
                value={actividad}
                onChange={(e) => setActividad(e.target.value)}
                placeholder="Ej. Apoyo en comedor y talleres..."
                required
                className="w-full border border-cato-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
              />
            </div>
            <Button variant="cta" size="sm" type="submit" className="w-full font-bold">
              Registrar Jornada
            </Button>
          </form>
        </div>
      </div>

      {/* Historial de Jornadas */}
      <div className="bg-white rounded-2xl border border-cato-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-cato-border flex items-center justify-between">
          <h2 className="font-bold text-base text-cato-navy flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cato-gold" />
            Historial de Mis Horas Registradas
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cato-canvas border-b border-cato-border text-[11px] uppercase text-cato-muted font-bold">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Proyecto Receptor</th>
                <th className="py-3 px-4">Horas</th>
                <th className="py-3 px-4">Actividad Realizada</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cato-border text-sm">
              {registros.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4 text-xs font-semibold text-cato-navy">{r.fecha}</td>
                  <td className="py-3 px-4 text-xs text-cato-slate">{r.proyecto}</td>
                  <td className="py-3 px-4 font-bold text-cato-navy">{r.horas} hrs</td>
                  <td className="py-3 px-4 text-xs text-cato-slate">{r.actividad}</td>
                  <td className="py-3 px-4">
                    {r.estado === 'APROBADO' ? (
                      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Validado por Catolíder
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Pendiente de aprobación
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
