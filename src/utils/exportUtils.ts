import { PlanModel, UserRole } from '../types/plan';
import { formatARS } from './formatters';

/**
 * Generates an Excel-ready CSV/XLS format file and triggers download
 */
export function downloadExcelList(
  plans: PlanModel[],
  role: UserRole,
  sobrepautas: Record<string, number>,
  includeSelladoBA: boolean,
  circularName: string,
  circularDate: string
) {
  const currentDate = new Date().toLocaleDateString('es-AR');
  const roleTitle = role === 'gerencia' ? 'GERENCIA' : 'SUPERVISORES';

  // Build clean HTML table that Excel opens natively with styles and formatting
  let tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Lista Precios Citroen</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        body { font-family: Calibri, sans-serif; font-size: 11pt; }
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #1e293b; color: #ffffff; font-weight: bold; padding: 10px 8px; border: 1px solid #cbd5e1; text-align: center; }
        td { padding: 8px; border: 1px solid #e2e8f0; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .highlight { background-color: #f1f5f9; font-weight: bold; }
        .accent { background-color: #eff6ff; color: #1d4ed8; font-weight: bold; }
        .header-title { font-size: 16pt; font-weight: bold; color: #0f172a; margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="header-title">CITROËN PLAN - LISTA DE PRECIOS OFICIAL</div>
      <p><strong>Circular:</strong> ${circularName} (${circularDate}) | <strong>Perfil:</strong> ${roleTitle} | <strong>Fecha de exportación:</strong> ${currentDate} | <strong>Sellados ARBA Bs. As.:</strong> ${includeSelladoBA ? 'INCLUIDOS EN CUOTA' : 'NO SUMADOS'}</p>
      <table>
        <thead>
          <tr>
            <th>MARCA</th>
            <th>MODELO</th>
            <th>NOMBRE PLAN</th>
            <th>TIPO PLAN</th>
            <th>CUOTAS</th>
            <th>VALOR BÁSICO AUTO</th>
            <th>CUOTA PURA</th>
            ${role === 'gerencia' ? '<th>VALOR CUOTA 1 (CONFIDENCIAL)</th><th>SOBREPAUTA</th>' : ''}
            <th>VALOR SUSCRIPCIÓN (EQUIPO)</th>
            <th>CUOTA 2 A 13 ${includeSelladoBA ? '(c/ Sellado BA)' : ''}</th>
            <th>CUOTA 14 A 20</th>
            <th>CUOTA 21 A 84</th>
            <th>CUOTA 84 A 120</th>
            <th>ENTREGAS PACTADAS</th>
            <th>LICITACIÓN MÍNIMA</th>
          </tr>
        </thead>
        <tbody>
  `;

  plans.forEach((plan) => {
    const sobrepauta = sobrepautas[plan.id] ?? 0;
    const finalSubscription = plan.cuota1 + sobrepauta;
    const cuota2a13 = includeSelladoBA ? plan.tramos.cuota2a13.totalConSellado : plan.tramos.cuota2a13.base;
    const cuota14a20 = plan.tramos.cuota14a20.base;
    const cuota21a84 = plan.tramos.cuota21a84.base;
    const cuota84a120 = plan.tramos.cuota84a120 ? (includeSelladoBA ? plan.tramos.cuota84a120.totalConSellado : plan.tramos.cuota84a120.base) : null;

    tableHtml += `
      <tr>
        <td class="text-center font-bold">${plan.brand}</td>
        <td class="text-left font-bold">${plan.model}</td>
        <td class="text-center">${plan.planCommercialName}</td>
        <td class="text-center accent">${plan.planType}</td>
        <td class="text-center">${plan.totalInstallments}</td>
        <td class="text-right">${formatARS(plan.listPrice)}</td>
        <td class="text-right highlight">${formatARS(plan.pureInstallment)}</td>
        ${role === 'gerencia' ? `<td class="text-right" style="color: #b91c1c; font-weight: bold;">${formatARS(plan.cuota1)}</td><td class="text-right" style="color: #4338ca; font-weight: bold;">${formatARS(sobrepauta)}</td>` : ''}
        <td class="text-right accent">${formatARS(finalSubscription)}</td>
        <td class="text-right font-bold">${formatARS(cuota2a13)}</td>
        <td class="text-right">${formatARS(cuota14a20)}</td>
        <td class="text-right">${formatARS(cuota21a84)}</td>
        <td class="text-right">${cuota84a120 ? formatARS(cuota84a120) : 'N/A'}</td>
        <td class="text-left">${plan.adjudicacionPactada}</td>
        <td class="text-left">${plan.licitacionMinima}</td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
      <p style="font-size: 9pt; color: #64748b; margin-top: 15px;">
        * Sellado Provincial Provincia de Buenos Aires (ARBA 1.17% Persona Física) prorrateado en cuotas 2 a 13 según cuadro oficial.
        * Valor Suscripción = Valor Cuota 1 + Sobrepauta gerencial.
      </p>
    </body>
    </html>
  `;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Lista_Precios_Citroen_${roleTitle}_${currentDate.replace(/\//g, '-')}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Builds a ready-to-send WhatsApp proposal card for sales advisors
 */
export function generateWhatsAppMessage(
  plan: PlanModel,
  subscriptionValue: number,
  includeSelladoBA: boolean
): string {
  const cuota2a13 = includeSelladoBA ? plan.tramos.cuota2a13.totalConSellado : plan.tramos.cuota2a13.base;
  const selladoInfo = includeSelladoBA 
    ? `(Incluye sellado provincial ARBA Bs. As.: ${formatARS(plan.selladoBA.montoPorCuota)}/mes en ctas 2 a 13)` 
    : '';

  return `🚗 *CITROËN PLAN DE AHORRO OFICIAL* 🚗
━━━━━━━━━━━━━━━━━━━━
📌 *Modelo:* ${plan.model}
📋 *Plan:* ${plan.planCommercialName} (${plan.planType})
⏱️ *Plazo:* ${plan.totalInstallments} cuotas
💵 *Valor Móvil (Precio de Lista):* ${formatARS(plan.listPrice)}

🎯 *Cuota Pura:* ${formatARS(plan.pureInstallment)}
⭐ *Valor de Suscripción (Ingreso):* ${formatARS(subscriptionValue)}

📊 *VALORES ESTIMADOS DE CUOTAS:*
▪️ *Cuotas 2 a 13:* ${formatARS(cuota2a13)} ${selladoInfo}
▪️ *Cuotas 14 a 20:* ${formatARS(plan.tramos.cuota14a20.base)}
▪️ *Cuotas 21 a 84:* ${formatARS(plan.tramos.cuota21a84.base)}
${plan.tramos.cuota84a120 ? `▪️ *Cuotas 84 a 120:* ${formatARS(plan.tramos.cuota84a120.base)}\n` : ''}
🔑 *ADJUDICACIÓN Y ENTREGAS:*
▪️ *Entrega Pactada:* ${plan.adjudicacionPactada}
▪️ *Licitación Mínima:* ${plan.licitacionMinima}
${plan.beneficioPromocional ? `\n🎁 *Beneficio especial:* ${plan.beneficioPromocional}\n` : ''}
━━━━━━━━━━━━━━━━━━━━
*Consultanos hoy mismo para asegurar tu unidad y congelar valor de suscripción!*`;
}

