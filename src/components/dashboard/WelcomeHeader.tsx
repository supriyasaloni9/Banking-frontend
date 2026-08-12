import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  Download,
  Sparkles,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency, generateCSV } from '../../lib/utils';

interface WelcomeHeaderProps {
  onOpenConnectBank: () => void;
  onNavigateToTransfer: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  onOpenConnectBank,
  onNavigateToTransfer,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const { accounts } = useAppSelector((state) => state.accounts);
  const { transactions } = useAppSelector((state) => state.transactions);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExportCSV = () => {
    generateCSV(
      transactions.map((t) => ({
        Date: t.date,
        Merchant: t.merchantName,
        Amount: t.amount,
        Type: t.type,
        Category: t.category,
        Status: t.status,
        Reference: t.referenceNumber,
        Account: t.accountMask,
      })),
      `Horizon_Statement_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-[#09090b] border border-white/10 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-8 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Horizon Digital Asset Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user ? user.firstName : 'Alexander'}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              All your linked accounts, live ACH transfers, and spending analytics are updated in real-time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenConnectBank}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-extrabold text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Link Bank
            </button>

            <button
              onClick={onNavigateToTransfer}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:scale-[1.02]"
            >
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              Send Money
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2.5 text-xs font-bold text-zinc-200 backdrop-blur-md transition-all"
            >
              <Download className="h-4 w-4" />
              Statement CSV
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Net Worth */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Total Net Balance
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {formatCurrency(totalBalance)}
            </h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              +4.2%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">across {accounts.length} linked banking institutions</p>
        </div>

        {/* Monthly Income */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Total Income (This Month)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {formatCurrency(totalIncome)}
            </h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              +12.8%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">Salary, transfers & investment yield</p>
        </div>

        {/* Monthly Expenses */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Total Expenses (This Month)
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {formatCurrency(totalExpenses)}
            </h2>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
              -3.4%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">Under monthly spending ceiling ($5,500)</p>
        </div>
      </div>
    </div>
  );
};
