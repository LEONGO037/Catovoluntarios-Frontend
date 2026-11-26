import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Building2,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../components/ui/Button';

interface AsistenciaVoluntarioRow {
  id: number;
  voluntario: string;
  carrera: string;
  proyecto: string;
  fecha: string;
  horas: number;
  actividad: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'OBSERVADO';
}

const INITIAL_ASISTENCIAS: AsistenciaVoluntarioRow[] = [
  {
    id: 1,
    voluntario: 'Mateo Flores Aliaga',
    carrera: 'Ingeniería de Sistemas',
    proyecto: 'Hogar San Ramón',
    fecha: '2026-11-25',
    horas: 4,
    actividad: 'Taller de estimulación cognitiva y lectura grupal',
    estado: 'PENDIENTE',
  },
  {
    id: 2,
    voluntario: 'Sofía Alejandra Paz',
    carrera: 'Arquitectura',
    proyecto: 'Hogar San Ramón',
    fecha: '2026-11-21',
    horas: 4,
    actividad: 'Acompañamiento en comedor y juegos de mesa',
    estado: 'APROBADO',
  },
  {
    id: 3,
    voluntario: 'Diego Andrés Mamani',
    carrera: 'Psicología',
    proyecto: 'Hogar San Ramón',
    fecha: '2026-11-21',
    horas: 4,
    actividad: 'Dinámica recreativa con adultos mayores',
    estado: 'PENDIENTE',
  },
];

export const AsistenciaProyectosPage: React.FC = () => {
  const { user } = useAuth();
  const [registros, setRegistros] = useState<AsistenciaVoluntarioRow[]>(INITIAL_ASISTENCIAS);
  const [busqueda, setBusqueda] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const proyectoNombre = user?.proyectoNombre || 'Hogar San Ramón';

  const filtrados = registros.filter(
    (r) =>
      r.voluntario.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.actividad.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleActualizarEstado = (id: number, nuevoEstado: 'APROBADO' | 'OBSERVADO') => {
    setRegistros((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r)),
    );
    setToast(
      nuevoEstado === 'APROBADO'
        ? 'Asistencia aprobada correctamente.'
        : 'Registro marcado como observado.',
    );
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200 inline-flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-red-700" />
            Catolíder · {proyectoNombre}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            Asistencia de Mis Proyectos
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Supervisa y valida los registros de horas de los Catovoluntarios asignados a tus proyectos.
          </p>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-cato-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-cato-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cato-gold" />
            <h2 className="font-bold text-base text-cato-navy">Registros de Jornada</h2>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar voluntario..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-cato-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cato-canvas border-b border-cato-border text-[11px] uppercase text-cato-muted font-bold">
                <th className="py-3 px-4">Catovoluntario</th>
                <th className="py-3 px-4">Proyecto</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Horas</th>
                <th className="py-3 px-4">Actividad</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Validación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cato-border text-sm">
              {filtrados.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4">
                    <div className="font-bold text-cato-navy">{r.voluntario}</div>
                    <div className="text-xs text-cato-muted">{r.carrera}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-cato-slate">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-cato-muted" />
                      {r.proyecto}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">{r.fecha}</td>
                  <td className="py-3 px-4 font-bold text-cato-navy">{r.horas} hrs</td>
                  <td className="py-3 px-4 text-xs text-cato-slate max-w-xs">{r.actividad}</td>
                  <td className="py-3 px-4">
                    {r.estado === 'APROBADO' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Aprobado
                      </span>
                    ) : r.estado === 'OBSERVADO' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        Observado
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActualizarEstado(r.id, 'APROBADO')}
                        disabled={r.estado === 'APROBADO'}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleActualizarEstado(r.id, 'OBSERVADO')}
                        disabled={r.estado === 'OBSERVADO'}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        Observar
                      </Button>
                    </div>
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
