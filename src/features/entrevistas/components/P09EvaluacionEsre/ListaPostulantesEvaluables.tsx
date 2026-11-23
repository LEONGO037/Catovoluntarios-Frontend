import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Lock } from 'lucide-react';
import { Select } from '../../../../components/ui/Select';
import { cn } from '../../../../utils/cn';
import { DICTAMEN_ENTREVISTA, DICTAMEN_PSICOLOGICO } from '../../constants/entrevistas.constants';
import { usePostulantesEvaluables } from '../../hooks/useEvaluacionPsicologica';
import { formatearFechaHora } from '../../utils/fechas';
import { EstadoCarga } from '../EstadoCarga';

type Filtro = 'TODOS' | 'PENDIENTES' | 'EVALUADOS';

/** P-09 (listado): postulantes que asistieron a la entrevista. Uso exclusivo de Administración Pastoral. */
export const ListaPostulantesEvaluables: FC = () => {
  const { datos, cargando, error, recargar } = usePostulantesEvaluables();
  const [filtro, setFiltro] = useState<Filtro>('TODOS');

  const filas = (datos ?? []).filter((p) =>
    filtro === 'TODOS' ? true : filtro === 'PENDIENTES' ? p.evaluacion === null : p.evaluacion !== null,
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>Evaluación psicológica E-SRE</h1>
          <p className="text-sm text-cato-muted mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Módulo confidencial · solo Administración Pastoral
          </p>
        </div>
        <div className="w-56">
          <Select
            label="Mostrar"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as Filtro)}
            options={[
              { value: 'TODOS', label: 'Todos' },
              { value: 'PENDIENTES', label: 'Sin evaluación' },
              { value: 'EVALUADOS', label: 'Evaluados' },
            ]}
          />
        </div>
      </header>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {datos && !cargando && (
        <section className="cato-card p-0 overflow-hidden">
          {filas.length === 0 ? (
            <p className="p-6 text-sm text-cato-muted">No hay postulantes en esta vista.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cato-surface-header text-left text-xs font-semibold text-cato-slate uppercase">
                  <tr>
                    <th className="px-4 py-3">Postulante</th>
                    <th className="px-4 py-3">CI</th>
                    <th className="px-4 py-3">Carrera</th>
                    <th className="px-4 py-3">Entrevista</th>
                    <th className="px-4 py-3">Dictamen entrevista</th>
                    <th className="px-4 py-3">Dictamen psicológico</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-cato-border">
                  {filas.map((p) => (
                    <tr key={p.postulacionId}>
                      <td className="px-4 py-3 font-medium">{p.nombreCompleto}</td>
                      <td className="px-4 py-3">{p.ci}</td>
                      <td className="px-4 py-3">{p.carrera}</td>
                      <td className="px-4 py-3 capitalize">{formatearFechaHora(p.fechaEntrevista)}</td>
                      <td className="px-4 py-3">
                        {p.dictamenEntrevista ? (
                          <span className={DICTAMEN_ENTREVISTA[p.dictamenEntrevista].clase}>
                            {DICTAMEN_ENTREVISTA[p.dictamenEntrevista].etiqueta}
                          </span>
                        ) : (
                          <span className="text-xs text-cato-muted">Ficha pendiente</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {p.evaluacion ? (
                          <span className={cn(DICTAMEN_PSICOLOGICO[p.evaluacion.dictamen].clase)}>
                            {DICTAMEN_PSICOLOGICO[p.evaluacion.dictamen].etiqueta}
                          </span>
                        ) : (
                          <span className="text-xs text-cato-muted">Sin evaluación</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/psicologia/${p.postulacionId}`} className="btn-outline text-xs px-3 py-1.5">
                          <Brain className="w-3.5 h-3.5" />
                          {p.evaluacion ? 'Ver / editar' : 'Registrar'}
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
