import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AlertBanner } from '../../../components/feedback/AlertBanner';
import { PasswordRecoveryModal } from './PasswordRecoveryModal';
import {
  Heart,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [postulanteNotice, setPostulanteNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setPostulanteNotice(null);

    // Validación básica de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });

      const savedUserStr = localStorage.getItem('catovoluntarios_user');
      const loggedUser = savedUserStr ? JSON.parse(savedUserStr) : null;

      // El rol se obtiene automáticamente del sistema / base de datos
      if (loggedUser?.rol === 'POSTULANTE') {
        setPostulanteNotice(
          'Tu postulación se encuentra registrada. Conforme a la normativa de Pastoral UCB, el acceso al panel operativo se habilitará una vez completadas las etapas de selección e inducción.',
        );
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(
        errObj.message || 'Credenciales incorrectas. Verifica tu correo y contraseña.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cato-canvas flex text-cato-text">
      {/* 1. Panel Izquierdo: Cálido, Humano y Pastoral (Split Screen) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-cato-navy text-white flex-col justify-between p-12 overflow-hidden">
        {/* Fondo con degradado y calidez */}
        <div className="absolute inset-0 bg-gradient-to-br from-cato-navy via-cato-navy-dark to-[#001A33] opacity-95" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cato-gold/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo Superior */}
        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-cato-gold text-cato-navy flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-cato-navy" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white leading-tight">
                CATOVOLUNTARIOS
              </h2>
              <p className="text-xs text-blue-200/80">
                Pastoral Universitaria — Regional La Paz
              </p>
            </div>
          </Link>
        </div>

        {/* Mensaje Humano Central */}
        <div className="relative z-10 max-w-lg space-y-6 text-left my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cato-gold text-xs font-semibold backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-cato-gold" />
            <span>Comunidad de Servicio y Formación Humana</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight">
            "No nos cansemos de hacer el bien; quien siembra esperanza recoge dignidad."
          </h1>

          <p className="text-sm text-blue-100/80 leading-relaxed">
            Plataforma integral de gestión pastoral, registro de jornadas, habilitación documental y acompañamiento fraterno para más de 120 jóvenes universitarios en acción solidaria.
          </p>

          {/* Testimonio Breve */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
            <p className="text-xs italic text-blue-100">
              «Hacer voluntariado en el Hogar San Ramón me cambió la perspectiva de mi carrera en Psicología. No solo doy mi tiempo, recibo amor incondicional cada sábado.»
            </p>
            <div className="flex items-center justify-between text-[11px] text-cato-gold font-semibold pt-1">
              <span>María Belén Flores — 5to Semestre</span>
              <span className="bg-cato-gold/20 text-cato-gold px-2 py-0.5 rounded text-[10px]">
                Nivel Pro
              </span>
            </div>
          </div>
        </div>

        {/* Footer Institucional */}
        <div className="relative z-10 flex items-center justify-between text-xs text-blue-200/60 pt-4 border-t border-white/10">
          <span>Universidad Católica Boliviana San Pablo</span>
          <span>Gestión 2/2026</span>
        </div>
      </div>

      {/* 2. Panel Derecho: Formulario de Autenticación Centrado */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 text-left bg-white p-8 rounded-2xl shadow-card border border-cato-border">
          {/* Cabecera del Formulario */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cato-gold text-cato-navy flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 fill-cato-navy" />
              </div>
              <span className="font-extrabold text-base text-cato-navy">CATOVOLUNTARIOS</span>
            </div>

            <h2 className="text-2xl font-black text-cato-navy">Iniciar Sesión</h2>
            <p className="text-xs text-cato-muted">
              Ingresa tus credenciales para acceder a la plataforma.
            </p>
          </div>

          {/* Mensajes de Alerta */}
          {errorMessage && <AlertBanner type="danger">{errorMessage}</AlertBanner>}

          {postulanteNotice && (
            <AlertBanner type="info" title="Estado de Postulación">
              <div className="space-y-2">
                <p>{postulanteNotice}</p>
                <div className="pt-1 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/postulacion')}
                    className="text-xs"
                  >
                    Ver Wizard Postulación
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPostulanteNotice(null)}
                    className="text-xs text-cato-muted"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </AlertBanner>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ucb.edu.bo"
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="space-y-1">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-cato-muted hover:text-cato-navy p-1 transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 text-cato-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-cato-border text-cato-navy focus:ring-cato-navy"
                  />
                  <span>Recordar sesión</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(true)}
                  className="font-semibold text-cato-navy hover:text-cato-navy-dark hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-full font-bold shadow-md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ingresar al Sistema
            </Button>
          </form>

          {/* Enlace al Portal Público */}
          <div className="text-center text-xs text-cato-muted pt-4 border-t border-cato-border">
            <span>¿Aún no te has postulado? </span>
            <Link
              to="/postulacion"
              className="font-bold text-cato-navy hover:underline"
            >
              Postúlate como Catovoluntario
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de Recuperación */}
      <PasswordRecoveryModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
      />
    </div>
  );
};
