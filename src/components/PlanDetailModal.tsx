import React from 'react';
import { PlanModel, UserRole } from '../types/plan';
import { formatARS } from '../utils/formatters';
import { 
  X, 
  Info, 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  DollarSign, 
  Calendar, 
  Award,
  Layers
} from 'lucide-react';

interface PlanDetailModalProps {
  isOpen: boolean;
  plan: PlanModel | null;
  role: UserRole;
  subscriptionValue: number;
  includeSelladoBA: boolean;
  onClose: () => void;
  onOpenWhatsApp: () => void;
  onOpenEditSubscription?: () => void;
}

export const PlanDetailModal: React.FC<PlanDetailModalProps> = ({
  isOpen,
  plan,
  role,
  subscriptionValue,
  includeSelladoBA,
  onClose,
  onOpenWhatsApp,
  onOpenEditSubscription,
}) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  {plan.model}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-600 font-semibold text-white">
                  {plan.planCommercialName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-mono">
                  Plan {plan.planType} · {plan.totalInstallments} Ctas
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ficha financiera oficial y estructura de costos (Circular Citroën Octubre 2026)
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

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Valor Básico Móvil
              </span>
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums block mt-1">
                {formatARS(plan.listPrice)}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Precio de lista 100%
              </span>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
              <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
                Cuota Pura
              </span>
              <span className="text-base font-bold text-blue-950 font-mono tabular-nums block mt-1">
                {formatARS(plan.pureInstallment)}
              </span>
              <span className="text-[11px] text-blue-700 mt-0.5 block">
                ({plan.financedPercent}% Financiado / {plan.totalInstallments} ctas)
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Valor Suscripción
                </span>
                {role === 'gerencia' && onOpenEditSubscription && (
                  <button
                    onClick={onOpenEditSubscription}
                    className="text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                  >
                    Editar
                  </button>
                )}
              </div>
              <span className="text-base font-bold text-emerald-950 font-mono tabular-nums block mt-1">
                {formatARS(subscriptionValue)}
              </span>
              <span className="text-[11px] text-emerald-700 mt-0.5 block">
                {subscriptionValue !== plan.officialSubscription
                  ? 'Fijado por Gerencia'
                  : 'Oficial de Circular'}
              </span>
            </div>

            {role === 'gerencia' ? (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider block flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  Cuota 1 (Confidencial)
                </span>
                <span className="text-base font-bold text-red-950 font-mono tabular-nums block mt-1">
                  {formatARS(plan.cuota1)}
                </span>
                <span className="text-[11px] text-red-700 mt-0.5 block">
                  Solo visible Gerencia
                </span>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Adjudicación Pactada
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-1 truncate">
                  {plan.adjudicacionPactada}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block truncate">
                  {plan.licitacionMinima}
                </span>
              </div>
            )}

          </div>

          {/* Sellados Provincia de Buenos Aires Callout */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Sellados Provinciales: Provincia de Buenos Aires (ARBA)
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded">
                Tasa 1,17% · Persona Física
              </span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Tomados formalmente de la sección SELLADOS de la circular. El impuesto total de <strong>{formatARS(plan.selladoBA.impuestoTotal)}</strong> (base imponible {formatARS(plan.selladoBA.baseImponible)}) se divide en <strong>{plan.selladoBA.cantidadCuotasProrrateo} cuotas ({plan.selladoBA.cuotasProrrateoRango})</strong>, resultando en una alícuota mensual de <strong>{formatARS(plan.selladoBA.montoPorCuota)}</strong> por cuota.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Base Imponible:</span>
                <span className="font-mono font-medium text-slate-800">{formatARS(plan.selladoBA.baseImponible)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Impuesto Sellado:</span>
                <span className="font-mono font-medium text-slate-800">{formatARS(plan.selladoBA.impuestoTotal)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Período Prorrateo:</span>
                <span className="font-mono font-medium text-slate-800">{plan.selladoBA.cuotasProrrateoRango} (12 ctas)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Incidencia Mensual:</span>
                <span className="font-mono font-bold text-blue-700">{formatARS(plan.selladoBA.montoPorCuota)} / mes</span>
              </div>
            </div>
          </div>

          {/* Cuotas por Tramos (Cuota 2 a 12, 13 a 20, 21 a 84, 84 a 120) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Valores de Cuota por Tramos Normativos
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {includeSelladoBA ? 'Sellado ARBA Bs. As. Sumado' : 'Valores base sin sellado'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Cuota 2 a 13 */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-slate-800 block">
                  Cuota 2 a 13 (Período Sellado)
                </span>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {formatARS(includeSelladoBA ? plan.tramos.cuota2a13.totalConSellado : plan.tramos.cuota2a13.base)}
                </div>
                <div className="text-[11px] text-slate-500">
                  Base: {formatARS(plan.tramos.cuota2a13.base)} + Sellado: {formatARS(plan.tramos.cuota2a13.selladoBA)}
                </div>
                {plan.tramos.cuota2a13.descripcion && (
                  <div className="text-[10px] text-blue-700 pt-1 border-t border-slate-100">
                    {plan.tramos.cuota2a13.descripcion}
                  </div>
                )}
              </div>

              {/* Cuota 14 a 20 */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-slate-800 block">
                  Cuota 14 a 20
                </span>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {formatARS(plan.tramos.cuota14a20.base)}
                </div>
                <div className="text-[11px] text-slate-500">
                  {plan.tramos.cuota14a20.rangoTexto ?? 'Fin diferimiento inicial'}
                </div>
              </div>

              {/* Cuota 21 a 84 */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-slate-800 block">
                  Cuota 21 a 84
                </span>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {formatARS(plan.tramos.cuota21a84.base)}
                </div>
                <div className="text-[11px] text-slate-500">
                  {plan.tramos.cuota21a84.rangoTexto ?? 'Régimen regular'}
                </div>
              </div>

              {/* Cuota 84 a 120 */}
              <div className={`p-3 border rounded-xl space-y-1 ${
                plan.tramos.cuota84a120 ? 'bg-white border-slate-200' : 'bg-slate-50 border-dashed border-slate-200 text-slate-400'
              }`}>
                <span className="text-xs font-bold block">
                  Cuota 84 a 120
                </span>
                <div className="text-lg font-bold font-mono">
                  {plan.tramos.cuota84a120 ? formatARS(plan.tramos.cuota84a120.base) : 'No aplica'}
                </div>
                <div className="text-[11px]">
                  {plan.tramos.cuota84a120 ? 'Planes extendidos a 120 meses' : 'Plan finaliza en cuota 84'}
                </div>
              </div>

            </div>
          </div>

          {/* Entregas Pactadas y Beneficios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Condiciones de Adjudicación</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li><strong>Adjudicación Pactada (PEA):</strong> {plan.adjudicacionPactada}</li>
                <li><strong>Licitación Mínima:</strong> {plan.licitacionMinima}</li>
                <li><strong>Opción de reencauzamiento:</strong> {plan.opcionReencauzamiento ? 'Habilitada' : 'No'}</li>
                <li><strong>Derecho de inscripción:</strong> {plan.derechoInscripcionProrr}</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Promociones y Diferimientos</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {plan.beneficioPromocional ?? 'Sin promociones temporales adicionales declaradas en circular.'}
              </p>
              <div className="text-xs text-slate-500 pt-1">
                Recupero de diferimiento comercial: <strong>{plan.recuperoDiferimientoInfo}</strong>
              </div>
              {plan.cuotaCompletarSolicitud && (
                <div className="text-xs text-slate-500">
                  Cuota al completar solicitud: <strong className="font-mono text-slate-800">{formatARS(plan.cuotaCompletarSolicitud)}</strong>
                </div>
              )}
            </div>

          </div>

          {/* Desglose Completo de Rubros por Período */}
          {plan.desgloseCuotas && plan.desgloseCuotas.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Desglose Analítico por Componente (Circular Oficial)
                </h3>
              </div>
              
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Período</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-600">Alícuota</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-600">Arancel</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-600">Inscripción</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-600">Seg. Vida</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-600">Diferim./Bonif.</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-600">Total Base</th>
                      <th className="px-3 py-2 text-right font-semibold text-blue-700">Sellado BA</th>
                      <th className="px-3 py-2 text-right font-bold text-slate-900">Total Cuota</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white font-mono">
                    {plan.desgloseCuotas.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-left font-sans font-medium text-slate-800">
                          {row.periodo}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-600">{formatARS(row.alicuota)}</td>
                        <td className="px-3 py-2 text-right text-slate-600">{formatARS(row.arancelAdmin)}</td>
                        <td className="px-3 py-2 text-right text-slate-600">{row.derechoInscripcionProrr ? formatARS(row.derechoInscripcionProrr) : '-'}</td>
                        <td className="px-3 py-2 text-right text-slate-600">{row.seguroVida ? formatARS(row.seguroVida) : '-'}</td>
                        <td className="px-3 py-2 text-right text-slate-600">
                          {row.diferimientoComercial || row.bonificacion 
                            ? formatARS(row.diferimientoComercial + row.bonificacion + row.recuperoDiferimiento) 
                            : '-'}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-slate-700">{formatARS(row.totalCuotaBase)}</td>
                        <td className="px-3 py-2 text-right font-semibold text-blue-700">
                          {row.selladoBAMensual ? formatARS(row.selladoBAMensual) : '-'}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">
                          {formatARS(row.totalCuotaConSelladoBA)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Volver a la Lista
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <span>Generar Ficha WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
