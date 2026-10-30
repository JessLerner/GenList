import React, { useState, useMemo } from 'react';
import { PlanModel, UserRole } from '../types/plan';
import { formatARS } from '../utils/formatters';
import { 
  Search, 
  Filter, 
  Edit3, 
  ShieldAlert, 
  MessageSquare, 
  Eye, 
  HelpCircle,
  Check,
  FileText,
  Plus,
  Minus
} from 'lucide-react';

interface PriceTableProps {
  plans: PlanModel[];
  role: UserRole;
  sobrepautas: Record<string, number>;
  onUpdateSobrepauta: (planId: string, amount: number) => void;
  includeSelladoBA: boolean;
  onToggleSelladoBA: (val: boolean) => void;
  onSelectPlanDetail: (plan: PlanModel) => void;
  onOpenWhatsApp: (plan: PlanModel) => void;
}

export const PriceTable: React.FC<PriceTableProps> = ({
  plans,
  role,
  sobrepautas,
  onUpdateSobrepauta,
  includeSelladoBA,
  onToggleSelladoBA,
  onSelectPlanDetail,
  onOpenWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState<string>('all');
  const [selectedCuotas, setSelectedCuotas] = useState<string>('all');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch = 
        plan.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.planCommercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = 
        selectedPlanType === 'all' || plan.planType === selectedPlanType;

      const matchesCuotas = 
        selectedCuotas === 'all' || plan.totalInstallments.toString() === selectedCuotas;

      return matchesSearch && matchesType && matchesCuotas;
    });
  }, [plans, searchTerm, selectedPlanType, selectedCuotas]);

  const handleStartEditSobrepauta = (planId: string, currentSobrepauta: number) => {
    setEditingPlanId(planId);
    setEditingValue(currentSobrepauta.toString());
  };

  const handleSaveSobrepauta = (planId: string) => {
    const num = parseInt(editingValue.replace(/[^\d-]/g, ''), 10) || 0;
    onUpdateSobrepauta(planId, num);
    setEditingPlanId(null);
  };

  return (
    <div className="space-y-4">
      
      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por modelo (C3, Basalt, Berlingo, Aircross)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sellados Bs As Toggle Switch */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg shrink-0">
            <input
              id="sellado-toggle"
              type="checkbox"
              checked={includeSelladoBA}
              onChange={(e) => onToggleSelladoBA(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="sellado-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer select-none flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Sumar Sellado Prov. Buenos Aires (Cuotas 2 a 13 · ARBA 1.17%)</span>
            </label>
          </div>

        </div>

        {/* Segmented Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-medium mr-1">Tipo de Plan:</span>
            {['all', '70/30', '80/20', '100%'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedPlanType(type)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedPlanType === type
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'Todos los Planes' : type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-medium mr-1">Plazo:</span>
            {[
              { id: 'all', label: 'Todos' },
              { id: '84', label: '84 Cuotas' },
              { id: '120', label: '120 Cuotas' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedCuotas(item.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedCuotas === item.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main High-Density Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            
            {/* Table Header */}
            <thead className="bg-slate-900 text-white select-none">
              <tr>
                <th scope="col" className="px-3.5 py-3 text-left font-bold tracking-wider uppercase text-[11px] whitespace-nowrap">
                  Marca
                </th>
                <th scope="col" className="px-3.5 py-3 text-left font-bold tracking-wider uppercase text-[11px] whitespace-nowrap min-w-[160px]">
                  Modelo & Plan
                </th>
                <th scope="col" className="px-3 py-3 text-center font-bold tracking-wider uppercase text-[11px] whitespace-nowrap">
                  Tipo
                </th>
                <th scope="col" className="px-2.5 py-3 text-center font-bold tracking-wider uppercase text-[11px] whitespace-nowrap">
                  Ctas
                </th>
                <th scope="col" className="px-3.5 py-3 text-right font-bold tracking-wider uppercase text-[11px] whitespace-nowrap">
                  Valor Básico Auto
                </th>
                <th scope="col" className="px-3.5 py-3 text-right font-bold tracking-wider uppercase text-[11px] whitespace-nowrap bg-slate-800">
                  <div className="flex items-center justify-end gap-1" title="Surge de dividir el porcentaje financiado del valor del auto / cantidad total de cuotas">
                    <span>Cuota Pura</span>
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                
                {/* Cuota 1 (Confidencial Gerencia) */}
                {role === 'gerencia' && (
                  <th scope="col" className="px-3 py-3 text-right font-bold tracking-wider uppercase text-[11px] whitespace-nowrap bg-red-950/80 text-red-200">
                    <div className="flex items-center justify-end gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      <span>Cuota 1 (Gerencia)</span>
                    </div>
                  </th>
                )}

                {/* Sobrepauta (Editable Gerencia) */}
                {role === 'gerencia' && (
                  <th scope="col" className="px-3.5 py-3 text-right font-bold tracking-wider uppercase text-[11px] whitespace-nowrap bg-indigo-950 text-indigo-200">
                    <div className="flex items-center justify-end gap-1" title="Monto adicional o descuento que se suma a Cuota 1 para derivar el Valor de Suscripción">
                      <Edit3 className="w-3 h-3 text-indigo-400" />
                      <span>Sobrepauta</span>
                    </div>
                  </th>
                )}

                {/* Valor Suscripción Final */}
                <th scope="col" className="px-3.5 py-3 text-right font-bold tracking-wider uppercase text-[11px] whitespace-nowrap bg-blue-900 text-blue-100">
                  <div className="flex items-center justify-end gap-1" title="Valor Cuota 1 + Sobrepauta gerencial">
                    <span>Valor Suscripción</span>
                  </div>
                </th>

                {/* Cuota 2 a 13 (Sellado Bs As incluido en este período oficial) */}
                <th scope="col" className="px-3.5 py-3 text-right font-bold tracking-wider uppercase text-[11px] whitespace-nowrap bg-slate-900">
                  Cuota 2 a 13 {includeSelladoBA ? '(c/ Sellado BA)' : ''}
                </th>

                {/* Cuota 14 a 20 */}
                <th scope="col" className="px-3.5 py-3 text-right font-bold tracking-wider uppercase text-[11px] whitespace-nowrap">
                  Cuota 14 a 20
                </th>

                {/* Cuota 21 a 84 */}
                <th scope="col" className="px-3.5 py-3 text-right font-bold tracking-wider uppercase text-[11px] whitespace-nowrap">
                  Cuota 21 a 84
                </th>

                {/* Cuota 84 a 120 */}
                <th scope="col" className="px-3 py-3 text-right font-bold tracking-wider uppercase text-[11px] whitespace-nowrap">
                  Cuota 84 a 120
                </th>

                {/* Entregas Pactadas */}
                <th scope="col" className="px-3.5 py-3 text-left font-bold tracking-wider uppercase text-[11px] whitespace-nowrap min-w-[150px]">
                  Entregas Pactadas
                </th>

                {/* Acciones */}
                <th scope="col" className="px-3 py-3 text-center font-bold tracking-wider uppercase text-[11px] whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={role === 'gerencia' ? 15 : 13} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron modelos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => {
                  const sobrepauta = sobrepautas[plan.id] ?? 0;
                  const finalSubscription = plan.cuota1 + sobrepauta;
                  
                  // Cuota 2 a 13 calculations
                  const cuota2a13Val = includeSelladoBA 
                    ? plan.tramos.cuota2a13.totalConSellado 
                    : plan.tramos.cuota2a13.base;

                  const cuota14a20Val = plan.tramos.cuota14a20.base;
                  const cuota21a84Val = plan.tramos.cuota21a84.base;
                  const cuota84a120Val = plan.tramos.cuota84a120 
                    ? (includeSelladoBA ? plan.tramos.cuota84a120.totalConSellado : plan.tramos.cuota84a120.base) 
                    : null;

                  const isEditingThis = editingPlanId === plan.id;

                  return (
                    <tr 
                      key={plan.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Marca */}
                      <td className="px-3.5 py-3 font-semibold text-slate-800 whitespace-nowrap">
                        {plan.brand}
                      </td>

                      {/* Modelo & Plan */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer"
                             onClick={() => onSelectPlanDetail(plan)}>
                          {plan.model}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {plan.planCommercialName}
                        </div>
                      </td>

                      {/* Tipo Plan */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          {plan.planType}
                        </span>
                      </td>

                      {/* Cantidad Cuotas */}
                      <td className="px-2.5 py-3 text-center font-mono font-medium text-slate-700 whitespace-nowrap">
                        {plan.totalInstallments}
                      </td>

                      {/* Valor Básico del Auto */}
                      <td className="px-3.5 py-3 text-right font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        {formatARS(plan.listPrice)}
                      </td>

                      {/* Cuota Pura */}
                      <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap bg-slate-50/60">
                        {formatARS(plan.pureInstallment)}
                      </td>

                      {/* Cuota 1 (Solo Gerencia) */}
                      {role === 'gerencia' && (
                        <td className="px-3 py-3 text-right font-mono font-bold text-red-700 tabular-nums whitespace-nowrap bg-red-50/40">
                          {formatARS(plan.cuota1)}
                        </td>
                      )}

                      {/* Sobrepauta (Editable Gerencia) */}
                      {role === 'gerencia' && (
                        <td className="px-3 py-2 text-right whitespace-nowrap bg-indigo-50/40">
                          {isEditingThis ? (
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="text"
                                autoFocus
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveSobrepauta(plan.id);
                                  if (e.key === 'Escape') setEditingPlanId(null);
                                }}
                                className="w-24 px-1.5 py-0.5 text-right font-mono font-bold text-indigo-900 border border-indigo-400 rounded bg-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                placeholder="0"
                              />
                              <button
                                onClick={() => handleSaveSobrepauta(plan.id)}
                                className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                title="Guardar sobrepauta"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => handleStartEditSobrepauta(plan.id, sobrepauta)}
                              className="inline-flex items-center justify-end gap-1 font-mono font-bold text-indigo-800 cursor-pointer hover:bg-indigo-100 px-1.5 py-0.5 rounded transition-colors"
                              title="Hacer clic para editar sobrepauta"
                            >
                              <span>
                                {sobrepauta > 0 ? `+${formatARS(sobrepauta)}` : sobrepauta < 0 ? formatARS(sobrepauta) : '$ 0'}
                              </span>
                              <Edit3 className="w-3 h-3 text-indigo-400 opacity-60 group-hover:opacity-100" />
                            </div>
                          )}
                        </td>
                      )}

                      {/* Valor Suscripción Final = Cuota 1 + Sobrepauta */}
                      <td className="px-3.5 py-3 text-right whitespace-nowrap bg-blue-50/30">
                        <div className="flex flex-col items-end">
                          <span className="font-mono font-bold text-blue-900 tabular-nums text-xs">
                            {formatARS(finalSubscription)}
                          </span>
                          {role === 'gerencia' && sobrepauta !== 0 && (
                            <span className="text-[10px] text-indigo-600 font-mono">
                              ({formatARS(plan.cuota1)} {sobrepauta > 0 ? `+ ${formatARS(sobrepauta)}` : `- ${formatARS(Math.abs(sobrepauta))}`})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Cuota 2 a 13 */}
                      <td className="px-3.5 py-3 text-right font-mono font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                        {formatARS(cuota2a13Val)}
                      </td>

                      {/* Cuota 14 a 20 */}
                      <td className="px-3.5 py-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                        {formatARS(cuota14a20Val)}
                      </td>

                      {/* Cuota 21 a 84 */}
                      <td className="px-3.5 py-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                        {formatARS(cuota21a84Val)}
                      </td>

                      {/* Cuota 84 a 120 */}
                      <td className="px-3 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                        {cuota84a120Val !== null ? (
                          <span className="text-slate-700 font-medium">{formatARS(cuota84a120Val)}</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Entregas Pactadas */}
                      <td className="px-3.5 py-3 text-left whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {plan.adjudicacionPactada}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[170px]" title={plan.licitacionMinima}>
                          {plan.licitacionMinima}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          
                          {/* Ver Ficha Técnica */}
                          <button
                            onClick={() => onSelectPlanDetail(plan)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Ver desglose completo de cuotas y sellados"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Cotización WhatsApp */}
                          <button
                            onClick={() => onOpenWhatsApp(plan)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Generar cotización para WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

        {/* Table Bottom Footer Information */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Mostrando {filteredPlans.length} modelos</span>
            <span>·</span>
            <span>Sellado Provincia de Buenos Aires (ARBA 1.17%) prorrateado en Cuotas 2 a 13</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <span>Cuota Pura = (Precio Básico × % Financiado) / Total Cuotas</span>
          </div>
        </div>

      </div>

    </div>
  );
};
