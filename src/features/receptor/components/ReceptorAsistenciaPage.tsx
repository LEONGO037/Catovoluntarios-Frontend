import React, { useState } from 'react';
import {
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Calendar,
  Users,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';

interface RegistroAsistenciaReceptor {
  id: number;
  voluntario: string;
  carrera: string;
  fecha: string;
  horario: string;
  horas: number;
  actividad: string;
  estado: 'ASISTIÓ' | 'JUSTIFICADO' | 'PENDIENTE';
}

const MOCK_ASISTENCIAS_CENTRO: RegistroAsistenciaReceptor[] = [
  {
    id: 1,
    voluntario: 'Mateo Flores Aliaga',
    carrera: 'Ingeniería de Sistemas',
    fecha: '2026-11-21',
    horario: '09:00 - 13:00',
    horas: 4,
    actividad: 'Taller de estimulación cognitiva y lectura grupal',
    estado: 'ASISTIÓ',
  },
  {
    id: 2,
    voluntario: 'Sofía Alejandra Paz',
    carrera: 'Arquitectura',
    fecha: '2026-11-21',
    horario: '09:00 - 13:00',
    horas: 4,
    actividad: 'Acompañamiento en comedor y juegos de mesa',
    estado: 'ASISTIÓ',
  },
  {
    id: 3,
    voluntario: 'Diego Andrés Mamani',
    carrera: 'Psicología',
    fecha: '2026-11-14',
    horario: '09:00 - 13:00',
    horas: 4,
    actividad: 'Dinámica recreativa con adultos mayores',
    estado: 'ASISTIÓ',
  },
  {
    id: 4,
    voluntario: 'Mateo Flores Aliaga',
    carrera: 'Ingeniería de Sistemas',
    fecha: '2026-11-14',
    horario: '09:00 - 13:00',
    horas: 4,
    actividad: 'Apoyo en mantenimiento y orden de sala común',
    estado: 'ASISTIÓ',
  },
  {
    id: 5,
    voluntario: 'Sofía Alejandra Paz',
    carrera: 'Arquitectura',
    fecha: '2026-11-07',
    horario: '09:00 - 13:00',
    horas: 0,
    actividad: 'Justificó inasistencia por examen parcial',
    estado: 'JUSTIFICADO',
  },
];

export const ReceptorAsistenciaPage: React.FC = () => {
  const { user } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const nombreProyecto = user?.proyectoNombre || 'Hogar San Ramón';

  const filtrados = MOCK_ASISTENCIAS_CENTRO.filter(
    (a) =>
      a.voluntario.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.actividad.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const totalHoras = filtrados.reduce((acc, r) => acc + r.horas, 0);
  const voluntariosUnicos = new Set(MOCK_ASISTENCIAS_CENTRO.map((r) => r.voluntario)).size;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-purple-700" />
            {nombreProyecto} · Solo Lectura
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            Control de Asistencia de Catovoluntarios
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Consulta los días asistidos y horas cumplidas de los voluntarios asignados a tu institución.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-800 bg-purple-50 border border-purple-200 px-3.5 py-2 rounded-xl">
          <Eye className="w-4 h-4" />
          <span>Modo Consulta Supervisora</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-cato-muted font-medium">Voluntarios en Centro</p>
            <p className="text-xl font-black text-cato-navy">{voluntariosUnicos}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-cato-muted font-medium">Horas Registradas</p>
            <p className="text-xl font-black text-cato-navy">{totalHoras} hrs</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-cato-navy flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-cato-muted font-medium">Gestión Activa</p>
            <p className="text-xl font-black text-cato-navy">2/2026</p>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-cato-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-cato-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-bold text-base text-cato-navy">Historial de Asistencias del Centro</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar voluntario o actividad..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-cato-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cato-canvas border-b border-cato-border text-[11px] uppercase text-cato-muted font-bold">
                <th className="py-3 px-4">Catovoluntario</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Horario</th>
                <th className="py-3 px-4">Horas</th>
                <th className="py-3 px-4">Actividad Realizada</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cato-border text-sm">
              {filtrados.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4">
                    <div className="font-bold text-cato-navy">{item.voluntario}</div>
                    <div className="text-xs text-cato-muted">{item.carrera}</div>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-cato-slate">{item.fecha}</td>
                  <td className="py-3 px-4 text-xs text-cato-muted">{item.horario}</td>
                  <td className="py-3 px-4 font-bold text-cato-navy">{item.horas} hrs</td>
                  <td className="py-3 px-4 text-xs text-cato-slate max-w-xs">{item.actividad}</td>
                  <td className="py-3 px-4">
                    {item.estado === 'ASISTIÓ' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Asistió
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        Justificado
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
