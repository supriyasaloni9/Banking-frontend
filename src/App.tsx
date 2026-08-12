import React, { useState, useEffect } from 'react';
import { useAppSelector } from './store/hooks';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, TabType } from './components/layout/Sidebar';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { WelcomeHeader } from './components/dashboard/WelcomeHeader';
import { BankCardCarousel } from './components/dashboard/BankCardCarousel';
import { RecentTransactionsList } from './components/dashboard/RecentTransactionsList';
import { SpendingSummaryChart } from './components/dashboard/SpendingSummaryChart';
import { ConnectBankModal } from './components/bank/ConnectBankModal';
import { TransactionTable } from './components/transactions/TransactionTable';
import { TransactionDetailModal } from './components/transactions/TransactionDetailModal';
import { TransferForm } from './components/transfer/TransferForm';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { SecurityAuditLogs } from './components/security/SecurityAuditLogs';
import { ProfileSettings } from './components/settings/ProfileSettings';
import { LoginModal } from './components/auth/LoginModal';
import { Transaction } from './types';

export default function App() {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const { accounts, selectedAccountId } = useAppSelector((state) => state.accounts);

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isConnectBankOpen, setIsConnectBankOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);


  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans transition-colors selection:bg-emerald-500 selection:text-zinc-950">
      {/* Top Navbar */}
      <Navbar
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenConnectBank={() => setIsConnectBankOpen(true)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <WelcomeHeader
                onOpenConnectBank={() => setIsConnectBankOpen(true)}
                onNavigateToTransfer={() => setActiveTab('transfer')}
              />

              <BankCardCarousel
                accounts={accounts}
                selectedAccountId={selectedAccountId}
                onOpenConnectBank={() => setIsConnectBankOpen(true)}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SpendingSummaryChart />
                <RecentTransactionsList
                  onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                  onViewAllTransactions={() => setActiveTab('transactions')}
                />
              </div>
            </div>
          )}

          {/* TAB 2: BANK ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <BankCardCarousel
                accounts={accounts}
                selectedAccountId={selectedAccountId}
                onOpenConnectBank={() => setIsConnectBankOpen(true)}
              />

              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-sm">
                <h3 className="text-base font-bold text-white mb-2">
                  ACH Routing & Wire Transfer Verification
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                  All accounts connected via Plaid Link are assigned routing numbers for instant direct deposits, automated clearing house (ACH) network clearing, and wire settlements.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSACTIONS LEDGER */}
          {activeTab === 'transactions' && (
            <div className="animate-in fade-in duration-200">
              <TransactionTable
                onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              />
            </div>
          )}

          {/* TAB 4: MONEY TRANSFER (DWOLLA) */}
          {activeTab === 'transfer' && (
            <div className="animate-in fade-in duration-200">
              <TransferForm />
            </div>
          )}

          {/* TAB 5: ANALYTICS & INSIGHTS */}
          {activeTab === 'analytics' && (
            <div className="animate-in fade-in duration-200">
              <AnalyticsDashboard />
            </div>
          )}

          {/* TAB 6: SECURITY & AUDIT LOGS */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in duration-200">
              <SecurityAuditLogs />
            </div>
          )}

          {/* TAB 7: SETTINGS & PROFILE */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-200">
              <ProfileSettings />
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <ConnectBankModal
        isOpen={isConnectBankOpen}
        onClose={() => setIsConnectBankOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <LoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
