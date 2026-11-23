import type { FC } from 'react';
import { AppShell } from './AppShell';
import { ArrowLeft, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface TeammateModulePlaceholderProps {
  screenId: string;
  title: string;
  responsible: string;
  description: string;
  sprint: string;
  requirements: string[];
}

export const TeammateModulePlaceholder: FC<TeammateModulePlaceholderProps> = ({
  screenId,
  title,
  responsible,
  description,
  sprint,
  requirements,
}) => {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 text-left">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Volver al Dashboard
        </Button>

        <div className="bg-white rounded-2xl border border-cato-border p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cato-border">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-cato-navy bg-cato-gold px-3 py-1 rounded-md">
                {screenId}
              </span>
              <h2 className="text-2xl font-black text-cato-navy mt-2">{title}</h2>
              <p className="text-xs text-cato-muted mt-1">
                Responsable Técnico Asignado: <strong>{responsible}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-cato-navy self-start">
              <Clock className="w-4 h-4 text-cato-navy" />
              <span>{sprint}</span>
            </div>
          </div>

          <p className="text-sm text-cato-slate leading-relaxed">{description}</p>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-cato-slate tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cato-navy" />
              Requerimientos y Especificaciones Aprobadas por Pastoral:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {requirements.map((req, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-cato-border bg-cato-canvas text-xs text-cato-slate flex items-start gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cato-gold shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span>
              Este módulo forma parte de la arquitectura base del App Shell diseñada por Leonardo Delgado.
            </span>
            <Button size="sm" variant="outline" onClick={() => navigate('/dashboard')}>
              Ir al Dashboard Principal
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
