import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  Receipt,
  PieChart,
  ShieldCheck,
  Settings,
  Plus,
  Building2,
  Lock,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency } from '../../lib/utils';

export type TabType =
  | 'dashboard'
  | 'accounts'
  | 'transactions'
  | 'transfer'
  | 'analytics'
  | 'security'
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenConnectBank: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConnectBank,
}) => {
  const { accounts } = useAppSelector((state) => state.accounts);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts' as TabType, label: 'Bank Accounts', icon: CreditCard, count: accounts.length },
    { id: 'transactions' as TabType, label: 'Transactions', icon: Receipt },
    { id: 'transfer' as TabType, label: 'Money Transfer', icon: ArrowRightLeft },
    { id: 'analytics' as TabType, label: 'Analytics', icon: PieChart },
    { id: 'security' as TabType, label: 'Security & Audit', icon: ShieldCheck },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 border-r border-zinc-800/50 bg-[#09090b] p-4 flex flex-col justify-between transition-colors min-h-[calc(100vh-4rem)]">
      <div>
        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-800/90 text-white shadow-sm ring-1 ring-white/10'
                    : 'text-zinc-400 hover:bg-zinc-800/30 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Bank Connect Card */}
        <div className="mt-8 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-emerald-400 tracking-wide uppercase">
              Plaid Link Sync
            </span>
            <Building2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-3 leading-relaxed">
            Connect your real checking or savings bank accounts seamlessly.
          </p>
          <button
            onClick={onOpenConnectBank}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold shadow-md shadow-emerald-500/10 transition-all"
          >
            <Plus className="h-4 w-4" />
            Connect Bank Account
          </button>
        </div>
      </div>

      {/* Bottom Summary Widget */}
      <div className="mt-8 pt-4 border-t border-zinc-800/60">
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
            <span>Total Liquid Balance</span>
            <Lock className="h-3 w-3 text-zinc-500" />
          </div>
          <p className="text-base font-extrabold text-white tracking-tight">
            {formatCurrency(totalBalance)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Realtime API Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
