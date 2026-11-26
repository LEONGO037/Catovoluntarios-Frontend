import React from 'react';
import { Coins, Building2, CheckCircle2, Clock, Eye } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';

interface MiPasajeRow {
  id: number;
  mes: string;
  proyecto: string;
  diasAsistidos: number;
  tarifaBs: number;
  totalBs: number;
  estado: 'PAGADO' | 'EN REVISIÓN';
}

const MIS_PASAJES_MOCK: MiPasajeRow[] = [
  {
    id: 1,
    mes: 'Noviembre 2026',
    proyecto: 'Hogar San Ramón',
    diasAsistidos: 3,
    tarifaBs: 10,
    totalBs: 30,
    estado: 'EN REVISIÓN',
  },
  {
    id: 2,
    mes: 'Octubre 2026',
    proyecto: 'Hogar San Ramón',
    diasAsistidos: 4,
    tarifaBs: 10,
    totalBs: 40,
    estado: 'PAGADO',
  },
  {
    id: 3,
    mes: 'Septiembre 2026',
    proyecto: 'Hogar San Ramón',
    diasAsistidos: 4,
    tarifaBs: 10,
    totalBs: 40,
    estado: 'PAGADO',
  },
];

export const MisPasajesPage: React.FC = () => {
  const { user } = useAuth();
  const totalAcumulado = MIS_PASAJES_MOCK.reduce((acc, row) => acc + row.totalBs, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-700" />
            Reposición de Pasajes · Solo Lectura
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            Mi Planilla de Pasajes
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Consulta el detalle mensual de tus pasajes asignados según días asistidos en{' '}
            <strong className="text-cato-navy">{user?.proyectoNombre || 'Hogar San Ramón'}</strong>.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-cato-navy bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl">
          <Eye className="w-4 h-4" />
          <span>Vista Personal</span>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card">
          <p className="text-xs text-cato-muted font-medium">Tarifa Diaria Asignada</p>
          <p className="text-2xl font-black text-cato-navy mt-1">10 Bs / día</p>
        </div>
        <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card">
          <p className="text-xs text-cato-muted font-medium">Total Días Asistidos (Semestre)</p>
          <p className="text-2xl font-black text-cato-navy mt-1">11 días</p>
        </div>
        <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card">
          <p className="text-xs text-cato-muted font-medium">Total Reposición Acumulada</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{totalAcumulado} Bs</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-cato-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-cato-border">
          <h2 className="font-bold text-base text-cato-navy">Detalle de Mi Planilla Mensual</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cato-canvas border-b border-cato-border text-[11px] uppercase text-cato-muted font-bold">
                <th className="py-3 px-4">Mes</th>
                <th className="py-3 px-4">Proyecto Receptor</th>
                <th className="py-3 px-4">Días Asistidos</th>
                <th className="py-3 px-4">Tarifa Fija</th>
                <th className="py-3 px-4">Monto Total</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cato-border text-sm">
              {MIS_PASAJES_MOCK.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4 font-bold text-cato-navy">{row.mes}</td>
                  <td className="py-3 px-4 text-xs text-cato-slate">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-cato-muted" />
                      {row.proyecto}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{row.diasAsistidos} días</td>
                  <td className="py-3 px-4 text-xs text-cato-muted">{row.tarifaBs} Bs</td>
                  <td className="py-3 px-4 font-black text-cato-navy">{row.totalBs} Bs</td>
                  <td className="py-3 px-4">
                    {row.estado === 'PAGADO' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Entregado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        En Revisión Pastoral
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
