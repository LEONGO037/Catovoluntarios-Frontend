import React from 'react';

interface WizardStepperProps {
  pasoActual: number;
}

const PASOS = [
  { numero: 1, titulo: 'Identificación', subtitulo: 'Datos personales y UCB' },
  { numero: 2, titulo: 'Filtro Académico', subtitulo: 'Normativa anti-sobrecarga' },
  { numero: 3, titulo: 'Perfil y Vocación', subtitulo: 'Habilidades e intereses' },
  { numero: 4, titulo: 'Consentimiento', subtitulo: 'Menores y compromiso' },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({ pasoActual }) => {
  return (
    <div className="w-full py-4 mb-6">
      <div className="grid grid-cols-4 gap-2 relative">
        {PASOS.map((paso) => {
          const completado = pasoActual > paso.numero;
          const activo = pasoActual === paso.numero;

          return (
            <div key={paso.numero} className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  completado
                    ? 'bg-emerald-600 text-white'
                    : activo
                    ? 'bg-cato-navy text-cato-gold ring-4 ring-cato-gold/30'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {completado ? '✓' : paso.numero}
              </div>
              <span
                className={`mt-2 text-xs font-semibold ${
                  activo ? 'text-cato-navy font-bold' : 'text-slate-600'
                }`}
              >
                {paso.titulo}
              </span>
              <span className="hidden md:block text-[10px] text-slate-400 mt-0.5">
                {paso.subtitulo}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-slate-200 h-1 mt-3 rounded-full overflow-hidden">
        <div
          className="bg-cato-navy h-full transition-all duration-300"
          style={{ width: `${((pasoActual - 1) / 3) * 100}%` }}
        />
      </div>
    </div>
  );
};
