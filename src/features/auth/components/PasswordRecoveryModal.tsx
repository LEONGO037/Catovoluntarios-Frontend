import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AlertBanner } from '../../../components/feedback/AlertBanner';
import { authService } from '../../../services/auth.service';
import { Mail, Lock, CheckCircle2 } from 'lucide-react';

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordRecoveryModal: React.FC<PasswordRecoveryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
      setSuccessMessage(res.message || 'Se ha enviado un correo con tu enlace seguro.');
    } catch {
      setSuccessMessage(
        'Si tu correo se encuentra registrado en Pastoral, recibirás las instrucciones en breve.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setSuccessMessage(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-cato-navy" />
          <span>Recuperar Contraseña</span>
        </div>
      }
      subtitle="Te enviaremos un correo oficial con las instrucciones para restablecer tu clave"
    >
      {successMessage ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-base text-cato-navy">¡Correo enviado!</h4>
            <p className="text-xs text-cato-slate max-w-sm mx-auto leading-relaxed">
              Hemos enviado las instrucciones a tu correo. Revisa tu bandeja de entrada o tu carpeta de spam para continuar.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={handleReset} className="w-full mt-2">
            Entendido, volver al inicio de sesión
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {errorMessage && <AlertBanner type="danger">{errorMessage}</AlertBanner>}

          <p className="text-xs text-cato-slate leading-relaxed">
            Ingresa tu correo electrónico registrado (institucional <code>@ucb.edu.bo</code> o personal). Te enviaremos un enlace seguro para restablecer tu contraseña.
          </p>

          <Input
            label="Correo Electrónico Registrado"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ucb.edu.bo"
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={handleReset}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
              Enviar Correo
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
