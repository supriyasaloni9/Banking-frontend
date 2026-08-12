import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Building2,
  Send,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Clock,
  Zap,
  Lock,
  Download,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addTransfer } from '../../store/slices/transfersSlice';
import { updateAccountBalance } from '../../store/slices/accountsSlice';
import { addTransaction } from '../../store/slices/transactionsSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import { formatCurrency, formatDate } from '../../lib/utils';
import { TransferRecord } from '../../types';

export const TransferForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector((state) => state.accounts);

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Input, 2: Review & OTP PIN, 3: Success Receipt
  const [transferType, setTransferType] = useState<'internal' | 'external' | 'p2p'>('internal');
  const [senderAccountId, setSenderAccountId] = useState(accounts[0]?.id || '');
  const [recipientAccountId, setRecipientAccountId] = useState(accounts[1]?.id || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientDetails, setRecipientDetails] = useState('');
  const [amount, setAmount] = useState('');
  const [speed, setSpeed] = useState<'standard' | 'instant'>('standard');
  const [memo, setMemo] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTransfer, setCompletedTransfer] = useState<TransferRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const senderAccount = accounts.find((a) => a.id === senderAccountId);
  const recipientAccount = accounts.find((a) => a.id === recipientAccountId);

  const parsedAmount = parseFloat(amount) || 0;
  const fee = speed === 'instant' ? 1.5 : 0;
  const totalDeduction = parsedAmount + fee;

  const handleReviewStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!senderAccount) {
      setErrorMessage('Please select a valid sender bank account.');
      return;
    }

    if (parsedAmount <= 0) {
      setErrorMessage('Please enter a valid transfer amount greater than $0.');
      return;
    }

    if (senderAccount.currentBalance < totalDeduction) {
      setErrorMessage(
        `Insufficient funds in ${senderAccount.accountName}. Required: ${formatCurrency(
          totalDeduction
        )}, Available: ${formatCurrency(senderAccount.currentBalance)}.`
      );
      return;
    }

    if (transferType === 'internal' && senderAccountId === recipientAccountId) {
      setErrorMessage('Sender and recipient accounts cannot be the same account.');
      return;
    }

    if (transferType !== 'internal' && (!recipientName || !recipientDetails)) {
      setErrorMessage('Please enter recipient name and account details.');
      return;
    }

    setStep(2);
  };

  const handleExecuteTransfer = async () => {
    if (securityPin !== '1234' && securityPin.length < 4) {
      setErrorMessage('Please enter a 4-digit security PIN (Demo PIN: 1234)');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const targetRecipientName =
        transferType === 'internal'
          ? recipientAccount?.accountName || 'Internal Account'
          : recipientName;

      const targetRecipientDetails =
        transferType === 'internal'
          ? `${recipientAccount?.institutionName} (**** ${recipientAccount?.mask})`
          : recipientDetails;

      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderAccountId,
          recipientName: targetRecipientName,
          recipientDetails: targetRecipientDetails,
          amount: parsedAmount,
          speed,
          memo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed');
      }

      const record: TransferRecord = data.transfer;

      // Update Redux State
      dispatch(addTransfer(record));

      if (data.updatedAccount) {
        dispatch(
          updateAccountBalance({
            id: data.updatedAccount.id,
            currentBalance: data.updatedAccount.currentBalance,
            availableBalance: data.updatedAccount.availableBalance,
          })
        );
      }

      if (transferType === 'internal' && recipientAccount) {
        dispatch(
          updateAccountBalance({
            id: recipientAccount.id,
            currentBalance: recipientAccount.currentBalance + parsedAmount,
            availableBalance: recipientAccount.availableBalance + parsedAmount,
          })
        );
      }

      dispatch(
        addNotification({
          title: 'Transfer Processed',
          message: `$${parsedAmount.toFixed(2)} sent to ${targetRecipientName}. Ref: ${record.transferNumber}`,
          type: 'success',
        })
      );

      setCompletedTransfer(record);
      setStep(3);
    } catch (err: any) {
      setErrorMessage(err.message || 'Server transfer processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setAmount('');
    setMemo('');
    setSecurityPin('');
    setCompletedTransfer(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md transition-all space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ArrowRightLeft className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Money Transfer Engine
            </h2>
            <p className="text-xs text-zinc-400">
              Dwolla ACH Clearing Network • Instant & Standard Transfers
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Input Form */}
      {step === 1 && (
        <form
          onSubmit={handleReviewStep}
          className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md space-y-6 transition-all"
        >
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Transfer Type Tabs */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Transfer Category
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
              {[
                { id: 'internal', label: 'Between Accounts', icon: Building2 },
                { id: 'external', label: 'External Bank ACH', icon: Send },
                { id: 'p2p', label: 'P2P Transfer', icon: Users },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = transferType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTransferType(tab.id as any)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Account Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              From Account
            </label>
            <select
              value={senderAccountId}
              onChange={(e) => setSenderAccountId(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.institutionName} - {acc.accountName} (**** {acc.mask}) — Available:{' '}
                  {formatCurrency(acc.currentBalance)}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Account / Info */}
          {transferType === 'internal' ? (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                To Internal Account
              </label>
              <select
                value={recipientAccountId}
                onChange={(e) => setRecipientAccountId(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.institutionName} - {acc.accountName} (**** {acc.mask})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {transferType === 'external' ? 'Routing & Account #' : 'Email or Phone'}
                </label>
                <input
                  type="text"
                  value={recipientDetails}
                  onChange={(e) => setRecipientDetails(e.target.value)}
                  placeholder={
                    transferType === 'external'
                      ? 'e.g. 121000358 / 991823019'
                      : 'e.g. sarah.j@gmail.com'
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Transfer Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-zinc-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-8 pr-4 py-3 text-xl font-extrabold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Speed Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Processing Speed
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSpeed('standard')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  speed === 'standard'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-zinc-800 bg-zinc-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" /> Standard ACH
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">FREE</span>
                </div>
                <p className="text-[10px] text-zinc-400">Delivered within 1 business day</p>
              </button>

              <button
                type="button"
                onClick={() => setSpeed('instant')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  speed === 'instant'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-zinc-800 bg-zinc-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-amber-400" /> Instant Dwolla
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">$1.50 Fee</span>
                </div>
                <p className="text-[10px] text-zinc-400">Instant clearing in under 5 minutes</p>
              </button>
            </div>
          </div>

          {/* Memo Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Memo / Reference Note
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="e.g. Rent share, savings contribution"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all"
          >
            Review Transfer Details
          </button>
        </form>
      )}

      {/* Step 2: Review & Security PIN */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md space-y-6 transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h3 className="text-base font-bold text-white">
              Confirm Transfer Authorization
            </h3>
            <span className="text-xs text-zinc-400">Step 2 of 2</span>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-800">
              <span className="text-zinc-400">From Account</span>
              <span className="font-bold text-white">
                {senderAccount?.accountName} (**** {senderAccount?.mask})
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Transfer Amount</span>
              <span className="font-bold text-white">
                {formatCurrency(parsedAmount)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Network Fee ({speed})</span>
              <span className="font-bold text-white">
                {formatCurrency(fee)}
              </span>
            </div>

            <div className="flex justify-between py-1 pt-2 font-extrabold text-sm text-emerald-400">
              <span>Total Debit</span>
              <span>{formatCurrency(totalDeduction)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Security PIN Authorization
            </label>
            <input
              type="password"
              maxLength={4}
              value={securityPin}
              onChange={(e) => setSecurityPin(e.target.value)}
              placeholder="Enter 4-digit PIN (Demo: 1234)"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-center font-mono text-base tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-2.5 rounded-xl border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-800"
            >
              Back
            </button>
            <button
              onClick={handleExecuteTransfer}
              disabled={isProcessing}
              className="w-2/3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing Transfer...' : 'Authorize & Submit'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success Receipt */}
      {step === 3 && completedTransfer && (
        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-center space-y-6 transition-all">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-8 ring-emerald-500/10">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white">
              Transfer Dispatched!
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Dwolla ACH Reference: {completedTransfer.transferNumber}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-left space-y-2">
            <div className="flex justify-between py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Recipient</span>
              <span className="font-bold text-white">
                {completedTransfer.recipientName}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Amount Sent</span>
              <span className="font-bold text-white">
                {formatCurrency(completedTransfer.amount)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Est. Settlement</span>
              <span className="font-bold text-white">
                {formatDate(completedTransfer.estimatedArrival)}
              </span>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 text-xs font-bold transition-all hover:bg-zinc-200"
          >
            Send Another Transfer
          </button>
        </div>
      )}
    </div>
  );
};
