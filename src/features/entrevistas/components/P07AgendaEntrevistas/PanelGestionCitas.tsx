import { useState, type FC } from 'react';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';
import { Button } from '../../../../components/ui/Button';
import { entrevistasApi } from '../../../../services/entrevistas.service';
import { useCitasDelDia, useDisponibilidad } from '../../hooks/useAgendaEntrevistas';
import type { CitaVista, EstadoMarcadoRapido, FranjaDisponible } from '../../types/entrevistas.types';
import { hoyEnLaPaz, sumarDias } from '../../utils/fechas';
import { EstadoCarga } from '../EstadoCarga';
import { CalendarioSemanal } from './CalendarioSemanal';
import { ListaDiariaCitas } from './ListaDiariaCitas';
import { MatrizCitasCatolider } from './MatrizCitasCatolider';
import { ModalReprogramar } from './ModalReprogramar';
import { ModalAsignarEntrevista } from './ModalAsignarEntrevista';
import { CalendarPlus } from 'lucide-react';

/** Vista de Administración Pastoral y Catolíderes en P-07. */
export const PanelGestionCitas: FC = () => {
  const [dia, setDia] = useState(hoyEnLaPaz);
  const disponibilidad = useDisponibilidad(dia);
  const citas = useCitasDelDia(dia);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [aReprogramar, setAReprogramar] = useState<CitaVista | null>(null);
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);
  const [franjaParaAsignar, setFranjaParaAsignar] = useState<FranjaDisponible | null>(null);
  const [aviso, setAviso] = useState<{ tipo: 'success' | 'danger'; texto: string } | null>(null);

  const refrescar = async () => {
    await Promise.all([citas.recargar(), disponibilidad.recargar()]);
  };

  const marcar = async (cita: CitaVista, estado: EstadoMarcadoRapido) => {
    setProcesandoId(cita.id);
    setAviso(null);
    try {
      await entrevistasApi.cambiarEstado(cita.id, estado);
      setAviso({ tipo: 'success', texto: `Cita de ${cita.postulante.nombreCompleto} actualizada.` });
      await refrescar();
    } catch (e) {
      setAviso({ tipo: 'danger', texto: e instanceof Error ? e.message : 'No se pudo actualizar la cita' });
    } finally {
      setProcesandoId(null);
    }
  };

  const horasDelDia =
    disponibilidad.datos?.dias.find((d) => d.fecha === dia)?.franjas.map((f) => f.hora) ??
    disponibilidad.datos?.dias[0]?.franjas.map((f) => f.hora) ??
    [];

  return (
    <div className="space-y-6">
      {aviso && (
        <AlertBanner type={aviso.tipo} onClose={() => setAviso(null)}>
          {aviso.texto}
        </AlertBanner>
      )}

      {/* Cabecera con botón de Agendar Entrevista */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-cato-border shadow-xs">
        <div>
          <h2 className="text-base font-bold text-cato-navy">Gestión de Turnos y Entrevistas (Cada 30 min)</h2>
          <p className="text-xs text-cato-muted">
            Haz clic en cualquier turno disponible del calendario o usa el botón para asignar un postulante directamente.
          </p>
        </div>
        <Button
          variant="cta"
          size="md"
          leftIcon={<CalendarPlus className="w-4 h-4 text-cato-navy" />}
          onClick={() => {
            setFranjaParaAsignar(null);
            setModalAsignarAbierto(true);
          }}
        >
          Agendar Entrevista a Postulante
        </Button>
      </div>

      <EstadoCarga cargando={disponibilidad.cargando && !disponibilidad.datos} error={disponibilidad.error} onReintentar={disponibilidad.recargar} />
      {disponibilidad.datos && (
        <CalendarioSemanal
          disponibilidad={disponibilidad.datos}
          onCambiarSemana={(d) => setDia(sumarDias(disponibilidad.datos?.semanaInicio ?? dia, d))}
          diaSeleccionado={dia}
          onSeleccionarDia={setDia}
          onSeleccionarFranja={(franja) => {
            setFranjaParaAsignar(franja);
            setModalAsignarAbierto(true);
          }}
        />
      )}

      <EstadoCarga cargando={citas.cargando && !citas.datos} error={citas.error} onReintentar={citas.recargar} />
      {citas.datos && (
        <>
          <ListaDiariaCitas
            fecha={dia}
            citas={citas.datos.citas}
            procesandoId={procesandoId}
            onMarcar={marcar}
            onReprogramar={setAReprogramar}
          />
          <MatrizCitasCatolider horas={horasDelDia} catolideres={citas.datos.catolideres} citas={citas.datos.citas} />
        </>
      )}

      {modalAsignarAbierto && (
        <ModalAsignarEntrevista
          catolideres={citas.datos?.catolideres || []}
          franjaInicial={franjaParaAsignar}
          onCerrar={() => {
            setModalAsignarAbierto(false);
            setFranjaParaAsignar(null);
          }}
          onAsignada={async () => {
            setAviso({ tipo: 'success', texto: '¡Entrevista agendada y asignada exitosamente!' });
            setModalAsignarAbierto(false);
            setFranjaParaAsignar(null);
            await refrescar();
          }}
        />
      )}

      {aReprogramar && (
        <ModalReprogramar
          cita={aReprogramar}
          permitirMarcarSinFecha
          onCerrar={() => setAReprogramar(null)}
          onReprogramada={async () => {
            setAviso({ tipo: 'success', texto: `Cita de ${aReprogramar.postulante.nombreCompleto} reprogramada.` });
            setAReprogramar(null);
            await refrescar();
          }}
        />
      )}
    </div>
  );
};
