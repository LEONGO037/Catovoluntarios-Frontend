import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Heart,
  ChevronDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  HandHeart,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface HeroSectionProps {
  onOpenVideo: () => void;
  onScrollToDetails: () => void;
}

interface SlideItem {
  id: number;
  image: string;
  tag: string;
  tagIcon: React.ReactNode;
  title: string;
  message: string;
  subphrase: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenVideo,
  onScrollToDetails,
}) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideItem[] = [
    {
      id: 1,
      image: '/images/voluntarios/voluntarios-1.jpg',
      tag: 'Vocación & Ayuda Social',
      tagIcon: <HandHeart className="w-4 h-4 text-cato-gold" />,
      title: 'Tu tiempo y tu corazón pueden transformar vidas enteras.',
      message:
        'Súmate a la comunidad solidaria de la UCB La Paz. Sé la esperanza, la compañía y la alegría de quienes más lo necesitan en nuestra ciudad.',
      subphrase: '4 horas por semana que dejan una huella imborrable.',
    },
    {
      id: 2,
      image: '/images/voluntarios/voluntarios-2.jpg',
      tag: 'Esperanza & Empatía',
      tagIcon: <Heart className="w-4 h-4 text-cato-gold fill-cato-gold" />,
      title: 'Sembrando esperanza, afecto y dignidad en cada rincón.',
      message:
        'Acompaña a niños en hospitales, abuelitos en asilos y personas vulnerables en comedores comunitarios con el amor y carisma que te caracterizan.',
      subphrase: 'Manos que ayudan, corazones que escuchan y transforman realidades.',
    },
    {
      id: 3,
      image: '/images/voluntarios/voluntarios-3.jpg',
      tag: 'Fraternidad Universitaria',
      tagIcon: <Smile className="w-4 h-4 text-cato-gold" />,
      title: 'Manos jóvenes unidas por una misma misión de amor y fe.',
      message:
        'Conoce amigos extraordinarios de todas las carreras de la UCB mientras descubres el impacto real de tu vocación profesional al servicio de los demás.',
      subphrase: 'Crece como persona y como futuro profesional con valores sólidos.',
    },
    {
      id: 4,
      image: '/images/voluntarios/voluntarios-4.jpg',
      tag: 'Compromiso & Respaldo UCB',
      tagIcon: <ShieldCheck className="w-4 h-4 text-cato-gold" />,
      title: 'La fe se demuestra con obras: un voluntariado seguro y formativo.',
      message:
        'Con seguro estudiantil activo en campo, reposición diaria fija de pasajes en Bs y certificación institucional oficial avalada por Pastoral Universitaria.',
      subphrase: 'Acreditado y reconocido por la Universidad Católica Boliviana San Pablo.',
    },
  ];

  // Cambio automático del carrusel cada 5.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center text-white overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Carrusel de Fotografías de Fondo con Transición Suave */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-0 scale-100' : 'opacity-0 -z-10 scale-105'
          } transition-transform duration-[7000ms]`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }}
          aria-hidden={index !== currentSlide}
        />
      ))}

      {/* Capa de Gradiente Institucional Oscuro sobre las Fotos para Legibilidad Perfecta */}
      <div className="absolute inset-0 bg-gradient-to-r from-cato-navy/95 via-cato-navy/85 to-[#001830]/80 z-10 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 z-10" />

      {/* Contenido Central Inspirador y Minimalista */}
      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-6 pt-6 sm:pt-10">
        {/* Badge Dinámico del Mensaje */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-cato-gold text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm">
          {current.tagIcon}
          <span>{current.tag}</span>
          <span className="text-white/40">·</span>
          <span className="text-blue-100">Pastoral UCB 2/2026</span>
        </div>

        {/* Título Principal de Esperanza */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
          {current.title}
        </h1>

        {/* Mensaje Corto de Ayuda y Sensibilidad */}
        <p className="text-base sm:text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-sm">
          {current.message}
        </p>

        {/* Frase Destacada de Impacto */}
        <div className="inline-block px-4 py-2 rounded-xl bg-cato-gold/15 border border-cato-gold/30 text-cato-gold text-xs sm:text-sm font-bold backdrop-blur-sm">
          ✨ {current.subphrase}
        </div>

        {/* Botones de Acción Principales */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto">
          {/* 1. Postúlate Ahora (CTA Principal en Dorado) */}
          <Button
            variant="cta"
            size="lg"
            onClick={() => navigate('/postulacion')}
            className="w-full sm:w-auto text-base font-extrabold px-8 py-4 shadow-xl hover:shadow-cato-gold/40 hover:scale-105 transition-all"
            rightIcon={<ArrowRight className="w-5 h-5 text-cato-navy" />}
          >
            ¡Postúlate Ahora!
          </Button>

          {/* 2. Ver Video Oficial de Catovoluntarios */}
          <Button
            variant="outline"
            size="lg"
            onClick={onOpenVideo}
            className="w-full sm:w-auto text-sm sm:text-base border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-cato-gold backdrop-blur-md px-6 py-4"
            leftIcon={<Play className="w-5 h-5 text-cato-gold fill-cato-gold shrink-0" />}
          >
            Ver Video Catovoluntarios
          </Button>

          {/* 3. Botón de Saber Más (Navega a los datos detallados) */}
          <button
            onClick={onScrollToDetails}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold text-blue-200 hover:text-white px-5 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span>Saber Más</span>
            <ChevronDown className="w-4 h-4 text-cato-gold animate-bounce" />
          </button>
        </div>

        {/* Indicadores de Carrusel (Dots) y Flechas de Navegación Manual */}
        <div className="pt-8 flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            type="button"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition-colors"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                type="button"
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-cato-gold' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ir a foto ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            type="button"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition-colors"
            aria-label="Siguiente foto"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Flecha Flotante Inferior de Saber Más */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <button
          onClick={onScrollToDetails}
          type="button"
          className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-widest text-blue-200/80 hover:text-cato-gold font-bold transition-colors cursor-pointer"
        >
          <span>Conoce las etapas y proyectos</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-cato-gold" />
        </button>
      </div>
    </section>
  );
};
