import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { useListaFichas } from '../../hooks/useFichaEntrevista';
import { formatearFechaHora } from '../../utils/fechas';
import { EstadoCarga } from '../EstadoCarga';

/** P-08 (listado): entrevistas con asistencia confirmada y estado de su ficha. */
export const ListaFichasEntrevista: FC = () => {
  const { datos, cargando, error, recargar } = useListaFichas();

  return (
    <div className="space-y-6">
      <header>
        <h1>Ficha digital de entrevista</h1>
        <p className="text-sm text-cato-muted mt-1">
          Postulantes que asistieron a su entrevista. La ficha se habilita cuando la cita está marcada como «Asistió».
        </p>
      </header>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {datos && !cargando && (
        <section className="cato-card p-0 overflow-hidden">
          {datos.length === 0 ? (
            <p className="p-6 text-sm text-cato-muted">Todavía no hay entrevistas con asistencia registrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cato-surface-header text-left text-xs font-semibold text-cato-slate uppercase">
                  <tr>
                    <th className="px-4 py-3">Postulante</th>
                    <th className="px-4 py-3">CI</th>
                    <th className="px-4 py-3">Carrera</th>
                    <th className="px-4 py-3">Fecha de entrevista</th>
                    <th className="px-4 py-3">Catolíder</th>
                    <th className="px-4 py-3">Ficha</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-cato-border">
                  {datos.map((cita) => (
                    <tr key={cita.id}>
                      <td className="px-4 py-3 font-medium">{cita.postulante.nombreCompleto}</td>
                      <td className="px-4 py-3">{cita.postulante.ci}</td>
                      <td className="px-4 py-3">{cita.postulante.carrera}</td>
                      <td className="px-4 py-3 capitalize">{formatearFechaHora(cita.fechaHora)}</td>
                      <td className="px-4 py-3">{cita.catoliderNombre ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={cn(cita.fichaRegistrada ? 'badge-semaforo-green' : 'badge-semaforo-amber')}>
                          {cita.fichaRegistrada ? 'Registrada' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/ficha-entrevista/${cita.id}`} className="btn-outline text-xs px-3 py-1.5">
                          <ClipboardList className="w-3.5 h-3.5" />
                          {cita.fichaRegistrada ? 'Ver / editar' : 'Llenar ficha'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
