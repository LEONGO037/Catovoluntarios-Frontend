import type { FC } from 'react';
import { cn } from '../../../../utils/cn';
import { ESTADO_CITA } from '../../constants/entrevistas.constants';
import type { CatoliderActivo, CitaVista } from '../../types/entrevistas.types';

interface MatrizCitasCatoliderProps {
  horas: string[];
  catolideres: CatoliderActivo[];
  citas: CitaVista[];
}

/** Matriz del día: franjas (filas) × Catolíder entrevistador (columnas). */
export const MatrizCitasCatolider: FC<MatrizCitasCatoliderProps> = ({ horas, catolideres, citas }) => {
  const porCelda = new Map(citas.map((c) => [`${c.hora}|${c.catoliderId ?? 0}`, c]));
  const sinAsignar = citas.filter((c) => c.catoliderId === null || !catolideres.some((l) => l.userId === c.catoliderId));

  return (
    <section className="cato-card space-y-4">
      <header>
        <h2 className="text-lg">Matriz de citas por Catolíder</h2>
        <p className="text-xs text-cato-muted">{catolideres.length} Catolíder(es) activo(s) en el semestre</p>
      </header>
      {catolideres.length === 0 ? (
        <p className="text-sm text-cato-muted">No hay Catolíderes activos asignados este semestre.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-cato-surface-header">
                <th className="sticky left-0 bg-cato-surface-header border border-cato-border-table px-3 py-2 text-left text-xs font-semibold text-cato-slate">
                  Hora
                </th>
                {catolideres.map((l) => (
                  <th key={l.userId} className="border border-cato-border-table px-3 py-2 text-left text-xs font-semibold text-cato-slate whitespace-nowrap">
                    <span className="badge-role-catolider mr-1">Catolíder</span>
                    {l.nombreCompleto}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora) => (
                <tr key={hora}>
                  <td className="sticky left-0 bg-white border border-cato-border-table px-3 py-1.5 font-semibold text-cato-navy">
                    {hora}
                  </td>
                  {catolideres.map((l) => {
                    const cita = porCelda.get(`${hora}|${l.userId}`);
                    return (
                      <td key={l.userId} className="border border-cato-border-table px-3 py-1.5 align-top min-w-[180px]">
                        {cita ? (
                          <div className="space-y-1">
                            <p className="font-medium text-cato-text truncate">{cita.postulante.nombreCompleto}</p>
                            <span className={cn(ESTADO_CITA[cita.estado].clase)}>{ESTADO_CITA[cita.estado].etiqueta}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-cato-muted">Libre</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {sinAsignar.length > 0 && (
        <p className="text-xs text-cato-muted">
          {sinAsignar.length} cita(s) con un Catolíder que ya no está activo; aparecen en la lista diaria.
        </p>
      )}
    </section>
  );
};
