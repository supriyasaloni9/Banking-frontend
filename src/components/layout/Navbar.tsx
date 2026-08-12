import React, { useState } from 'react';
import {
  Building2,
  Bell,
  Sun,
  Moon,
  Search,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleTheme } from '../../store/slices/themeSlice';
import { logout } from '../../store/slices/authSlice';
import { setSearchQuery } from '../../store/slices/transactionsSlice';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  onOpenAuthModal,
}) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { notifications } = useAppSelector((state) => state.notifications);
  const searchQuery = useAppSelector((state) => state.transactions.searchQuery);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950 font-extrabold shadow-lg shadow-emerald-500/20">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-lg">
                HORIZON
              </span>
              <span className="hidden sm:inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                PROD
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 tracking-wider font-medium uppercase">
              Digital Banking Engine
            </p>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search transactions, merchants, accounts..."
              className="w-full rounded-full border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Right Side: Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* System Security Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all"
          >
            {themeMode === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-zinc-300" />}
          </button>

          {/* Notifications Toggle */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-zinc-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Auth Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-800/60 transition-all border border-zinc-800/60"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.firstName}
                  className="h-8 w-8 rounded-lg object-cover ring-2 ring-emerald-500/30"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-zinc-100 leading-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate max-w-[110px]">
                    {user.email}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-zinc-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-zinc-800">
                    <p className="text-xs font-bold text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      <Sparkles className="h-3 w-3" /> Premier Account
                    </div>
                  </div>

                  <div className="py-1">
                    <a
                      href="#profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                      <User className="h-4 w-4 text-zinc-400" />
                      Account Settings
                    </a>
                  </div>

                  <div className="pt-1 border-t border-zinc-800">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        dispatch(logout());
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold px-4 py-2 text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
