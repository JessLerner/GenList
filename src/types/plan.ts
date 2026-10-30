export interface SelladoInfo {
  provincia: string;
  tasaPercent: number;
  baseImponible: number;
  impuestoTotal: number;
  cuotasProrrateoRango: string;
  cantidadCuotasProrrateo: number; // e.g. 12 (CTA 2 A 13)
  montoPorCuota: number; // impuestoTotal / cantidadCuotasProrrateo
}

export interface DetalleRubroCuota {
  periodo: string; // e.g. "Cuota 1", "Cuotas 2 a 12", "Cuota 13", "Cuotas 14 a 18", etc.
  cuotaNro: string;
  alicuota: number;
  arancelAdmin: number;
  derechoInscripcionProrr: number;
  seguroVida: number;
  iva: number;
  diferimientoComercial: number; // negative number or 0
  bonificacion: number; // negative number or 0
  recuperoDiferimiento: number; // positive number or 0
  recImpBancarios: number;
  totalCuotaBase: number;
  selladoBAMensual: number;
  totalCuotaConSelladoBA: number;
}

export interface PlanModel {
  id: string;
  brand: string; // "CITROËN"
  model: string; // e.g. "C3 1.3 FEEL MY27"
  planCommercialName: string; // e.g. "PLAN LOOK"
  listPrice: number; // Valor Básico del auto (e.g. 33180000)
  planType: '70/30' | '80/20' | '100%';
  financedPercent: number; // 70, 80, 100
  totalInstallments: number; // 120 | 84
  pureInstallment: number; // Cuota Pura: (listPrice * (financedPercent / 100)) / totalInstallments
  cuota1: number; // Valor Cuota 1 (Confidencial Gerencia)
  officialSubscription: number; // Valor Cuota Suscripción según circular
  customSubscription?: number; // Valor de suscripción editado por Gerencia
  
  // Entregas pactadas y condiciones de adjudicación
  adjudicacionPactada: string; // e.g. "CTA 12" o "CTA 4, 6, 9 y 12"
  licitacionMinima: string; // e.g. "CTA 12 + 20% (AE 20% RESTO 10% PRORRATEA)"
  opcionReencauzamiento: boolean;
  derechoInscripcionProrr: string; // e.g. "CTA 2 A 19"
  recuperoDiferimientoInfo: string; // e.g. "19 a 42" o "25 A 72"
  beneficioPromocional?: string; // e.g. "Bonificación 30% alícuota 12 cuotas"
  cuotaCompletarSolicitud?: number;

  // Sellados Provincia de Buenos Aires (ARBA 1.17%)
  selladoBA: SelladoInfo;

  // Valores de Cuota Tramos Solicitados (con y sin sellado BA)
  tramos: {
    cuota2a13: {
      base: number;
      selladoBA: number;
      totalConSellado: number;
      descripcion?: string;
    };
    cuota14a20: {
      base: number;
      selladoBA: number;
      totalConSellado: number;
      rangoTexto?: string;
    };
    cuota21a84: {
      base: number;
      selladoBA: number;
      totalConSellado: number;
      rangoTexto?: string;
    };
    cuota84a120?: {
      base: number;
      selladoBA: number;
      totalConSellado: number;
    } | null;
  };

  // Desglose completo de cuotas para la ficha técnica
  desgloseCuotas: DetalleRubroCuota[];
}

export type UserRole = 'supervisor' | 'gerencia';

export interface CircularVersion {
  id: string;
  name: string;
  date: string;
  isOfficial?: boolean;
  description?: string;
  plans: PlanModel[];
}

export interface ManagerSettings {
  managerPin: string;
  sobrepautas: Record<string, number>; // modelId -> sobrepauta monto en ARS
  lastUpdated: string;
}

