import type { FC } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { CICLO_ETAPAS, ETAPA_ACTUAL_M03 } from '../../constants/entrevistas.constants';

/** Stepper horizontal con las 4 fases del ciclo de voluntariado (P-07). */
export const CicloStepper: FC = () => (
  <nav aria-label="Ciclo de voluntariado" className="cato-card py-4">
    <ol className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
      {CICLO_ETAPAS.map((etapa, i) => {
        const completada = i < ETAPA_ACTUAL_M03;
        const actual = i === ETAPA_ACTUAL_M03;
        return (
          <li key={etapa} className="flex items-center flex-1 min-w-0" aria-current={actual ? 'step' : undefined}>
            <span
              className={cn(
                'w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold border-2',
                completada && 'bg-cato-navy border-cato-navy text-white',
                actual && 'bg-cato-gold border-cato-gold text-cato-navy',
                !completada && !actual && 'bg-white border-cato-border text-cato-muted',
              )}
            >
              {completada ? <Check className="w-4 h-4" /> : i + 1}
            </span>
            <span
              className={cn(
                'ml-2 text-sm truncate',
                actual ? 'font-bold text-cato-navy' : 'text-cato-muted',
              )}
            >
              {etapa}
            </span>
            {i < CICLO_ETAPAS.length - 1 && (
              <span
                className={cn(
                  'hidden sm:block flex-1 h-0.5 mx-3',
                  completada ? 'bg-cato-navy' : 'bg-cato-border',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
