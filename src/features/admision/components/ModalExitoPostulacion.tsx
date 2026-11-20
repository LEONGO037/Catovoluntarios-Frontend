import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  MessageSquare,
} from 'lucide-react';

interface ModalExitoProps {
  codigoPostulacion: string;
  nombres: string;
  celular: string;
  onCerrar: () => void;
}

export const ModalExitoPostulacion: React.FC<ModalExitoProps> = ({
  codigoPostulacion,
  nombres,
  onCerrar,
}) => {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoPostulacion);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-center border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Ícono Superior de Confirmación */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h2 className="text-2xl font-black text-cato-navy tracking-tight">
          ¡Postulación Enviada con Éxito!
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          ¡Muchas gracias, <strong>{nombres}</strong>! Tu postulación ha sido registrada formalmente en el Programa Catovoluntarios de Pastoral Universitaria UCB.
        </p>

        {/* Tarjeta de Código de Postulación */}
        <div className="my-6 p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-cato-navy/20">
          <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">
            Tu Código Único de Postulante
          </p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-2xl font-mono font-extrabold text-cato-navy tracking-wider">
              {codigoPostulacion}
            </span>
            <button
              type="button"
              onClick={copiarCodigo}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
            >
              {copiado ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Conserva este código para el seguimiento de tu postulación y entrevista presencial.
          </p>
        </div>

        {/* Acceso a Grupo de WhatsApp Exclusivo para Postulantes */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Canal de Comunicación Oficial
            </h4>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Te invitamos a unirte al <strong>Grupo de WhatsApp Oficial de Postulantes</strong> para recibir las fechas y horarios de entrevistas personales.
          </p>
          <a
            href="https://chat.whatsapp.com/CatovoluntariosPostulantes2026"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-sm transition-colors mt-1"
          >
            <MessageSquare className="w-4 h-4" /> Unirme al Grupo de WhatsApp
          </a>
        </div>

        {/* Botón de cierre */}
        <button
          type="button"
          onClick={onCerrar}
          className="w-full py-2.5 px-4 rounded-xl bg-cato-navy hover:bg-cato-navy-dark text-white font-bold text-xs transition-colors shadow-sm"
        >
          Volver a la Página Principal
        </button>
      </div>
    </div>
  );
};
