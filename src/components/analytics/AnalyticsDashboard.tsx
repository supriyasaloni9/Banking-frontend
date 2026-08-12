import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  PieChart as PieIcon,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Target,
  Award,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency } from '../../lib/utils';

export const AnalyticsDashboard: React.FC = () => {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const { transactions } = useAppSelector((state) => state.transactions);

  // Calculate category breakdown
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'debit')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

  const pieData = Object.keys(categoryTotals).map((cat, idx) => ({
    name: cat,
    value: categoryTotals[cat],
    color: COLORS[idx % COLORS.length],
  }));

  const timelineData = [
    { day: 'Jul 28', spending: 320 },
    { day: 'Jul 29', spending: 45 },
    { day: 'Jul 30', spending: 129 },
    { day: 'Aug 01', spending: 1850 },
    { day: 'Aug 02', spending: 250 },
    { day: 'Aug 03', spending: 88 },
    { day: 'Aug 04', spending: 142 },
  ];

  const gridColor = themeMode === 'dark' ? '#1e293b' : '#e2e8f0';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <PieIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Financial Intelligence & Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categorized spending breakdowns, budget limits, and AI cash flow insights
            </p>
          </div>
        </div>
      </div>

      {/* Top Health Score & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Card */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Financial Health Score
              </span>
              <Award className="h-5 w-5 text-amber-400" />
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white">88</span>
              <span className="text-sm font-bold text-emerald-400">/ 100 Excellent</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">
              Your savings rate is 18% higher than average peer benchmarks in California.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Budget Limit: $5,500/mo</span>
            <span className="text-emerald-400 font-bold">52% Utilized</span>
          </div>
        </div>

        {/* AI Financial Copilot Tips */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Copilot Cash Flow Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Subscription Audit
              </p>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                You have 3 recurring subscriptions totaling $142/mo. Canceling unused services could save $1,700/yr.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                High Yield Interest
              </p>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Your BofA High Yield Savings earned $85.20 in interest this month at 4.85% APY.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Spending by Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: themeMode === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: themeMode === 'dark' ? '#334155' : '#cbd5e1',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: themeMode === 'dark' ? '#ffffff' : '#0f172a',
                  }}
                  formatter={(val: number) => [formatCurrency(val), 'Spent']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Expenditure Timeline */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Daily Expenditure Timeline
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: themeMode === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: themeMode === 'dark' ? '#334155' : '#cbd5e1',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: themeMode === 'dark' ? '#ffffff' : '#0f172a',
                  }}
                  formatter={(val: number) => [formatCurrency(val), 'Spent']}
                />
                <Area
                  type="monotone"
                  dataKey="spending"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#spendingGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
