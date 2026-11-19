import React from 'react';
import { Megaphone, UserCheck, Shuffle, HeartHandshake, ArrowRight } from 'lucide-react';

export const CicloEtapasSection: React.FC = () => {
  const etapas = [
    {
      num: '01',
      title: 'Etapa 1: Convocatoria',
      desc: 'Difusión en campus UCB, charlas en aulas y webinars con testimonios reales de voluntarios.',
      icon: Megaphone,
      color: 'bg-blue-600',
      badge: 'Fase Actual',
    },
    {
      num: '02',
      title: 'Etapa 2: Selección y Entrevista',
      desc: 'Formulario web anti-sobrecarga, entrevista presencial con un Catolíder y test psicotécnico E-SRE.',
      icon: UserCheck,
      color: 'bg-amber-500',
      badge: 'Próxima Semana',
    },
    {
      num: '03',
      title: 'Etapa 3: Ubicación de Voluntarios',
      desc: 'Emparejamiento inteligente entre tus afinidades, carreras y el proyecto receptor asignado.',
      icon: Shuffle,
      color: 'bg-emerald-600',
      badge: 'Inicio de Semestre',
    },
    {
      num: '04',
      title: 'Etapa 4: Desarrollo en Campo',
      desc: '4 horas semanales de servicio real, reposición de pasajes por día asistido y condecoración final.',
      icon: HeartHandshake,
      color: 'bg-purple-600',
      badge: 'Durante el Semestre',
    },
  ];

  return (
    <section id="etapas" className="py-16 bg-white border-y border-cato-border px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold text-cato-navy tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Estructura Institucional Pastoral UCB
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-cato-navy">
            El Ciclo de 4 Etapas de tu Voluntariado
          </h2>
          <p className="text-xs sm:text-sm text-cato-muted leading-relaxed">
            Un proceso transparente, ordenado y pensado para que tu experiencia solidaria se equilibre perfectamente con tus estudios universitarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {etapas.map((etapa, idx) => (
            <div
              key={idx}
              className="bg-cato-canvas border border-cato-border rounded-2xl p-6 relative hover:shadow-card hover:border-cato-slate transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl ${etapa.color} text-white flex items-center justify-center font-black shadow-md`}
                  >
                    <etapa.icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-gray-300">
                    {etapa.num}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cato-slate bg-white px-2 py-0.5 rounded border border-cato-border">
                    {etapa.badge}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-cato-navy mt-2">
                    {etapa.title}
                  </h3>
                  <p className="text-xs text-cato-muted mt-1 leading-relaxed">
                    {etapa.desc}
                  </p>
                </div>
              </div>

              {idx < 3 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white border border-cato-border rounded-full p-1 text-cato-muted shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
