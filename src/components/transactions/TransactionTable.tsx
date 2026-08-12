import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Utensils,
  ShoppingBag,
  Home,
  Bus,
  DollarSign,
  Film,
  Activity,
  Zap,
} from 'lucide-react';
import { Transaction, TransactionCategory } from '../../types';
import { formatCurrency, formatDate, generateCSV } from '../../lib/utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setSearchQuery,
  setSelectedCategory,
  setSelectedAccountFilter,
  setSelectedStatus,
  setCurrentPage,
} from '../../store/slices/transactionsSlice';

interface TransactionTableProps {
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  onSelectTransaction,
}) => {
  const dispatch = useAppDispatch();
  const {
    transactions,
    searchQuery,
    selectedCategory,
    selectedAccountFilter,
    selectedStatus,
    currentPage,
    itemsPerPage,
  } = useAppSelector((state) => state.transactions);

  const { accounts } = useAppSelector((state) => state.accounts);

  const [sortField, setSortField] = useState<'date' | 'amount' | 'merchantName'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
    'Subscriptions',
    'Investments',
    'Transfer',
  ];

  // Filtering
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesAccount =
      selectedAccountFilter === 'All' || t.accountId === selectedAccountFilter;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesAccount && matchesStatus;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'amount') {
      aVal = a.amount;
      bVal = b.amount;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: 'date' | 'amount' | 'merchantName') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportCSV = () => {
    generateCSV(
      sorted.map((t) => ({
        Date: t.date,
        Merchant: t.merchantName,
        Description: t.description,
        Amount: t.amount,
        Type: t.type,
        Category: t.category,
        Status: t.status,
        Reference: t.referenceNumber,
        AccountMask: t.accountMask,
      })),
      `Horizon_Transactions_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md transition-all space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Transaction Ledger
            </h2>
            <p className="text-xs text-zinc-400">
              Filter, search, and audit all settled & pending card and ACH transactions
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold shadow-md shadow-emerald-500/10 transition-all self-start md:self-auto"
          >
            <Download className="h-4 w-4" />
            Export CSV ({sorted.length})
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search merchant or REF..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value as any))}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Account Filter Dropdown */}
          <select
            value={selectedAccountFilter}
            onChange={(e) => dispatch(setSelectedAccountFilter(e.target.value))}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Bank Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountName} (**** {acc.mask})
              </option>
            ))}
          </select>

          {/* Status Filter Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => dispatch(setSelectedStatus(e.target.value as any))}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th
                  onClick={() => toggleSort('merchantName')}
                  className="py-3.5 px-6 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Merchant & Description</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Category</th>
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th
                  onClick={() => toggleSort('amount')}
                  className="py-3.5 px-6 text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500">
                    No matching transactions found in ledger.
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => {
                  const CategoryIcon = getCategoryIcon(tx.category);
                  const isCredit = tx.type === 'credit';

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      className="hover:bg-zinc-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-xl flex-shrink-0 ${
                              isCredit
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                            }`}
                          >
                            <CategoryIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {tx.merchantName}
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate max-w-xs">
                              {tx.description} • {tx.referenceNumber}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">
                          {tx.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-zinc-400 font-medium">
                        {formatDate(tx.date)}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {tx.status === 'completed' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <span
                          className={`font-extrabold text-sm ${
                            isCredit
                              ? 'text-emerald-400'
                              : 'text-zinc-100'
                          }`}
                        >
                          {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                        <p className="text-[10px] text-zinc-500">Card **** {tx.accountMask}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between text-xs text-zinc-400">
          <span>
            Showing Page {currentPage} of {totalPages} ({sorted.length} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setCurrentPage(Math.max(1, currentPage - 1)))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
