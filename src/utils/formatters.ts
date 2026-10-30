/**
 * Utility functions for currency and numerical formatting in Argentine Peso (ARS)
 */

export function formatARS(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '-';
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount).replace('ARS', '$');
}

export function formatNumberOnly(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '-';
  }
  return new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(amount);
}
