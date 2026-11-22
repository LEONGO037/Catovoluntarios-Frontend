import React from 'react';
import { Phone, UserMinus, ExternalLink, Calendar } from 'lucide-react';
import type { VoluntarioAdmitido } from '../../types/proyectos.types';
import { formatWhatsAppUrl } from '../../../../utils/formatters';
import { Button } from '../../../../components/ui/Button';

export interface AssignedTableProps {
  volunteers: VoluntarioAdmitido[];
  onUnassign: (volunteerId: string) => void;
  canManage?: boolean;
}

export const AssignedTable: React.FC<AssignedTableProps> = ({
  volunteers,
  onUnassign,
  canManage = true,
}) => {
  if (volunteers.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-cato-border text-cato-muted text-xs">
        <p className="font-semibold text-cato-slate text-sm">
          No hay voluntarios asignados a este Proyecto Receptor
        </p>
        <p className="mt-1">
          Seleccione postulantes de la columna izquierda para ubicarlos en este centro.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-cato-border bg-white shadow-card">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-cato-surface-header border-b border-cato-border text-cato-slate font-bold uppercase tracking-wider text-[11px]">
            <th className="px-3.5 py-3">Voluntario</th>
            <th className="px-3.5 py-3">Celular (WhatsApp)</th>
            <th className="px-3.5 py-3">Carrera</th>
            <th className="px-3.5 py-3 text-center">Condición</th>
            <th className="px-3.5 py-3 text-center">Edad</th>
            <th className="px-3.5 py-3">Horario Comprometido</th>
            {canManage && <th className="px-3.5 py-3 text-right">Acción</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-cato-border">
          {volunteers.map((vol) => {
            const whatsAppUrl = formatWhatsAppUrl(vol.telefono);

            return (
              <tr
                key={vol.id}
                className="hover:bg-cato-canvas/60 transition-colors duration-100"
              >
                {/* Nombre y CI */}
                <td className="px-3.5 py-3 font-semibold text-cato-navy">
                  <div>{vol.nombre_completo}</div>
                  <div className="text-[10px] text-cato-muted font-normal font-mono">
                    CI: {vol.ci}
                  </div>
                </td>

                {/* Celular con enlace directo a WhatsApp */}
                <td className="px-3.5 py-3">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 font-bold transition-colors"
                    title="Abrir chat directo en WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+591 {vol.telefono}</span>
                    <ExternalLink className="w-3 h-3 text-emerald-600 opacity-70" />
                  </a>
                </td>

                {/* Carrera */}
                <td className="px-3.5 py-3 text-cato-text font-medium">
                  {vol.carrera}
                </td>

                {/* Condición */}
                <td className="px-3.5 py-3 text-center">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      vol.condicion === 'Nuevo'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {vol.condicion}
                  </span>
                </td>

                {/* Edad */}
                <td className="px-3.5 py-3 text-center text-cato-slate font-semibold">
                  {vol.edad}
                </td>

                {/* Horario */}
                <td className="px-3.5 py-3 text-cato-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cato-steel shrink-0" />
                    {vol.horario_comprometido}
                  </span>
                </td>

                {/* Acción desasignar */}
                {canManage && (
                  <td className="px-3.5 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUnassign(vol.id)}
                      className="text-[11px] h-7 px-2 text-red-600 hover:bg-red-50 hover:border-red-300"
                      title="Desasignar del proyecto"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>Desasignar</span>
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
