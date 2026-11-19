import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';

interface PublicNavbarProps {
  onOpenSaberMas?: () => void;
}

export const PublicNavbar: FC<PublicNavbarProps> = ({ onOpenSaberMas }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-cato-navy text-white shadow-md border-b border-cato-navy-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Institucional */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-cato-gold flex items-center justify-center text-cato-navy font-black text-xl shadow-sm group-hover:scale-105 transition-transform duration-150">
            <Heart className="w-6 h-6 fill-cato-navy text-cato-navy" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
              CATOVOLUNTARIOS
              <span className="text-[10px] bg-cato-gold text-cato-navy px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                UCB
              </span>
            </span>
            <span className="text-[11px] text-blue-200/80 -mt-0.5">
              Pastoral Universitaria — Regional La Paz
            </span>
          </div>
        </Link>

        {/* Enlaces de Navegación Rápida */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-blue-100 font-medium">
          <Link to="/" className="hover:text-cato-gold transition-colors">
            Inicio
          </Link>
          <a href="#poblaciones" className="hover:text-cato-gold transition-colors">
            Proyectos y Poblaciones
          </a>
          <a href="#etapas" className="hover:text-cato-gold transition-colors">
            El Ciclo de 4 Etapas
          </a>
          {onOpenSaberMas && (
            <button
              onClick={onOpenSaberMas}
              type="button"
              className="hover:text-cato-gold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Quiero Saber Más</span>
              <Sparkles className="w-3.5 h-3.5 text-cato-gold" />
            </button>
          )}
        </nav>

        {/* Acciones Principales */}
        <div className="flex items-center gap-3">
          {/* Botón Terciario: Ya Soy Catovoluntario (Login) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="text-blue-100 hover:text-white hover:bg-white/10 text-xs hidden sm:inline-flex"
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Ya Soy Catovoluntario
          </Button>

          {/* Botón Primario CTA: Postúlate */}
          <Button
            variant="cta"
            size="sm"
            onClick={() => navigate('/postulacion')}
            className="text-xs sm:text-sm font-bold shadow-sm animate-pulse hover:animate-none"
            rightIcon={<Sparkles className="w-4 h-4 text-cato-navy" />}
          >
            ¡Postúlate Ahora!
          </Button>
        </div>
      </div>
    </header>
  );
};
