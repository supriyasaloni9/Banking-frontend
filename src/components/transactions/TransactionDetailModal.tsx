import React from 'react';
import {
  X,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  CreditCard,
  Hash,
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAppDispatch } from '../../store/hooks';
import { addNotification } from '../../store/slices/notificationsSlice';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  if (!transaction) return null;

  const handleDispute = () => {
    alert(`Dispute initiated for reference ${transaction.referenceNumber}. Our security team will contact you within 24 hours.`);
    dispatch(
      addNotification({
        title: 'Dispute Initiated',
        message: `Claim logged for ${transaction.merchantName} ($${transaction.amount}). Case #DSP-${Math.floor(
          100000 + Math.random() * 900000
        )}`,
        type: 'warning',
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#09090b] shadow-2xl p-6 transition-all space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Transaction Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Merchant & Amount Display */}
        <div className="text-center p-6 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xl mb-3">
            {transaction.merchantName.charAt(0)}
          </div>
          <h2 className="text-lg font-extrabold text-white">
            {transaction.merchantName}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {transaction.description}
          </p>

          <p className="mt-4 text-3xl font-black tracking-tight text-white">
            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </p>

          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" /> Settled & Verified
          </div>
        </div>

        {/* Metadata Breakdown */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
            <span className="text-zinc-400 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-500" /> Date & Time
            </span>
            <span className="font-bold text-white">
              {formatDate(transaction.date)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
            <span className="text-zinc-400 flex items-center gap-2">
              <Hash className="h-4 w-4 text-zinc-500" /> Reference Number
            </span>
            <span className="font-mono font-semibold text-white">
              {transaction.referenceNumber}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
            <span className="text-zinc-400 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-zinc-500" /> Payment Source
            </span>
            <span className="font-bold text-white">
              {transaction.institutionName} (**** {transaction.accountMask})
            </span>
          </div>

          {transaction.location && (
            <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
              <span className="text-zinc-400 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-zinc-500" /> Location
              </span>
              <span className="font-bold text-white">
                {transaction.location.city}, {transaction.location.state}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleDispute}
            className="flex-1 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <AlertTriangle className="h-4 w-4" />
            Report Issue
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold shadow-md shadow-emerald-500/10 transition-all"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};
