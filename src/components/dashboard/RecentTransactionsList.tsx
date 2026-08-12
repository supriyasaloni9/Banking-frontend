import React from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShoppingBag,
  Utensils,
  Home,
  Bus,
  DollarSign,
  Film,
  Activity,
  Zap,
} from 'lucide-react';
import { Transaction, TransactionCategory } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setSearchQuery,
  setSelectedCategory,
} from '../../store/slices/transactionsSlice';

interface RecentTransactionsListProps {
  onSelectTransaction: (tx: Transaction) => void;
  onViewAllTransactions: () => void;
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  onSelectTransaction,
  onViewAllTransactions,
}) => {
  const dispatch = useAppDispatch();
  const { transactions, searchQuery, selectedCategory } = useAppSelector(
    (state) => state.transactions
  );

  const getCategoryIcon = (category: TransactionCategory) => {
    switch (category) {
      case 'Food & Dining':
        return Utensils;
      case 'Shopping':
        return ShoppingBag;
      case 'Housing & Utilities':
        return Home;
      case 'Transportation':
        return Bus;
      case 'Income & Payroll':
        return DollarSign;
      case 'Entertainment':
        return Film;
      case 'Health & Wellness':
        return Activity;
      default:
        return Zap;
    }
  };

  const categories: (TransactionCategory | 'All')[] = [
    'All',
    'Food & Dining',
    'Shopping',
    'Housing & Utilities',
    'Transportation',
    'Income & Payroll',
    'Transfer',
  ];

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentFiltered = filtered.slice(0, 6);

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md transition-all space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            Recent Activity
          </h2>
          <p className="text-xs text-zinc-400">
            Realtime posted and pending card & ACH ledger activity
          </p>
        </div>

        <button
          onClick={onViewAllTransactions}
          className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 transition-colors"
        >
          View Full Ledger <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => dispatch(setSelectedCategory(cat))}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-zinc-950 font-extrabold shadow-sm'
                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-zinc-800/60">
        {recentFiltered.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs">
            No transactions found matching search criteria.
          </div>
        ) : (
          recentFiltered.map((tx) => {
            const CategoryIcon = getCategoryIcon(tx.category);
            const isCredit = tx.type === 'credit';

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="py-3.5 px-2 rounded-xl flex items-center justify-between hover:bg-zinc-800/40 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 ${
                      isCredit
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                    }`}
                  >
                    <CategoryIcon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">
                        {tx.merchantName}
                      </h4>
                      {tx.isRecurring && (
                        <span className="text-[9px] font-bold bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded-full border border-purple-500/20">
                          Recurring
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {tx.description} • {formatDate(tx.date)}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <span
                    className={`text-xs font-extrabold ${
                      isCredit ? 'text-emerald-400' : 'text-zinc-100'
                    }`}
                  >
                    {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-500 mt-0.5">
                    {tx.status === 'completed' ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Clock className="h-3 w-3 text-amber-400" />
                    )}
                    <span className="capitalize">{tx.status}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
