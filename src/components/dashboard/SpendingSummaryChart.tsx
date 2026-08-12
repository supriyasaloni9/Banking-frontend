import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency } from '../../lib/utils';

export const SpendingSummaryChart: React.FC = () => {
  const themeMode = useAppSelector((state) => state.theme.mode);

  const monthlyData = [
    { month: 'Mar', income: 4200, expenses: 2400 },
    { month: 'Apr', income: 4500, expenses: 2800 },
    { month: 'May', income: 4800, expenses: 2100 },
    { month: 'Jun', income: 5100, expenses: 3200 },
    { month: 'Jul', income: 4900, expenses: 2650 },
    { month: 'Aug', income: 4850, expenses: 2880 },
  ];

  const gridColor = '#27272a'; // zinc-800

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md transition-all space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Cash Flow Analytics
          </h2>
          <p className="text-xs text-zinc-400">
            6-Month Income vs Expense Trend
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Income
          </span>
          <span className="flex items-center gap-1 text-indigo-400">
            <span className="h-2 w-2 rounded-full bg-indigo-400" /> Expenses
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#ffffff',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Amount']}
            />
            <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={16} />
            <Bar dataKey="expenses" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
