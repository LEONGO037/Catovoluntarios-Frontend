import React, { useState } from 'react';
import { PublicNavbar } from '../../../components/layout/PublicNavbar';
import { HeroSection } from './HeroSection';
import { CicloEtapasSection } from './CicloEtapasSection';
import { PoblacionesSection } from './PoblacionesSection';
import { VideoSecradModal } from './VideoSecradModal';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [showSecradModal, setShowSecradModal] = useState(false);

  return (
    <div className="min-h-screen bg-cato-canvas flex flex-col text-cato-text">
      {/* Navbar Público Fijo en #004077 sin Sidebar */}
      <PublicNavbar onOpenSaberMas={() => setShowSecradModal(true)} />

      {/* Hero Section con Fotografías, CTA Postúlate y Modal SECRAD */}
      <HeroSection onOpenSaberMas={() => setShowSecradModal(true)} />

      {/* Ciclo Oficial de 4 Etapas */}
      <CicloEtapasSection />

      {/* Poblaciones y Centros Conveniados */}
      <PoblacionesSection />

      {/* Modal Interactivo SECRAD con Video y Niveles */}
      <VideoSecradModal
        isOpen={showSecradModal}
        onClose={() => setShowSecradModal(false)}
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
                Iniciar Sesión en el App Shell (P-02)
              </Link>
            </p>
            <p>
              <Link to="/postulacion" className="hover:text-cato-gold transition-colors">
                Wizard de Postulación Abierto (P-04)
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
