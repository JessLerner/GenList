import React from 'react';
import { UserRole } from '../types/plan';
import { ShieldCheck, UserCheck, FileSpreadsheet, Printer, Lock, KeyRound, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onOpenPinModal: () => void;
  onSwitchToSupervisor: () => void;
  onChangePinModal: () => void;
  onOpenCircularManager: () => void;
  onExportExcel: () => void;
  onPrintPdf: () => void;
  circularTitle: string;
  circularDate: string;
  pdfUrl: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onOpenPinModal,
  onSwitchToSupervisor,
  onChangePinModal,
  onOpenCircularManager,
  onExportExcel,
  onPrintPdf,
  circularTitle,
  circularDate,
  pdfUrl,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg tracking-wider shadow-inner">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  CITROËN PLAN
                </span>
                <span className="text-xs text-slate-400 font-medium">·</span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {circularTitle} ({circularDate})
                </span>
                {currentRole === 'gerencia' && (
                  <button
                    onClick={onOpenCircularManager}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer ml-1"
                    title="Cambiar o actualizar la circular activa"
                  >
                    Cambiar Circular
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Lista de Precios Oficial para Red de Concesionarios
              </p>
            </div>
          </div>


          {/* Quick Actions & Role Switching */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* View Original PDF */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Abrir circular oficial en PDF"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Circular PDF</span>
            </a>

            {/* Export to Excel */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              title="Descargar lista completa en Excel (.xls)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={onPrintPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>

            {/* Role Indicator / Switcher */}
            <div className="h-6 w-px bg-slate-200 mx-1" />

            {currentRole === 'gerencia' ? (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg p-1">
                <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold text-red-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>Gerencia</span>
                </div>
                <button
                  onClick={onChangePinModal}
                  className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                  title="Cambiar PIN de Gerencia"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onSwitchToSupervisor}
                  className="px-2 py-0.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white rounded border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                  title="Volver a vista de Supervisores"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenPinModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Acceder con PIN a funciones de Gerencia (ver Cuota 1 y editar suscripciones)"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xs:inline">Acceso</span>
                <span className="font-semibold text-slate-900">Gerencia</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
