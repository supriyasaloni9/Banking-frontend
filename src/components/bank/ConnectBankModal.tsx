import React, { useState } from 'react';
import {
  X,
  Building2,
  Lock,
  Search,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addAccount } from '../../store/slices/accountsSlice';
import { addNotification } from '../../store/slices/notificationsSlice';

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BankOption {
  id: string;
  name: string;
  logo: string;
  color: string;
  gradient: string;
}

const POPULAR_BANKS: BankOption[] = [
  {
    id: 'ins_chase',
    name: 'Chase Bank',
    logo: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=120&auto=format&fit=crop&q=80',
    color: '#117ACA',
    gradient: 'from-blue-600 via-indigo-700 to-slate-900',
  },
  {
    id: 'ins_bofa',
    name: 'Bank of America',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=120&auto=format&fit=crop&q=80',
    color: '#E31837',
    gradient: 'from-rose-600 via-red-700 to-slate-900',
  },
  {
    id: 'ins_wellsfargo',
    name: 'Wells Fargo',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=120&auto=format&fit=crop&q=80',
    color: '#D71E28',
    gradient: 'from-amber-600 via-red-700 to-slate-900',
  },
  {
    id: 'ins_citi',
    name: 'Citibank',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    color: '#003B70',
    gradient: 'from-blue-700 via-slate-800 to-slate-950',
  },
  {
    id: 'ins_capone',
    name: 'Capital One',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    color: '#004977',
    gradient: 'from-teal-600 via-cyan-700 to-slate-900',
  },
  {
    id: 'ins_fidelity',
    name: 'Fidelity Investments',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80',
    color: '#4B6B38',
    gradient: 'from-emerald-600 via-teal-700 to-slate-900',
  },
];

export const ConnectBankModal: React.FC<ConnectBankModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Select Bank, 2: Plaid Auth, 3: Account Type, 4: Success
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('user_good');
  const [password, setPassword] = useState('pass_good');
  const [accountType, setAccountType] = useState<'checking' | 'savings' | 'credit'>('checking');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const filteredBanks = POPULAR_BANKS.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBankSelect = (bank: BankOption) => {
    setSelectedBank(bank);
    setStep(2);
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 1200);
  };

  const handleCompleteLink = async () => {
    if (!selectedBank) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/plaid/exchange-public-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_token: `public-sandbox-${Date.now()}`,
          institutionName: selectedBank.name,
          accountType,
        }),
      });

      const data = await response.json();

      if (data.success && data.account) {
        dispatch(addAccount(data.account));
        dispatch(
          addNotification({
            title: 'Bank Linked via Plaid',
            message: `${selectedBank.name} (${accountType}) successfully connected.`,
            type: 'success',
          })
        );
        setStep(4);
      }
    } catch (err) {
      console.error('Failed to link bank:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedBank(null);
    setSearchQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#09090b] shadow-2xl overflow-hidden transition-all">
        {/* Plaid Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 font-black text-xs tracking-wider">
              PLAID
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Plaid Link Secure Integration</span>
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </h3>
              <p className="text-[10px] text-zinc-400">256-Bit Financial Encryption Active</p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step 1: Select Bank */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-base font-bold text-white">
                Select your financial institution
              </h4>
              <p className="text-xs text-zinc-400">
                Horizon Banking uses Plaid to establish instant end-to-end authorization.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search over 11,000+ banks..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-4 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {filteredBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelect(bank)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all text-left group"
                >
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-800"
                  />
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                    {bank.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>Sandbox mode active: You can test with any popular bank above.</span>
            </div>
          </div>
        )}

        {/* Step 2: Plaid Auth Credentials */}
        {step === 2 && selectedBank && (
          <form onSubmit={handleAuthenticate} className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <img
                src={selectedBank.logo}
                alt={selectedBank.name}
                className="h-8 w-8 rounded-lg object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-white">
                  Authenticate with {selectedBank.name}
                </h4>
                <p className="text-[10px] text-zinc-400">Plaid Sandbox Portal</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Online Banking Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <p className="text-[10px] text-zinc-400">
              Demo sandbox credentials are pre-filled (`user_good` / `pass_good`).
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Authenticating with Bank...</span>
              ) : (
                <>
                  <span>Sign In & Verify</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 3: Choose Account Type */}
        {step === 3 && selectedBank && (
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-base font-bold text-white">
                Select Account to Link
              </h4>
              <p className="text-xs text-zinc-400">
                Choose which account category to map to your Horizon Banking dashboard.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'checking', label: 'Everyday Checking', desc: 'Direct deposit & ACH transfer enabled' },
                { id: 'savings', label: 'High Yield Savings', desc: 'Yield-bearing liquid savings' },
                { id: 'credit', label: 'Rewards Credit Card', desc: 'Transaction ledger & card limit' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAccountType(item.id as any)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                    accountType === item.id
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                      : 'border-zinc-800 bg-zinc-950'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-zinc-400">{item.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={handleCompleteLink}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Syncing Financial Ledger...' : 'Confirm & Finalize Link'}
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && selectedBank && (
          <div className="p-8 text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Bank Connected Successfully!
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {selectedBank.name} has been securely verified via Plaid. Your accounts and balances are now active.
            </p>
            <button
              onClick={resetAndClose}
              className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 text-xs font-bold shadow-md transition-all hover:bg-zinc-200"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
