import { useState, type FC } from 'react';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';
import { entrevistasApi } from '../../../../services/entrevistas.service';
import { useCitasDelDia, useDisponibilidad } from '../../hooks/useAgendaEntrevistas';
import type { CitaVista, EstadoMarcadoRapido } from '../../types/entrevistas.types';
import { hoyEnLaPaz, sumarDias } from '../../utils/fechas';
import { EstadoCarga } from '../EstadoCarga';
import { CalendarioSemanal } from './CalendarioSemanal';
import { ListaDiariaCitas } from './ListaDiariaCitas';
import { MatrizCitasCatolider } from './MatrizCitasCatolider';
import { ModalReprogramar } from './ModalReprogramar';

/** Vista de Administración Pastoral y Catolíderes en P-07. */
export const PanelGestionCitas: FC = () => {
  const [dia, setDia] = useState(hoyEnLaPaz);
  const disponibilidad = useDisponibilidad(dia);
  const citas = useCitasDelDia(dia);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [aReprogramar, setAReprogramar] = useState<CitaVista | null>(null);
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

      <EstadoCarga cargando={disponibilidad.cargando && !disponibilidad.datos} error={disponibilidad.error} onReintentar={disponibilidad.recargar} />
      {disponibilidad.datos && (
        <CalendarioSemanal
          disponibilidad={disponibilidad.datos}
          onCambiarSemana={(d) => setDia(sumarDias(disponibilidad.datos?.semanaInicio ?? dia, d))}
          diaSeleccionado={dia}
          onSeleccionarDia={setDia}
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
