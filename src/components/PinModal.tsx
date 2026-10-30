import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, Check, AlertCircle, KeyRound } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  mode: 'login' | 'changePin';
  currentPin: string;
  onSuccess: (newPin?: string) => void;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  mode,
  currentPin,
  onSuccess,
  onClose,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEnteredPin('');
      setNewPin('');
      setConfirmPin('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (enteredPin === currentPin) {
        onSuccess();
      } else {
        setError('PIN incorrecto. El PIN por defecto es 1234.');
        setEnteredPin('');
      }
    } else {
      // Change PIN mode
      if (enteredPin !== currentPin) {
        setError('El PIN actual no coincide.');
        return;
      }
      if (newPin.length < 4) {
        setError('El nuevo PIN debe tener al menos 4 dígitos numéricos.');
        return;
      }
      if (newPin !== confirmPin) {
        setError('El nuevo PIN y su confirmación no coinciden.');
        return;
      }
      onSuccess(newPin);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            {mode === 'login' ? (
              <>
                <Lock className="w-4 h-4 text-slate-700" />
                <span>Acceso Seguro de Gerencia</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-slate-700" />
                <span>Modificar PIN de Gerencia</span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            {mode === 'login'
              ? 'El perfil de Gerencia permite visualizar la Cuota 1 confidencial y ajustar el valor de suscripción comercial para los supervisores.'
              : 'Ingresa tu PIN actual y define una nueva clave numérica de 4 dígitos.'}
          </p>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ingresa el PIN de Gerencia:
              </label>
              <input
                ref={inputRef}
                type="password"
                maxLength={8}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-widest text-xl font-mono py-2.5 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
              <span className="block mt-1 text-[11px] text-slate-400 text-center">
                PIN inicial de demostración: <strong className="text-slate-600">1234</strong>
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Actual:
                </label>
                <input
                  ref={inputRef}
                  type="password"
                  maxLength={8}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="••••"
                  className="w-full py-2 px-3 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nuevo PIN (4 a 8 dígitos):
                </label>
                <input
                  type="password"
                  maxLength={8}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full py-2 px-3 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmar Nuevo PIN:
                </label>
                <input
                  type="password"
                  maxLength={8}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••"
                  className="w-full py-2 px-3 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{mode === 'login' ? 'Desbloquear' : 'Guardar PIN'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
