import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Play, Award, Heart, CheckCircle2, Users, BookOpen } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface VideoSecradModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoSecradModal: React.FC<VideoSecradModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-cato-gold fill-cato-gold" />
          <span>¿Qué es Catovoluntarios y SECRAD?</span>
        </div>
      }
      subtitle="Conoce el programa de voluntariado universitario de la Universidad Católica Boliviana San Pablo"
      footer={
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-cato-muted">
            Pastoral Universitaria — Regional La Paz
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              variant="cta"
              size="sm"
              onClick={() => {
                onClose();
                navigate('/postulacion');
              }}
            >
              ¡Quiero Postularme!
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-left">
        {/* Contenedor de Video SECRAD */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-lg border border-cato-border flex flex-col items-center justify-center text-white group">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0"
            title="Video Oficial SECRAD - Catovoluntarios UCB"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute top-3 left-3 bg-cato-navy/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-cato-gold flex items-center gap-1.5 border border-white/10 pointer-events-none">
            <Play className="w-3 h-3 fill-cato-gold" />
            <span>Video Oficial SECRAD / Pastoral UCB</span>
          </div>
        </div>

        {/* Historia y Propósito */}
        <div className="space-y-2">
          <h4 className="font-bold text-base text-cato-navy flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cato-navy" />
            Nuestra Misión y Carisma Institucional
          </h4>
          <p className="text-xs text-cato-slate leading-relaxed">
            El programa <strong>Catovoluntarios</strong> nace en la Pastoral Universitaria de la UCB Regional La Paz con el propósito de conectar el talento, vocación y sensibilidad humana de nuestros estudiantes con las realidades más vulnerables de nuestra sociedad: centros geriátricos, comedores populares, ludotecas hospitalarias y hogares infantiles.
          </p>
        </div>

        {/* Niveles del Voluntariado */}
        <div className="space-y-3">
          <h4 className="font-bold text-base text-cato-navy flex items-center gap-2">
            <Award className="w-4 h-4 text-cato-gold" />
            Niveles y Categorías de Crecimiento
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 text-left">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-200 text-blue-900 mb-1.5">
                Nivel Junior
              </span>
              <p className="font-bold text-xs text-cato-navy">0 a 39 horas</p>
              <p className="text-[11px] text-cato-muted mt-1 leading-snug">
                Fase de inducción, primeras visitas a proyectos y acompañamiento por tu Catolíder.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-200/40 text-left">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-900 mb-1.5">
                Nivel Pro
              </span>
              <p className="font-bold text-xs text-cato-navy">40 a 59 horas</p>
              <p className="text-[11px] text-cato-muted mt-1 leading-snug">
                Voluntario consolidado en campo, cumplimiento de la meta básica semestral y repositorio de pasajes activo.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/60 text-left">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-purple-200 text-purple-900 mb-1.5">
                Nivel Super Pro
              </span>
              <p className="font-bold text-xs text-cato-navy">60+ horas</p>
              <p className="text-[11px] text-cato-muted mt-1 leading-snug">
                Elegible para nominación a Catolíder del siguiente semestre, becas de misión y podio de premiación.
              </p>
            </div>
          </div>
        </div>

        {/* Poblaciones Atendidas */}
        <div className="p-4 bg-cato-canvas rounded-xl border border-cato-border">
          <h5 className="font-bold text-xs text-cato-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cato-navy" />
            Poblaciones con las que trabajamos:
          </h5>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              'Adultos Mayores / Geriatría',
              'Comedores y Personas en Calle',
              'Hospital del Niño / Salud Pediátrica',
              'Discapacidad y Neurodiversidad',
              'Primera Infancia y Refuerzo Escolar',
              'Medio Ambiente y Cuidado Animal',
            ].map((pob, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-white border border-cato-border text-cato-slate px-2.5 py-1 rounded-lg font-medium text-xs shadow-2xs"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {pob}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
