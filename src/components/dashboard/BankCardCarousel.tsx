import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Copy,
  Eye,
  EyeOff,
  Check,
  Trash2,
  Lock,
  Wifi,
} from 'lucide-react';
import { BankAccount } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { removeAccount, selectAccount } from '../../store/slices/accountsSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import { formatCurrency } from '../../lib/utils';

interface BankCardCarouselProps {
  accounts: BankAccount[];
  selectedAccountId: string | null;
  onOpenConnectBank: () => void;
}

export const BankCardCarousel: React.FC<BankCardCarouselProps> = ({
  accounts,
  selectedAccountId,
  onOpenConnectBank,
}) => {
  const dispatch = useAppDispatch();

  const [revealedAccountIds, setRevealedAccountIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleReveal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedAccountIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyNumber = (acc: BankAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(acc.accountNumberFull);
    setCopiedId(acc.id);
    dispatch(
      addNotification({
        title: 'Account Number Copied',
        message: `Account number for ${acc.accountName} copied to clipboard.`,
        type: 'info',
      })
    );
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUnlink = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to unlink ${name}?`)) {
      dispatch(removeAccount(id));
      dispatch(
        addNotification({
          title: 'Account Unlinked',
          message: `${name} has been unlinked from Horizon Banking.`,
          type: 'warning',
        })
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Connected Accounts ({accounts.length})
          </h2>
          <p className="text-xs text-zinc-400">
            Realtime Plaid API sync & ACH transfer routing numbers
          </p>
        </div>
        <button
          onClick={onOpenConnectBank}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          + Add Bank
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {accounts.map((acc) => {
          const isSelected = selectedAccountId === acc.id;
          const isRevealed = Boolean(revealedAccountIds[acc.id]);

          return (
            <div
              key={acc.id}
              onClick={() => dispatch(selectAccount(acc.id))}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-xl border border-white/10 ${
                isSelected
                  ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#09090b] scale-[1.01]'
                  : 'hover:scale-[1.005] opacity-95 hover:opacity-100'
              }`}
            >
              {/* Card Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${acc.colorGradient} opacity-95 transition-all`}
              />

              {/* Glass Overlay Pattern */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                    {acc.institutionName}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {acc.accountName}
                  </h3>
                  <p className="text-[11px] text-zinc-300 capitalize font-medium">
                    {acc.accountType} Account
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-white/70 rotate-90" />
                  <button
                    onClick={(e) => handleUnlink(acc.id, acc.accountName, e)}
                    title="Unlink Account"
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-600/80 text-zinc-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body - Account Number & Balance */}
              <div className="relative z-10 mt-8 mb-4">
                <div className="flex items-center justify-between text-zinc-300 text-xs font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <span>
                      {isRevealed
                        ? acc.accountNumberFull.replace(/(.{4})/g, '$1 ').trim()
                        : `•••• •••• •••• ${acc.mask}`}
                    </span>
                    <button
                      onClick={(e) => toggleReveal(acc.id, e)}
                      className="text-zinc-400 hover:text-white transition-colors"
                      title={isRevealed ? 'Hide number' : 'Show full account number'}
                    >
                      {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <button
                    onClick={(e) => copyNumber(acc, e)}
                    className="text-zinc-400 hover:text-white transition-colors"
                    title="Copy full account number"
                  >
                    {copiedId === acc.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="flex items-baseline justify-between mt-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-300 tracking-wider">
                      Current Balance
                    </span>
                    <p className="text-2xl font-extrabold text-white tracking-tight">
                      {formatCurrency(acc.currentBalance)}
                    </p>
                  </div>

                  {acc.limit && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-zinc-300 tracking-wider">
                        Credit Limit
                      </span>
                      <p className="text-xs font-bold text-zinc-200">
                        {formatCurrency(acc.limit)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer - Routing & Security Badge */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-300 font-mono">
                <span>Routing: {acc.routingNumber}</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Lock className="h-3 w-3" /> Encrypted ACH
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
