import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AlertBanner } from '../../../components/feedback/AlertBanner';
import { authService } from '../../../services/auth.service';
import {
  Heart,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenParam = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token.trim()) {
      setErrorMessage('El token de restablecimiento es requerido');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token.trim(), newPassword);
      setIsSuccess(true);
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(
        errObj.message || 'Error al actualizar la contraseña. El token puede haber expirado.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cato-canvas flex text-cato-text items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card border border-cato-border p-8 space-y-6 text-left">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-cato-gold text-cato-navy flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-cato-navy" />
            </div>
            <span className="font-extrabold text-base text-cato-navy">CATOVOLUNTARIOS</span>
          </Link>
          <h2 className="text-2xl font-black text-cato-navy pt-2">
            Restablecer Contraseña
          </h2>
          <p className="text-xs text-cato-muted">
            Ingresa tu nueva clave de acceso seguro verificada mediante Resend.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-cato-navy">
                ¡Contraseña Actualizada!
              </h3>
              <p className="text-xs text-cato-slate max-w-xs mx-auto leading-relaxed">
                Tu clave ha sido modificada con éxito. Ya puedes iniciar sesión en la plataforma con tu nueva contraseña.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              className="w-full font-bold shadow-md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ir a Iniciar Sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && <AlertBanner type="danger">{errorMessage}</AlertBanner>}

            <Input
              label="Token de Verificación (Enviado por Resend)"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Pega el token aquí..."
              required
              leftIcon={<KeyRound className="w-4 h-4" />}
            />

            <Input
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
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

            <Input
              label="Confirmar Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu nueva contraseña"
              required
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            />

            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-full font-bold shadow-md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Guardar Nueva Contraseña
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-cato-slate hover:text-cato-navy hover:underline"
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
