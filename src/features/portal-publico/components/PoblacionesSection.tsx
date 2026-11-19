import React from 'react';
import { Users, MapPin, Bus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const PoblacionesSection: React.FC = () => {
  const navigate = useNavigate();

  const centros = [
    {
      nombre: 'Hogar San Ramón',
      zona: 'Obrajes, Zona Sur',
      poblacion: 'Adultos Mayores / Geriatría y Memoria',
      pasaje: '10 Bs / día',
      desc: 'Talleres de estimulación cognitiva, lectura grupal, bingo y compañía humana afectuosa.',
      tag: 'Adultos Mayores',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      nombre: 'Comedor San Calixto',
      zona: 'Casco Central, Calle Indaburo',
      poblacion: 'Personas en situación de vulnerabilidad y calle',
      pasaje: '10 Bs / día',
      desc: 'Entrega de almuerzos calientes, servicio de mesas, escucha activa y contención solidaria.',
      tag: 'Comedores Populares',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      nombre: 'Hospital del Niño',
      zona: 'Miraflores, Complejo Hospitalario',
      poblacion: 'Niñez hospitalizada y salud pediátrica',
      pasaje: '12 Bs / día',
      desc: 'Ludoteca, dinámicas de clown hospitalario, apoyo escolar a pacientes y cuentacuentos.',
      tag: 'Salud y Niñez',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      nombre: 'Centro Terapéutico Kallpa',
      zona: 'Calacoto, Calle 21',
      poblacion: 'Personas con discapacidad y autismo',
      pasaje: '15 Bs / día',
      desc: 'Acompañamiento psicomotriz, artes plásticas y actividades de integración comunitaria.',
      tag: 'Inclusión',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ];

  return (
    <section id="poblaciones" className="py-16 bg-cato-canvas px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-cato-navy tracking-widest bg-blue-100 text-cato-navy px-3 py-1 rounded-full">
              Proyectos Receptores Conveniados
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
              ¿Dónde Puedes Realizar tu Voluntariado?
            </h2>
            <p className="text-xs sm:text-sm text-cato-muted mt-1 max-w-xl">
              Pastoral UCB mantiene convenios oficiales con centros de impacto social en La Paz. Tu seguro estudiantil te cubre en cada jornada.
            </p>
          </div>

          <Button
            variant="cta"
            size="sm"
            onClick={() => navigate('/postulacion')}
            className="self-start sm:self-auto shrink-0 shadow-sm"
          >
            Quiero Elegir mi Población
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {centros.map((centro, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-cato-border p-5 shadow-card hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${centro.tagColor}`}
                  >
                    {centro.tag}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-cato-navy bg-blue-50 px-2 py-0.5 rounded-md">
                    <Bus className="w-3 h-3 text-cato-navy" />
                    <span>{centro.pasaje}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-cato-navy">{centro.nombre}</h4>
                  <p className="text-xs text-cato-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-cato-slate" />
                    {centro.zona}
                  </p>
                </div>

                <p className="text-xs text-cato-slate leading-relaxed">{centro.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-cato-muted font-medium">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cato-slate" />
                  Cupos limitados
                </span>
                <span className="text-emerald-700 font-bold">Convenio Vigente</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
