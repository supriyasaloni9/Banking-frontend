import React from 'react';
import {
  ShieldCheck,
  Smartphone,
  Globe,
  Lock,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { INITIAL_SECURITY_LOGS } from '../../data/mockData';

export const SecurityAuditLogs: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Security & Activity Audit Trail
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active sessions, device authorizations, IP logs, and 2FA authentication
            </p>
          </div>
        </div>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Two-Factor Auth (2FA)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-base font-extrabold text-slate-900 dark:text-white">Active (TOTP App)</p>
          <p className="text-[10px] text-slate-400 mt-1">Verified on iPhone 15 Pro</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Encryption Level</span>
            <Lock className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-base font-extrabold text-slate-900 dark:text-white">256-Bit AES SSL</p>
          <p className="text-[10px] text-slate-400 mt-1">PCI-DSS Level 1 Compliant</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Authorized Devices</span>
            <Smartphone className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-base font-extrabold text-slate-900 dark:text-white">2 Devices</p>
          <p className="text-[10px] text-slate-400 mt-1">MacBook Pro & iPhone 15 Pro</p>
        </div>
      </div>

      {/* Security Audit Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Realtime Security Log History
        </h3>

        <div className="space-y-3">
          {INITIAL_SECURITY_LOGS.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {log.action}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {log.device} • {log.ipAddress} ({log.location})
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {log.status}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
