import React, { useState } from 'react';
import { PublicNavbar } from '../../../components/layout/PublicNavbar';
import { HeroSection } from './HeroSection';
import { CicloEtapasSection } from './CicloEtapasSection';
import { PoblacionesSection } from './PoblacionesSection';
import { VideoSecradModal } from './VideoSecradModal';
import { Heart, Mail, Phone, MapPin, Sparkles, ArrowRight, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const LandingPage: React.FC = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const navigate = useNavigate();

  const handleScrollToDetails = () => {
    const el = document.getElementById('detalles-programa');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cato-canvas flex flex-col text-cato-text">
      {/* Header Público Simplificado: Solo Logo, Soy Catovoluntario y Postúlate Ahora */}
      <PublicNavbar />

      {/* Hero Section con Carrusel de Fotos de Fondo, Mensajes Cortos de Esperanza y Botón Saber Más */}
      <HeroSection
        onOpenVideo={() => setShowVideoModal(true)}
        onScrollToDetails={handleScrollToDetails}
      />

      {/* Sección Detallada del Programa (Solo visible o accesible al hacer clic en Saber Más o scroll) */}
      <div id="detalles-programa" className="scroll-mt-16">
        {/* Banner de Introducción al Detalle */}
        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-cato-border text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold text-cato-navy tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cato-gold" />
              Todo lo que necesitas saber
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-cato-navy">
              ¿Cómo funciona Catovoluntarios en la UCB?
            </h2>
            <p className="text-sm sm:text-base text-cato-muted max-w-2xl mx-auto leading-relaxed">
              Un programa diseñado para adaptarse a tus horarios de clases, con acompañamiento continuo de Catolíderes y proyectos en toda la ciudad de La Paz.
            </p>
          </div>
        </section>

        {/* Ciclo Oficial de 4 Etapas */}
        <CicloEtapasSection />

        {/* Poblaciones y Centros Conveniados */}
        <PoblacionesSection />

        {/* Llamado a la Acción Final previo al Footer */}
        <section className="bg-gradient-to-r from-cato-navy via-cato-navy-dark to-[#001830] text-white py-14 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-4xl font-black text-cato-gold tracking-tight drop-shadow-sm">
              ¿Listo para dar el primer paso?
            </h3>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              El proceso de postulación toma solo 5 minutos. Déjanos tus datos, tus horarios disponibles y la población con la que más te gustaría colaborar.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="cta"
                size="lg"
                onClick={() => navigate('/postulacion')}
                className="font-extrabold shadow-lg hover:scale-105 transition-all"
                rightIcon={<ArrowRight className="w-4 h-4 text-cato-navy" />}
              >
                Comenzar Mi Postulación
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowVideoModal(true)}
                className="bg-white text-cato-navy hover:bg-blue-50 hover:text-cato-navy-dark border-2 border-white font-extrabold shadow-lg transition-all hover:scale-105"
                leftIcon={<Play className="w-4 h-4 text-cato-navy fill-cato-navy shrink-0" />}
              >
                Ver Testimonios en Video
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal Interactivo con el Video Real de Catovoluntarios */}
      <VideoSecradModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />

      {/* Footer Institucional */}
      <footer className="bg-cato-navy text-white py-12 border-t border-cato-navy-dark text-left px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cato-gold flex items-center justify-center text-cato-navy">
                <Heart className="w-5 h-5 fill-cato-navy" />
              </div>
              <span className="font-extrabold text-base tracking-wide text-white">
                CATOVOLUNTARIOS UCB
              </span>
            </div>
            <p className="text-xs text-blue-200/80 leading-relaxed max-w-sm">
              Programa oficial de voluntariado universitario dependiente de la Pastoral Universitaria San Pablo, Regional La Paz.
            </p>
          </div>

          <div className="space-y-2 text-xs text-blue-100">
            <p className="font-bold text-white text-sm mb-2">Contacto y Oficinas</p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cato-gold shrink-0" />
              Campus UCB Tupuraya / Calle 2 de Obrajes, Edificio Pastoral
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cato-gold shrink-0" />
              WhatsApp Oficial: +591 71523489
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cato-gold shrink-0" />
              pastoral.lapaz@ucb.edu.bo
            </p>
          </div>

          <div className="space-y-2 text-xs text-blue-200/80">
            <p className="font-bold text-white text-sm mb-2">Acceso a la Plataforma</p>
            <p>
              <Link to="/login" className="hover:text-cato-gold transition-colors">
                Soy Catovoluntario — Iniciar Sesión
              </Link>
            </p>
            <p>
              <Link to="/postulacion" className="hover:text-cato-gold transition-colors">
                Wizard de Postulación Abierto
              </Link>
            </p>
            <p className="text-[11px] text-blue-300/60 pt-2">
              © 2026 Universidad Católica Boliviana "San Pablo". Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
