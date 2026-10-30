import React, { useState } from 'react';
import { CircularVersion, PlanModel } from '../types/plan';
import { formatARS } from '../utils/formatters';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  TrendingUp, 
  Layers, 
  RotateCcw,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface CircularManagerModalProps {
  isOpen: boolean;
  circulars: CircularVersion[];
  activeCircularId: string;
  onSelectCircular: (circularId: string) => void;
  onCreateCircular: (newCircular: CircularVersion) => void;
  onDeleteCircular: (circularId: string) => void;
  onClose: () => void;
}

export const CircularManagerModal: React.FC<CircularManagerModalProps> = ({
  isOpen,
  circulars,
  activeCircularId,
  onSelectCircular,
  onCreateCircular,
  onDeleteCircular,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [newTitle, setNewTitle] = useState('Circular Citroën - Noviembre 2026');
  const [newDate, setNewDate] = useState('05/11/2026');
  const [percentIncrease, setPercentIncrease] = useState<number>(0);
  const [baseCircularId, setBaseCircularId] = useState<string>(activeCircularId);

  if (!isOpen) return null;

  const activeCircular = circulars.find((c) => c.id === activeCircularId) || circulars[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const source = circulars.find((c) => c.id === baseCircularId) || activeCircular;
    const factor = 1 + percentIncrease / 100;

    const updatedPlans: PlanModel[] = source.plans.map((p) => {
      const newListPrice = Math.round(p.listPrice * factor);
      const newPureInstallment = Math.round((newListPrice * (p.financedPercent / 100)) / p.totalInstallments);
      const newCuota1 = Math.round(p.cuota1 * factor);
      const newCuota2a13Base = Math.round(p.tramos.cuota2a13.base * factor);
      const newSelladoMonto = Math.round(p.selladoBA.montoPorCuota * factor);

      return {
        ...p,
        listPrice: newListPrice,
        pureInstallment: newPureInstallment,
        cuota1: newCuota1,
        officialSubscription: newCuota1,
        selladoBA: {
          ...p.selladoBA,
          baseImponible: Math.round(p.selladoBA.baseImponible * factor),
          impuestoTotal: Math.round(p.selladoBA.impuestoTotal * factor),
          montoPorCuota: newSelladoMonto,
        },
        tramos: {
          ...p.tramos,
          cuota2a13: {
            ...p.tramos.cuota2a13,
            base: newCuota2a13Base,
            selladoBA: newSelladoMonto,
            totalConSellado: newCuota2a13Base + newSelladoMonto,
          },
          cuota14a20: {
            ...p.tramos.cuota14a20,
            base: Math.round(p.tramos.cuota14a20.base * factor),
            totalConSellado: Math.round(p.tramos.cuota14a20.base * factor),
          },
          cuota21a84: {
            ...p.tramos.cuota21a84,
            base: Math.round(p.tramos.cuota21a84.base * factor),
            totalConSellado: Math.round(p.tramos.cuota21a84.base * factor),
          },
          cuota84a120: p.tramos.cuota84a120
            ? {
                ...p.tramos.cuota84a120,
                base: Math.round(p.tramos.cuota84a120.base * factor),
                totalConSellado: Math.round(p.tramos.cuota84a120.base * factor),
              }
            : null,
        },
      };
    });

    const newCirc: CircularVersion = {
      id: `circ-${Date.now()}`,
      name: newTitle,
      date: newDate,
      isOfficial: false,
      description: percentIncrease > 0 
        ? `Actualización con ajuste general de precios del +${percentIncrease}% respecto a ${source.name}` 
        : `Nueva circular basada en ${source.name}`,
      plans: updatedPlans,
    };

    onCreateCircular(newCirc);
    setViewMode('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Gestión de Circulares Oficiales
              </h2>
              <p className="text-xs text-slate-300">
                Cambia o actualiza la circular activa para refrescar los listados de precios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sobrepauta Guarantee Banner */}
        <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-200 flex items-start gap-2.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <strong>Persistencia de Sobrepauta Garantizada:</strong> Los montos de sobrepauta que hayas cargado se mantienen guardados y se sumarán automáticamente a la Cuota 1 de la circular que actives.
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {viewMode === 'list' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Circulares Disponibles ({circulars.length})
                </span>
                <button
                  onClick={() => setViewMode('create')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear / Actualizar Nueva Circular</span>
                </button>
              </div>

              {/* Circulars List */}
              <div className="space-y-2.5">
                {circulars.map((circ) => {
                  const isActive = circ.id === activeCircularId;
                  return (
                    <div
                      key={circ.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {circ.name}
                          </h3>
                          {circ.isOfficial && (
                            <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                              PDF OFICIAL
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <Check className="w-3 h-3" /> ACTIVA
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Fecha: {circ.date}
                          </span>
                          <span>·</span>
                          <span>{circ.plans.length} modelos cargados</span>
                        </div>
                        {circ.description && (
                          <p className="text-[11px] text-slate-500 italic">
                            {circ.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isActive && (
                          <button
                            onClick={() => onSelectCircular(circ.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                          >
                            Activar Lista
                          </button>
                        )}
                        {!circ.isOfficial && (
                          <button
                            onClick={() => onDeleteCircular(circ.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar circular personalizada"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Create New Circular Form */
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Nueva Circular de Precios
                </h3>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Volver al listado
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de la Circular:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="Ej. Circular Citroën - Noviembre 2026"
                  className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha de Vigencia:
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    placeholder="DD/MM/AAAA"
                    className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Copiar modelos desde:
                  </label>
                  <select
                    value={baseCircularId}
                    onChange={(e) => setBaseCircularId(e.target.value)}
                    className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {circulars.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Adjustment slider/input */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ajuste general de precios (opcional):</span>
                  </label>
                  <span className="font-mono font-bold text-xs text-blue-700">
                    {percentIncrease > 0 ? `+${percentIncrease}%` : `${percentIncrease}% (Sin cambios)`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Si la terminal automotriz aumentó precios, ingresa el porcentaje para actualizar automáticamente Valores Básicos, Cuotas Puras, Cuotas 1 y tramos.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={0.5}
                    value={percentIncrease}
                    onChange={(e) => setPercentIncrease(parseFloat(e.target.value))}
                    className="flex-1 accent-slate-900 cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={percentIncrease}
                      onChange={(e) => setPercentIncrease(parseFloat(e.target.value) || 0)}
                      className="w-16 py-1 px-2 text-xs font-mono border border-slate-300 rounded text-center"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Crear y Activar Circular</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Circular actualmente activa: <strong>{activeCircular.name}</strong></span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
