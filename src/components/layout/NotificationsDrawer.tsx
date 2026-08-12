import React from 'react';
import { X, Check, CheckCheck, Trash2, BellRing, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { markAsRead, markAllAsRead, removeNotification } from '../../store/slices/notificationsSlice';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notifications);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-zinc-800 bg-[#09090b] p-6 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  Notifications
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(markAllAsRead())}
                  title="Mark all as read"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="mt-4 space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No new notifications right now.
                </div>
              ) : (
                notifications.map((notif) => {
                  let Icon = Info;
                  let iconBg = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

                  if (notif.type === 'success') {
                    Icon = CheckCircle2;
                    iconBg = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                  } else if (notif.type === 'warning' || notif.type === 'error') {
                    Icon = AlertTriangle;
                    iconBg = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                  }

                  return (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        notif.read
                          ? 'border-zinc-800/80 bg-zinc-950/40'
                          : 'border-emerald-500/30 bg-emerald-500/5 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl flex-shrink-0 ${iconBg}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">
                              {notif.title}
                            </h4>
                            <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="mt-1.5 block text-[10px] text-zinc-500 font-medium">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notif.read && (
                            <button
                              onClick={() => dispatch(markAsRead(notif.id))}
                              title="Mark read"
                              className="p-1 rounded text-zinc-400 hover:text-emerald-400"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => dispatch(removeNotification(notif.id))}
                            title="Delete"
                            className="p-1 rounded text-zinc-400 hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-center">
            <span className="text-[11px] text-zinc-500">Horizon Banking Push Notification Service</span>
          </div>
        </div>
      </div>
    </div>
  );
};
