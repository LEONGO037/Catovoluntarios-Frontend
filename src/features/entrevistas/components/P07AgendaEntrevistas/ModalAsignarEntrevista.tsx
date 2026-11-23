import { useState, useEffect, type FC } from 'react';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { entrevistasApi } from '../../../../services/entrevistas.service';
import { postulacionesApi } from '../../../../services/postulaciones.service';
import { useDisponibilidad } from '../../hooks/useAgendaEntrevistas';
import type { FranjaDisponible, CatoliderActivo } from '../../types/entrevistas.types';
import type { Postulacion } from '../../../admision/types/postulacion.types';
import { formatearFechaHora, hoyEnLaPaz, sumarDias } from '../../utils/fechas';
import { EstadoCarga } from '../EstadoCarga';
import { CalendarioSemanal } from './CalendarioSemanal';
import { Calendar, User, UserCheck } from 'lucide-react';

interface ModalAsignarEntrevistaProps {
  catolideres: CatoliderActivo[];
  franjaInicial?: FranjaDisponible | null;
  onCerrar: () => void;
  onAsignada: () => void;
}

export const ModalAsignarEntrevista: FC<ModalAsignarEntrevistaProps> = ({
  catolideres,
  franjaInicial,
  onCerrar,
  onAsignada,
}) => {
  const [semana, setSemana] = useState(hoyEnLaPaz);
  const [franja, setFranja] = useState<FranjaDisponible | null>(franjaInicial ?? null);
  const [postulanteId, setPostulanteId] = useState<number | null>(null);
  const [catoliderId, setCatoliderId] = useState<number | null>(null);
  const [postulantes, setPostulantes] = useState<Postulacion[]>([]);
  const [cargandoPostulantes, setCargandoPostulantes] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disponibilidad = useDisponibilidad(semana);

  useEffect(() => {
    async function cargarPostulantes() {
      try {
        setCargandoPostulantes(true);
        const res = await postulacionesApi.obtenerPostulaciones({ limit: 100 });
        setPostulantes(res.items || []);
        if (res.items && res.items.length > 0) {
          setPostulanteId(res.items[0].id);
        }
      } catch (err) {
        console.error('Error cargando postulantes', err);
      } finally {
        setCargandoPostulantes(false);
      }
    }
    cargarPostulantes();
  }, []);

  const handleConfirmar = async () => {
    if (!franja || !postulanteId) return;
    setEnviando(true);
    setError(null);
    try {
      await entrevistasApi.agendar(franja.inicio, postulanteId, catoliderId || undefined);
      onAsignada();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo agendar la entrevista');
    } finally {
      setEnviando(false);
    }
  };

  const postulanteSeleccionado = postulantes.find((p) => p.id === postulanteId);

  return (
    <Modal
      isOpen
      onClose={onCerrar}
      maxWidth="4xl"
      title="Agendar Entrevista a Postulante"
      subtitle="Elige al postulante, el horario (bloques de 30 min) y el Catolíder entrevistador"
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!franja || !postulanteId || enviando}
            isLoading={enviando}
            onClick={handleConfirmar}
          >
            Confirmar y Agendar
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {error && <AlertBanner type="danger">{error}</AlertBanner>}

        {/* Sección 1: Selección de Postulante y Catolíder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-cato-canvas p-4 rounded-xl border border-cato-border">
          <div>
            <label className="block text-xs font-bold text-cato-navy uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cato-gold" /> Postulante (Entrevistado):
            </label>
            {cargandoPostulantes ? (
              <p className="text-xs text-cato-muted">Cargando postulantes...</p>
            ) : postulantes.length === 0 ? (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                No hay postulantes registrados aún.
              </p>
            ) : (
              <select
                value={postulanteId ?? ''}
                onChange={(e) => setPostulanteId(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-cato-border bg-white text-cato-text focus:ring-2 focus:ring-cato-navy focus:outline-none"
              >
                {postulantes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.codigoPostulacion} - {p.nombres} {p.primerApellido} ({p.carrera || 'Carrera N/A'})
                  </option>
                ))}
              </select>
            )}
            {postulanteSeleccionado && (
              <p className="text-[11px] text-cato-muted mt-1">
                CI: {postulanteSeleccionado.ci} · Estado: {postulanteSeleccionado.estado}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-cato-navy uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cato-gold" /> Catolíder Entrevistador:
            </label>
            <select
              value={catoliderId ?? ''}
              onChange={(e) => setCatoliderId(e.target.value ? Number(e.target.value) : null)}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-cato-border bg-white text-cato-text focus:ring-2 focus:ring-cato-navy focus:outline-none"
            >
              <option value="">-- Asignación Automática (Recomendado) --</option>
              {catolideres.map((c) => (
                <option key={c.userId} value={c.userId}>
                  {c.nombreCompleto}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-cato-muted mt-1">
              Si se deja en automático, el sistema balancea la carga entre los Catolíderes activos.
            </p>
          </div>
        </div>

        {/* Sección 2: Selección de Horario */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cato-navy uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cato-gold" /> Selecciona la fecha y turno (30 minutos):
            </span>
            {franja && (
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Seleccionado: {formatearFechaHora(franja.inicio)}
              </span>
            )}
          </div>

          <EstadoCarga
            cargando={disponibilidad.cargando}
            error={disponibilidad.error}
            onReintentar={disponibilidad.recargar}
          />

          {disponibilidad.datos && !disponibilidad.cargando && (
            <CalendarioSemanal
              disponibilidad={disponibilidad.datos}
              onCambiarSemana={(d) => setSemana(sumarDias(semana, d))}
              franjaSeleccionada={franja?.inicio ?? null}
              onSeleccionarFranja={setFranja}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
