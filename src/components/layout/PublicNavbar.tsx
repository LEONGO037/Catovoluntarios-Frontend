import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';

export const PublicNavbar: FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-cato-navy/95 backdrop-blur-md text-white shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Institucional */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-cato-gold flex items-center justify-center text-cato-navy font-black text-xl shadow-sm group-hover:scale-105 transition-transform duration-150">
            <Heart className="w-6 h-6 fill-cato-navy text-cato-navy" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
              CATOVOLUNTARIOS
              <span className="text-[10px] bg-cato-gold text-cato-navy px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                UCB
              </span>
            </span>
            <span className="text-[11px] text-blue-200/80 -mt-0.5">
              Pastoral Universitaria — Regional La Paz
            </span>
          </div>
        </Link>

        {/* Acciones Directas del Header: Únicamente Soy Catovoluntario y Postúlate Ahora */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="text-blue-100 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-semibold px-3 sm:px-4"
            leftIcon={<LogIn className="w-4 h-4 text-cato-gold" />}
          >
            Soy Catovoluntario
          </Button>

          <Button
            variant="cta"
            size="sm"
            onClick={() => navigate('/postulacion')}
            className="text-xs sm:text-sm font-extrabold px-3.5 sm:px-5 shadow-sm hover:scale-105 transition-all"
            rightIcon={<Sparkles className="w-4 h-4 text-cato-navy" />}
          >
            ¡Postúlate Ahora!
          </Button>
        </div>
      </div>
    </header>
  );
};
