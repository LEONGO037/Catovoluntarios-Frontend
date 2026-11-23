import { useState, type FC } from 'react';
import { CalendarCheck, Clock, UserRound } from 'lucide-react';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { entrevistasApi } from '../../../../services/entrevistas.service';
import { cn } from '../../../../utils/cn';
import { ESTADO_CITA } from '../../constants/entrevistas.constants';
import { useDisponibilidad, useMiEntrevista } from '../../hooks/useAgendaEntrevistas';
import type { FranjaDisponible } from '../../types/entrevistas.types';
import { formatearFechaHora, hoyEnLaPaz, sumarDias } from '../../utils/fechas';
import { EstadoCarga } from '../EstadoCarga';
import { CalendarioSemanal } from './CalendarioSemanal';

/** Vista del Postulante en P-07: elegir fecha y turno libre según su tiempo disponible. */
export const SelectorTurnoPostulante: FC = () => {
  const mi = useMiEntrevista();
  const [semana, setSemana] = useState(hoyEnLaPaz);
  const disponibilidad = useDisponibilidad(semana);
  const [franja, setFranja] = useState<FranjaDisponible | null>(null);
  const [cambiando, setCambiando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  if (mi.cargando || mi.error) {
    return <EstadoCarga cargando={mi.cargando} error={mi.error} onReintentar={mi.recargar} />;
  }

  const postulacion = mi.datos?.postulacion ?? null;
  const entrevista = mi.datos?.entrevista ?? null;

  if (!postulacion) {
    return (
      <AlertBanner type="info" title="Sin postulación activa">
        No encontramos una postulación tuya en el semestre activo.
      </AlertBanner>
    );
  }
  if (!entrevista && postulacion.estadoPostulacion !== 'APTO_ENTREVISTA') {
    return (
      <AlertBanner type="warning" title="Aún no puedes agendar tu entrevista">
        Tu postulación ({postulacion.codigoPostulacion}) todavía está en revisión. Podrás elegir tu turno cuando
        Administración Pastoral la habilite para entrevista.
      </AlertBanner>
    );
  }

  const puedeElegir =
    !entrevista || entrevista.estado === 'REPROGRAMADA' || (entrevista.estado === 'PROGRAMADA' && cambiando);

  const confirmar = async () => {
    if (!franja) return;
    setEnviando(true);
    setError(null);
    try {
      if (entrevista) {
        await entrevistasApi.reprogramar(entrevista.id, franja.inicio);
        setExito('Tu entrevista fue reprogramada.');
      } else {
        await entrevistasApi.agendar(franja.inicio);
        setExito('¡Listo! Tu entrevista quedó agendada.');
      }
      setConfirmando(false);
      setCambiando(false);
      setFranja(null);
      await Promise.all([mi.recargar(), disponibilidad.recargar()]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo agendar la entrevista');
      setConfirmando(false);
      await disponibilidad.recargar();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-6">
      {exito && (
        <AlertBanner type="success" onClose={() => setExito(null)}>
          {exito}
        </AlertBanner>
      )}
      {error && (
        <AlertBanner type="danger" onClose={() => setError(null)}>
          {error}
        </AlertBanner>
      )}

      {entrevista && (
        <section className="cato-card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg">Tu entrevista presencial</h2>
            <span className={cn(ESTADO_CITA[entrevista.estado].clase)}>{ESTADO_CITA[entrevista.estado].etiqueta}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <p className="flex items-center gap-2 capitalize">
              <Clock className="w-4 h-4 text-cato-steel" /> {formatearFechaHora(entrevista.fechaHora)}
            </p>
            <p className="flex items-center gap-2">
              <UserRound className="w-4 h-4 text-cato-steel" /> Te entrevista: {entrevista.catoliderNombre ?? 'Por asignar'}
            </p>
          </div>
          {entrevista.estado === 'REPROGRAMADA' && (
            <AlertBanner type="warning">Tu cita debe reprogramarse. Elige un nuevo turno en el calendario.</AlertBanner>
          )}
          {entrevista.estado === 'FALTO' && (
            <AlertBanner type="warning">
              Tu inasistencia quedó registrada. Comunícate con tu Catolíder o con Administración Pastoral.
            </AlertBanner>
          )}
          {entrevista.estado === 'PROGRAMADA' && !cambiando && (
            <Button variant="outline" size="sm" onClick={() => setCambiando(true)}>
              Necesito cambiar mi turno
            </Button>
          )}
        </section>
      )}

      {puedeElegir && (
        <>
          <EstadoCarga
            cargando={disponibilidad.cargando && !disponibilidad.datos}
            error={disponibilidad.error}
            onReintentar={disponibilidad.recargar}
          />
          {disponibilidad.datos && (
            <CalendarioSemanal
              disponibilidad={disponibilidad.datos}
              onCambiarSemana={(d) => {
                setFranja(null);
                setSemana(sumarDias(semana, d));
              }}
              franjaSeleccionada={franja?.inicio ?? null}
              onSeleccionarFranja={setFranja}
            />
          )}
          <div className="flex flex-wrap justify-end gap-2">
            {cambiando && (
              <Button variant="outline" onClick={() => { setCambiando(false); setFranja(null); }}>
                Mantener mi turno actual
              </Button>
            )}
            <Button variant="cta" leftIcon={<CalendarCheck className="w-4 h-4" />} disabled={!franja} onClick={() => setConfirmando(true)}>
              {entrevista ? 'Confirmar nuevo turno' : 'Agendar entrevista'}
            </Button>
          </div>
        </>
      )}

      <Modal
        isOpen={confirmando && franja !== null}
        onClose={() => setConfirmando(false)}
        title="Confirma tu turno"
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmando(false)} disabled={enviando}>
              Volver
            </Button>
            <Button variant="primary" onClick={confirmar} isLoading={enviando}>
              Confirmar
            </Button>
          </div>
        }
      >
        <p className="text-sm capitalize">{franja ? formatearFechaHora(franja.inicio) : ''}</p>
        <p className="text-xs text-cato-muted mt-2">La entrevista es presencial. El sistema te asignará un Catolíder entrevistador.</p>
      </Modal>
    </div>
  );
};
