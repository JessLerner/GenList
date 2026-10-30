/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PlanModel, UserRole, CircularVersion } from './types/plan';
import { INITIAL_PLANS, DEFAULT_CIRCULARS, OFFICIAL_CIRCULAR_INFO } from './data/citroenPlansData';
import { Header } from './components/Header';
import { PriceTable } from './components/PriceTable';
import { PinModal } from './components/PinModal';
import { PlanDetailModal } from './components/PlanDetailModal';
import { CircularManagerModal } from './components/CircularManagerModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { PrintableView } from './components/PrintableView';
import { downloadExcelList } from './utils/exportUtils';
import { ShieldCheck, UserCheck, CheckCircle2, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [circulars, setCirculars] = useState<CircularVersion[]>(DEFAULT_CIRCULARS);
  const [activeCircularId, setActiveCircularId] = useState<string>('circ-oct-2026');
  const [role, setRole] = useState<UserRole>('supervisor');
  const [managerPin, setManagerPin] = useState<string>('1234');
  const [sobrepautas, setSobrepautas] = useState<Record<string, number>>({});
  const [includeSelladoBA, setIncludeSelladoBA] = useState<boolean>(true);

  // Modals state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'login' | 'changePin'>('login');
  const [circularManagerOpen, setCircularManagerOpen] = useState(false);
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<PlanModel | null>(null);
  const [selectedPlanWhatsApp, setSelectedPlanWhatsApp] = useState<PlanModel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved configurations from LocalStorage
  useEffect(() => {
    try {
      const savedPin = localStorage.getItem('citroen_manager_pin');
      if (savedPin) setManagerPin(savedPin);

      // Crucial: Sobrepautas are persisted independently of circulars!
      const savedSobrepautas = localStorage.getItem('citroen_sobrepautas');
      if (savedSobrepautas) {
        setSobrepautas(JSON.parse(savedSobrepautas));
      }

      const savedCirculars = localStorage.getItem('citroen_circular_versions');
      if (savedCirculars) {
        const parsed = JSON.parse(savedCirculars);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCirculars(parsed);
        }
      }

      const savedActiveId = localStorage.getItem('citroen_active_circular_id');
      if (savedActiveId) {
        setActiveCircularId(savedActiveId);
      }
    } catch (e) {
      console.warn('Error reading LocalStorage', e);
    }
  }, []);

  const activeCircular = useMemo(() => {
    return circulars.find((c) => c.id === activeCircularId) || circulars[0];
  }, [circulars, activeCircularId]);

  const plans = activeCircular.plans;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Switch to Manager Mode after correct PIN
  const handlePinSuccess = (newPin?: string) => {
    if (pinModalMode === 'login') {
      setRole('gerencia');
      setPinModalOpen(false);
      showToast('Modo Gerencia activado. Cuota 1 y Sobrepauta visibles.');
    } else if (pinModalMode === 'changePin' && newPin) {
      setManagerPin(newPin);
      localStorage.setItem('citroen_manager_pin', newPin);
      setPinModalOpen(false);
      showToast('PIN de Gerencia actualizado exitosamente.');
    }
  };

  // Switch back to Supervisor
  const handleSwitchToSupervisor = () => {
    setRole('supervisor');
    showToast('Modo Supervisor activo (Cuota 1 y Sobrepauta confidenciales).');
  };

  // Update Sobrepauta for a specific model (persists across circulars)
  const handleUpdateSobrepauta = (planId: string, amount: number) => {
    const updated = { ...sobrepautas, [planId]: amount };
    setSobrepautas(updated);
    try {
      localStorage.setItem('citroen_sobrepautas', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving sobrepauta', e);
    }
    showToast(`Sobrepauta actualizada. Valor de suscripción recalculado.`);
  };

  // Switch Active Circular
  const handleSelectCircular = (circularId: string) => {
    setActiveCircularId(circularId);
    try {
      localStorage.setItem('citroen_active_circular_id', circularId);
    } catch (e) {
      console.warn('Error saving active circular ID', e);
    }
    showToast('Circular activa actualizada. Las sobrepautas se mantuvieron aplicadas.');
  };

  // Create & Save New Circular
  const handleCreateCircular = (newCirc: CircularVersion) => {
    const updated = [...circulars, newCirc];
    setCirculars(updated);
    setActiveCircularId(newCirc.id);
    try {
      localStorage.setItem('citroen_circular_versions', JSON.stringify(updated));
      localStorage.setItem('citroen_active_circular_id', newCirc.id);
    } catch (e) {
      console.warn('Error saving new circular', e);
    }
    showToast(`Nueva circular "${newCirc.name}" creada y activada.`);
  };

  // Delete Custom Circular
  const handleDeleteCircular = (circularId: string) => {
    const updated = circulars.filter((c) => c.id !== circularId);
    setCirculars(updated);
    if (activeCircularId === circularId) {
      const fallbackId = updated[0]?.id || 'circ-oct-2026';
      setActiveCircularId(fallbackId);
      localStorage.setItem('citroen_active_circular_id', fallbackId);
    }
    try {
      localStorage.setItem('citroen_circular_versions', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving updated circulars', e);
    }
    showToast('Circular eliminada.');
  };

  // Export to Excel
  const handleExportExcel = () => {
    downloadExcelList(
      plans, 
      role, 
      sobrepautas, 
      includeSelladoBA,
      activeCircular.name,
      activeCircular.date
    );
    showToast('Planilla de Excel generada y descargada.');
  };

  // Print PDF
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* Screen View (hidden on print) */}
      <div className="no-print flex-1 flex flex-col">
        
        {/* Navigation Header */}
        <Header
          currentRole={role}
          onOpenPinModal={() => {
            setPinModalMode('login');
            setPinModalOpen(true);
          }}
          onSwitchToSupervisor={handleSwitchToSupervisor}
          onChangePinModal={() => {
            setPinModalMode('changePin');
            setPinModalOpen(true);
          }}
          onOpenCircularManager={() => setCircularManagerOpen(true)}
          onExportExcel={handleExportExcel}
          onPrintPdf={handlePrintPdf}
          circularTitle={activeCircular.name}
          circularDate={activeCircular.date}
          pdfUrl={OFFICIAL_CIRCULAR_INFO.documentUrl}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Clean Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Lista de Precios Oficial
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Modelos vigentes y cálculo normativo de cuotas con sellados de Provincia de Buenos Aires
              </p>
            </div>

            {role === 'gerencia' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCircularManagerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Gestionar Circulares</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Pricing Table */}
          <PriceTable
            plans={plans}
            role={role}
            sobrepautas={sobrepautas}
            onUpdateSobrepauta={handleUpdateSobrepauta}
            includeSelladoBA={includeSelladoBA}
            onToggleSelladoBA={setIncludeSelladoBA}
            onSelectPlanDetail={(plan) => setSelectedPlanDetail(plan)}
            onOpenWhatsApp={(plan) => setSelectedPlanWhatsApp(plan)}
          />

        </main>

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
          <p>Citroën Plan de Ahorro · {activeCircular.name} ({activeCircular.date}) · Red Oficial de Concesionarios</p>
        </footer>

      </div>

      {/* Print View (Visible only during window.print()) */}
      <PrintableView
        plans={plans}
        role={role}
        sobrepautas={sobrepautas}
        includeSelladoBA={includeSelladoBA}
        circularTitle={activeCircular.name}
        circularDate={activeCircular.date}
      />

      {/* PIN Authentication Modal */}
      <PinModal
        isOpen={pinModalOpen}
        mode={pinModalMode}
        currentPin={managerPin}
        onSuccess={handlePinSuccess}
        onClose={() => setPinModalOpen(false)}
      />

      {/* Circular Manager Modal (Gerencia only) */}
      <CircularManagerModal
        isOpen={circularManagerOpen}
        circulars={circulars}
        activeCircularId={activeCircularId}
        onSelectCircular={handleSelectCircular}
        onCreateCircular={handleCreateCircular}
        onDeleteCircular={handleDeleteCircular}
        onClose={() => setCircularManagerOpen(false)}
      />

      {/* Detailed Technical Plan Breakdown Modal */}
      <PlanDetailModal
        isOpen={!!selectedPlanDetail}
        plan={selectedPlanDetail}
        role={role}
        subscriptionValue={
          selectedPlanDetail
            ? selectedPlanDetail.cuota1 + (sobrepautas[selectedPlanDetail.id] ?? 0)
            : 0
        }
        includeSelladoBA={includeSelladoBA}
        onClose={() => setSelectedPlanDetail(null)}
        onOpenWhatsApp={() => {
          setSelectedPlanWhatsApp(selectedPlanDetail);
          setSelectedPlanDetail(null);
        }}
      />

      {/* WhatsApp Proposal Generator Modal */}
      <WhatsAppShareModal
        isOpen={!!selectedPlanWhatsApp}
        plan={selectedPlanWhatsApp}
        subscriptionValue={
          selectedPlanWhatsApp
            ? selectedPlanWhatsApp.cuota1 + (sobrepautas[selectedPlanWhatsApp.id] ?? 0)
            : 0
        }
        includeSelladoBA={includeSelladoBA}
        onClose={() => setSelectedPlanWhatsApp(null)}
      />

    </div>
  );
}
