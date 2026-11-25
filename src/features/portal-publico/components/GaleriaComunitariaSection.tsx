import type { FC } from 'react';
import { Camera, Heart, Users, MapPin } from 'lucide-react';

interface FotoMomento {
  id: number;
  image: string;
  titulo: string;
  categoria: string;
  lugar: string;
  descripcion: string;
}

export const GaleriaComunitariaSection: FC = () => {
  const momentos: FotoMomento[] = [
    {
      id: 1,
      image: '/images/voluntarios/galeria-adultos.jpg',
      titulo: 'Compañía y Entrega Solidaria',
      categoria: 'Adultos Mayores',
      lugar: 'Visitas Comunitarias & Hogar San Ramón',
      descripcion:
        'Acompañamiento humano, entrega de víveres y momentos de diálogo cercano con abuelitos de nuestra comunidad.',
    },
    {
      id: 2,
      image: '/images/voluntarios/galeria-medioambiente.jpg',
      titulo: 'Sembrando Vida y Cuidado Común',
      categoria: 'Medio Ambiente',
      lugar: 'Quebradas y Áreas Verdes de La Paz',
      descripcion:
        'Jornadas de reforestación y limpieza ambiental junto a organizaciones aliadas por un futuro sostenible.',
    },
    {
      id: 3,
      image: '/images/voluntarios/galeria-arte.jpg',
      titulo: 'Talleres Lúdicos y Estimulación',
      categoria: 'Salud e Inclusión',
      lugar: 'Centros Terapéuticos y Hospitales',
      descripcion:
        'Dinámicas de estimulación cognitiva, artes plásticas y pintura para despertar sonrisas en niños y jóvenes.',
    },
    {
      id: 4,
      image: '/images/voluntarios/galeria-amor.jpg',
      titulo: 'Fraternidad y Misión Universitaria',
      categoria: 'Comunidad UCB',
      lugar: 'Encuentros de Formación y Campo',
      descripcion:
        'Estudiantes de diversas carreras unidos con una sola vocación de servicio, empatía y amistad sincera.',
    },
  ];

  return (
    <section className="py-16 bg-cato-canvas px-4 sm:px-6 lg:px-8 border-b border-cato-border">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold text-cato-navy tracking-widest bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-cato-gold" />
            Galería de Experiencias Reales
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-cato-navy tracking-tight">
            Catovoluntarios en Acción
          </h2>
          <p className="text-sm sm:text-base text-cato-muted leading-relaxed">
            Cada fin de semana, jóvenes universitarios de la UCB transforman su tiempo libre en momentos de impacto, cariño y servicio comunitario.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {momentos.map((m) => (
            <div
              key={m.id}
              className="group bg-white rounded-2xl overflow-hidden border border-cato-border shadow-card hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Contenedor de Fotografía Real */}
              <div className="relative h-52 overflow-hidden bg-cato-slate/10">
                <img
                  src={m.image}
                  alt={m.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white bg-cato-navy/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/20">
                  {m.categoria}
                </span>
              </div>

              {/* Contenido Descriptivo */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-base text-cato-navy group-hover:text-cato-navy-dark transition-colors">
                    {m.titulo}
                  </h3>
                  <p className="text-xs text-cato-muted flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3 h-3 text-cato-gold shrink-0" />
                    <span>{m.lugar}</span>
                  </p>
                  <p className="text-xs text-cato-text/80 mt-2.5 leading-relaxed">
                    {m.descripcion}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-cato-muted">
                  <span className="flex items-center gap-1 text-cato-navy">
                    <Users className="w-3 h-3 text-cato-gold" />
                    Pastoral UCB
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                    Voluntariado
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
