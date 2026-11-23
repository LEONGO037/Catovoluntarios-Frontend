import { useState, type FC } from 'react';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { entrevistasApi } from '../../../../services/entrevistas.service';
import { useDisponibilidad } from '../../hooks/useAgendaEntrevistas';
import type { CitaVista, FranjaDisponible } from '../../types/entrevistas.types';
import { formatearFechaHora, hoyEnLaPaz, sumarDias } from '../../utils/fechas';
import { EstadoCarga } from '../EstadoCarga';
import { CalendarioSemanal } from './CalendarioSemanal';

interface ModalReprogramarProps {
  cita: CitaVista;
  onCerrar: () => void;
  onReprogramada: () => void;
  /** Admin/Catolíder pueden dejar la cita "por reprogramar" para que el postulante elija. */
  permitirMarcarSinFecha: boolean;
}

export const ModalReprogramar: FC<ModalReprogramarProps> = ({
  cita,
  onCerrar,
  onReprogramada,
  permitirMarcarSinFecha,
}) => {
  const [semana, setSemana] = useState(() => (cita.fecha > hoyEnLaPaz() ? cita.fecha : hoyEnLaPaz()));
  const [franja, setFranja] = useState<FranjaDisponible | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const disponibilidad = useDisponibilidad(semana);

  const ejecutar = async (accion: () => Promise<unknown>) => {
    setEnviando(true);
    setError(null);
    try {
      await accion();
      onReprogramada();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo reprogramar la cita');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onCerrar}
      maxWidth="4xl"
      title="Reprogramar cita"
      subtitle={`${cita.postulante.nombreCompleto} · cita actual: ${formatearFechaHora(cita.fechaHora)}`}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          {permitirMarcarSinFecha && cita.estado !== 'REPROGRAMADA' && (
            <Button
              variant="secondary"
              disabled={enviando}
              onClick={() => ejecutar(() => entrevistasApi.cambiarEstado(cita.id, 'REPROGRAMADA'))}
            >
              Marcar «por reprogramar» (elige el postulante)
            </Button>
          )}
          <Button
            variant="primary"
            disabled={!franja || enviando}
            isLoading={enviando}
            onClick={() => franja && ejecutar(() => entrevistasApi.reprogramar(cita.id, franja.inicio))}
          >
            Confirmar nueva fecha
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && <AlertBanner type="danger">{error}</AlertBanner>}
        {franja && (
          <AlertBanner type="info">Nueva fecha: {formatearFechaHora(franja.inicio)}</AlertBanner>
        )}
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
    </Modal>
  );
};
