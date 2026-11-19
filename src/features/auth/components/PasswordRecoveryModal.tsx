import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AlertBanner } from '../../../components/feedback/AlertBanner';
import { authService } from '../../../services/auth.service';
import { Mail, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordRecoveryModal: React.FC<PasswordRecoveryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Por favor ingresa tu correo electrónico');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authService.forgotPassword(email);
      setSuccessMessage(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch {
      setSuccessMessage(
        'Si tu correo se encuentra registrado en Pastoral, recibirás las instrucciones en breve mediante Resend.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setSuccessMessage(null);
    setResetToken(null);
    setErrorMessage(null);
    onClose();
  };

  const handleGoToReset = () => {
    const token = resetToken || 'token_demo_15m';
    handleReset();
    navigate(`/reset-password?token=${encodeURIComponent(token)}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-cato-navy" />
          <span>Recuperar Contraseña con Resend</span>
        </div>
      }
      subtitle="Te enviaremos un correo oficial a través del servicio Resend (validez de 15 minutos)"
    >
      {successMessage ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-base text-cato-navy">¡Correo enviado con Resend!</h4>
            <p className="text-xs text-cato-slate max-w-sm mx-auto leading-relaxed">
              {successMessage}
            </p>
          </div>

          {/* Atajo de prueba local si hay token */}
          {resetToken && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-cato-slate space-y-2 text-left">
              <span className="font-bold text-cato-navy flex items-center gap-1">
                ⚡ Modo de prueba / Desarrollo:
              </span>
              <p className="text-[11px] text-cato-muted">
                Para probar inmediatamente sin salir de la plataforma:
              </p>
              <Button
                variant="cta"
                size="sm"
                onClick={handleGoToReset}
                className="w-full text-xs font-bold"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Abrir pantalla de cambio de clave con este token
              </Button>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
            Cerrar y volver al inicio de sesión
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {errorMessage && <AlertBanner type="danger">{errorMessage}</AlertBanner>}

          <p className="text-xs text-cato-slate leading-relaxed">
            Ingresa tu correo electrónico registrado (institucional <code>@ucb.edu.bo</code> o personal). El sistema enviará automáticamente un correo a través del servicio <strong>Resend</strong> con el enlace de reseteo seguro.
          </p>

          <Input
            label="Correo Electrónico Registrado"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="andrea.moscoso@ucb.edu.bo"
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={handleReset}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
              Enviar Correo con Resend
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
