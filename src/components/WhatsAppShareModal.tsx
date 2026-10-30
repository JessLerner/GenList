import React, { useState } from 'react';
import { PlanModel } from '../types/plan';
import { generateWhatsAppMessage } from '../utils/exportUtils';
import { MessageSquare, Copy, Check, ExternalLink, X } from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  plan: PlanModel | null;
  subscriptionValue: number;
  includeSelladoBA: boolean;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  plan,
  subscriptionValue,
  includeSelladoBA,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !plan) return null;

  const messageText = generateWhatsAppMessage(plan, subscriptionValue, includeSelladoBA);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Ficha de Cotización para WhatsApp</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Mensaje listo para enviar a prospectos comerciales:</span>
            <span className="font-semibold text-slate-700">{plan.model} ({plan.planCommercialName})</span>
          </div>

          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800 selection:bg-emerald-500 selection:text-white">
            {messageText}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Cerrar
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar Mensaje</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
