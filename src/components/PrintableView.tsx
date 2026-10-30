import React from 'react';
import { PlanModel, UserRole } from '../types/plan';
import { formatARS } from '../utils/formatters';

interface PrintableViewProps {
  plans: PlanModel[];
  role: UserRole;
  sobrepautas: Record<string, number>;
  includeSelladoBA: boolean;
  circularTitle: string;
  circularDate: string;
}

export const PrintableView: React.FC<PrintableViewProps> = ({
  plans,
  role,
  sobrepautas,
  includeSelladoBA,
  circularTitle,
  circularDate,
}) => {
  const currentDate = new Date().toLocaleDateString('es-AR');

  return (
    <div className="hidden print:block p-8 bg-white text-black text-xs">
      
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">
            CITROËN PLAN DE AHORRO - LISTA OFICIAL DE PRECIOS
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Vigencia: {circularTitle} ({circularDate}) · Emitido para: {role === 'gerencia' ? 'GERENCIA COMERCIAL' : 'SUPERVISORES Y EQUIPO DE VENTAS'}
          </p>
          <p className="text-[11px] text-slate-500">
            Fecha de emisión: {currentDate} · Sellados Provinciales: {includeSelladoBA ? 'Provincia de Buenos Aires (ARBA 1.17%) Incluidos en Cuotas 2 a 13' : 'Sin sellado sumado'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold border border-slate-900 px-3 py-1 inline-block">
            {role === 'gerencia' ? 'USO GERENCIAL' : 'RED COMERCIAL'}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <table className="w-full border-collapse border border-slate-400 text-[10px]">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-400 p-1.5 text-left font-bold">MODELO</th>
            <th className="border border-slate-400 p-1.5 text-center font-bold">PLAN</th>
            <th className="border border-slate-400 p-1.5 text-center font-bold">CTAS</th>
            <th className="border border-slate-400 p-1.5 text-right font-bold">VALOR BÁSICO</th>
            <th className="border border-slate-400 p-1.5 text-right font-bold">CUOTA PURA</th>
            {role === 'gerencia' && (
              <>
                <th className="border border-slate-400 p-1.5 text-right font-bold text-red-700">CUOTA 1 (GER)</th>
                <th className="border border-slate-400 p-1.5 text-right font-bold text-indigo-700">SOBREPAUTA</th>
              </>
            )}
            <th className="border border-slate-400 p-1.5 text-right font-bold bg-slate-200">SUSCRIPCIÓN</th>
            <th className="border border-slate-400 p-1.5 text-right font-bold">CUOTA 2 A 13</th>
            <th className="border border-slate-400 p-1.5 text-right font-bold">CUOTA 14 A 20</th>
            <th className="border border-slate-400 p-1.5 text-right font-bold">CUOTA 21 A 84</th>
            <th className="border border-slate-400 p-1.5 text-right font-bold">CUOTA 84 A 120</th>
            <th className="border border-slate-400 p-1.5 text-left font-bold">ADJUDICACIÓN PACTADA</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => {
            const sobrepauta = sobrepautas[plan.id] ?? 0;
            const finalSub = plan.cuota1 + sobrepauta;
            const cuota2a13 = includeSelladoBA ? plan.tramos.cuota2a13.totalConSellado : plan.tramos.cuota2a13.base;
            const cuota84a120 = plan.tramos.cuota84a120 ? (includeSelladoBA ? plan.tramos.cuota84a120.totalConSellado : plan.tramos.cuota84a120.base) : null;

            return (
              <tr key={plan.id} className="border-b border-slate-300">
                <td className="border border-slate-300 p-1.5 font-bold">{plan.model}</td>
                <td className="border border-slate-300 p-1.5 text-center">{plan.planType}</td>
                <td className="border border-slate-300 p-1.5 text-center">{plan.totalInstallments}</td>
                <td className="border border-slate-300 p-1.5 text-right font-mono">{formatARS(plan.listPrice)}</td>
                <td className="border border-slate-300 p-1.5 text-right font-mono font-bold">{formatARS(plan.pureInstallment)}</td>
                {role === 'gerencia' && (
                  <>
                    <td className="border border-slate-300 p-1.5 text-right font-mono text-red-700 font-bold">{formatARS(plan.cuota1)}</td>
                    <td className="border border-slate-300 p-1.5 text-right font-mono text-indigo-700 font-bold">{formatARS(sobrepauta)}</td>
                  </>
                )}
                <td className="border border-slate-300 p-1.5 text-right font-mono font-bold bg-slate-50">{formatARS(finalSub)}</td>
                <td className="border border-slate-300 p-1.5 text-right font-mono font-bold">{formatARS(cuota2a13)}</td>
                <td className="border border-slate-300 p-1.5 text-right font-mono">{formatARS(plan.tramos.cuota14a20.base)}</td>
                <td className="border border-slate-300 p-1.5 text-right font-mono">{formatARS(plan.tramos.cuota21a84.base)}</td>
                <td className="border border-slate-300 p-1.5 text-right font-mono">{cuota84a120 ? formatARS(cuota84a120) : '-'}</td>
                <td className="border border-slate-300 p-1.5 text-left">{plan.adjudicacionPactada} ({plan.licitacionMinima})</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legal Footer */}
      <div className="mt-8 pt-4 border-t border-slate-300 text-[9px] text-slate-500 space-y-1">
        <p>* Valores expresados en Pesos Argentinos (ARS) sujetos a modificaciones oficiales de Citroën Plan de Ahorro.</p>
        <p>* Sellado de Provincia de Buenos Aires (alícuota ARBA 1,17% personas físicas) calculado y prorrateado en cuotas indicadas en cuadro oficial.</p>
        <p>* Cuota Pura obtenida dividiendo el porcentaje financiado del valor de lista del vehículo sobre el total de cuotas del plan.</p>
      </div>

    </div>
  );
};
