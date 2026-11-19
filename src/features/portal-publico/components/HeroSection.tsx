import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  MessageCircle,
  Play,
  Heart,
  CheckCircle,
  ArrowRight,
  Shield,
  Coins,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface HeroSectionProps {
  onOpenSaberMas: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSaberMas }) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cato-navy via-cato-navy-dark to-[#002244] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-cato-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Columna Izquierda: Texto Jovial y Acciones */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge Convocatoria */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-cato-gold text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-cato-gold animate-spin" />
            <span>Convocatoria Abierta — Gestión 2/2026</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            ¿Listo para transformar vidas y dejar tu huella?
          </h1>

          {/* Subtítulo fresco y amigable */}
          <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-2xl">
            Súmate a la comunidad solidaria más grande de la <strong>UCB La Paz</strong>. Haz voluntariado 4 horas por semana, conoce amigos increíbles de todas las carreras y sé la esperanza de quienes más lo necesitan.
          </p>

          {/* Botones de Acción (Las 3 intenciones de usuario) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* 1. Postúlate (CTA Principal Amarillo Institucional) */}
            <div className="relative group">
              <Button
                variant="cta"
                size="lg"
                onClick={() => navigate('/postulacion')}
                className="w-full sm:w-auto text-base font-extrabold px-8 py-4 shadow-xl hover:shadow-cato-gold/30 hover:scale-105 transition-all"
                rightIcon={<ArrowRight className="w-5 h-5 text-cato-navy" />}
              >
                ¡Postúlate Aquí!
              </Button>
              {/* Manito Señaladora Intermitente */}
              <div className="hidden sm:flex items-center gap-1.5 absolute -top-8 left-4 text-xs font-bold text-cato-gold animate-bounce pointer-events-none">
                <span className="text-base">👇</span>
                <span>¡Solo 5 minutos!</span>
              </div>
            </div>

            {/* 2. Quiero Saber Más (Abre Modal SECRAD) */}
            <Button
              variant="outline"
              size="lg"
              onClick={onOpenSaberMas}
              className="w-full sm:w-auto text-sm border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-cato-gold backdrop-blur-sm"
              leftIcon={<Play className="w-4 h-4 text-cato-gold fill-cato-gold" />}
            >
              Quiero Saber Más
            </Button>
          </div>

          {/* 3 Ventajas Rápidas para Estudiantes */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-blue-100">
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Seguro Estudiantil UCB</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
              <Coins className="w-4 h-4 text-cato-gold shrink-0" />
              <span>Pasajes Fijos Repuestos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
              <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Certificado Institucional</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta Resumen de Convocatoria + Fotos Humanas */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tarjeta de Cierre de Convocatoria */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs uppercase font-bold text-cato-gold tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cato-gold" />
                Cierre de Convocatoria
              </span>
              <span className="text-[11px] bg-rose-500/80 text-white font-bold px-2 py-0.5 rounded-full">
                ¡Últimos Días!
              </span>
            </div>

            <div>
              <p className="text-2xl font-black text-white">22 de Noviembre, 2026</p>
              <p className="text-xs text-blue-200 mt-1">
                A las 23:59 hrs cerramos el formulario web para coordinar turnos de entrevista con los Catolíderes.
              </p>
            </div>

            {/* Enlace directo a WhatsApp de Pastoral */}
            <div className="pt-2">
              <a
                href="https://wa.me/59171523489?text=Hola%20Pastoral%20UCB,%20tengo%20una%20consulta%20sobre%20la%20convocatoria%20de%20Catovoluntarios"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-colors duration-150"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>¿Tienes dudas? Escríbenos al WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Mini banner para antiguos voluntarios */}
          <div className="bg-cato-navy-dark/80 border border-white/10 rounded-xl p-4 text-left flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-cato-gold fill-cato-gold" />
                ¿Ya fuiste Catovoluntario el semestre pasado?
              </p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                No vuelvas a llenar el formulario. Entra directo a tu cuenta.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="shrink-0 text-xs border-cato-gold text-cato-gold hover:bg-cato-gold hover:text-cato-navy"
            >
              Ingresar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
