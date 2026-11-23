import type { FC } from 'react';
import { AppShell } from '../../../../components/layout/AppShell';
import { useAuth } from '../../../auth/hooks/useAuth';
import { CicloStepper } from './CicloStepper';
import { LayoutPostulante } from './LayoutPostulante';
import { PanelGestionCitas } from './PanelGestionCitas';
import { SelectorTurnoPostulante } from './SelectorTurnoPostulante';

/** P-07: Flujo del ciclo y agendamiento de entrevistas presenciales. */
export const P07AgendaEntrevistas: FC = () => {
  const { user } = useAuth();
  const esPostulante = user?.rol === 'POSTULANTE';

  const contenido = (
    <div className="space-y-6">
      <header>
        <h1>{esPostulante ? 'Agenda tu entrevista' : 'Turnos de entrevista'}</h1>
        <p className="text-sm text-cato-muted mt-1">
          {esPostulante
            ? 'Elige la fecha y el turno que mejor se acomoden a tu tiempo libre.'
            : 'Calendario semanal, lista diaria de postulantes citados y matriz por Catolíder entrevistador.'}
        </p>
      </header>
      <CicloStepper />
      {esPostulante ? <SelectorTurnoPostulante /> : <PanelGestionCitas />}
    </div>
  );

  return esPostulante ? <LayoutPostulante>{contenido}</LayoutPostulante> : <AppShell>{contenido}</AppShell>;
};
