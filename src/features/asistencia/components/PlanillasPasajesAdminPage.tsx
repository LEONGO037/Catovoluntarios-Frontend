import React, { useState } from 'react';
import { Coins, Building2, CheckCircle2, Search, Download } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PlanillaAdminRow {
  id: number;
  voluntario: string;
  ci: string;
  proyecto: string;
  diasAsistidos: number;
  tarifaBs: number;
  totalBs: number;
  estado: 'PENDIENTE' | 'LIQUIDADO';
}

const INITIAL_PLANILLAS: PlanillaAdminRow[] = [
  {
    id: 1,
    voluntario: 'Mateo Flores Aliaga',
    ci: '8392011',
    proyecto: 'Hogar San Ramón',
    diasAsistidos: 4,
    tarifaBs: 10,
    totalBs: 40,
    estado: 'PENDIENTE',
  },
  {
    id: 2,
    voluntario: 'Valentina Gutiérrez Arce',
    ci: '6712345',
    proyecto: 'Hospital del Niño',
    diasAsistidos: 4,
    tarifaBs: 12,
    totalBs: 48,
    estado: 'LIQUIDADO',
  },
  {
    id: 3,
    voluntario: 'Lucía Fernanda Torrez',
    ci: '7823411',
    proyecto: 'Comedor San Calixto',
    diasAsistidos: 3,
    tarifaBs: 10,
    totalBs: 30,
    estado: 'PENDIENTE',
  },
  {
    id: 4,
    voluntario: 'Sebastián Quiroga Mamani',
    ci: '8901234',
    proyecto: 'Centro Terapéutico Kallpa',
    diasAsistidos: 4,
    tarifaBs: 15,
    totalBs: 60,
    estado: 'LIQUIDADO',
  },
];

export const PlanillasPasajesAdminPage: React.FC = () => {
  const [planillas, setPlanillas] = useState<PlanillaAdminRow[]>(INITIAL_PLANILLAS);
  const [busqueda, setBusqueda] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const filtrados = planillas.filter(
    (p) =>
      p.voluntario.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.proyecto.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const totalGeneralBs = filtrados.reduce((acc, p) => acc + p.totalBs, 0);

  const handleLiquidar = (id: number) => {
    setPlanillas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: 'LIQUIDADO' } : p)),
    );
    setToast('Planilla marcada como liquidada.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-700" />
            Administración Pastoral · Finanzas
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            Planillas de Reposición de Pasajes
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Supervisa el cálculo automático de viáticos por día asistido y aprueba la liquidación mensual.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setToast('Resumen contable listo para impresión.');
            setTimeout(() => setToast(null), 3000);
          }}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Exportar Reporte Mensual
        </Button>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card">
          <p className="text-xs text-cato-muted font-medium">Total Voluntarios en Planilla</p>
          <p className="text-2xl font-black text-cato-navy mt-1">{filtrados.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card">
          <p className="text-xs text-cato-muted font-medium">Monto Total del Mes</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{totalGeneralBs} Bs</p>
        </div>
        <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card">
          <p className="text-xs text-cato-muted font-medium">Gestión Activa</p>
          <p className="text-2xl font-black text-cato-navy mt-1">Noviembre 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-cato-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-cato-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-bold text-base text-cato-navy">Desglose por Voluntario</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar voluntario o centro..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-cato-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cato-canvas border-b border-cato-border text-[11px] uppercase text-cato-muted font-bold">
                <th className="py-3 px-4">Catovoluntario</th>
                <th className="py-3 px-4">CI</th>
                <th className="py-3 px-4">Proyecto Receptor</th>
                <th className="py-3 px-4">Días Asistidos</th>
                <th className="py-3 px-4">Tarifa</th>
                <th className="py-3 px-4">Total (Bs)</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cato-border text-sm">
              {filtrados.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4 font-bold text-cato-navy">{p.voluntario}</td>
                  <td className="py-3 px-4 text-xs text-cato-muted">{p.ci}</td>
                  <td className="py-3 px-4 text-xs text-cato-slate">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-cato-muted" />
                      {p.proyecto}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{p.diasAsistidos} días</td>
                  <td className="py-3 px-4 text-xs text-cato-muted">{p.tarifaBs} Bs</td>
                  <td className="py-3 px-4 font-black text-cato-navy">{p.totalBs} Bs</td>
                  <td className="py-3 px-4">
                    {p.estado === 'LIQUIDADO' ? (
                      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Liquidado
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLiquidar(p.id)}
                      disabled={p.estado === 'LIQUIDADO'}
                    >
                      {p.estado === 'LIQUIDADO' ? 'Pagado' : 'Marcar Pagado'}
                    </Button>
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
