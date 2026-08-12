import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '../../types';

interface NotificationsState {
  notifications: NotificationItem[];
}

const initialState: NotificationsState = {
  notifications: [
    {
      id: 'notif_1',
      title: 'Welcome to Horizon Banking',
      message: 'Your accounts are securely synced with 256-bit AES encryption.',
      type: 'info',
      timestamp: 'Just now',
      read: false,
    },
  ],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<NotificationItem, 'id' | 'timestamp' | 'read'>>
    ) => {
      const newNotif: NotificationItem = {
        ...action.payload,
        id: 'notif_' + Date.now(),
        timestamp: 'Just now',
        read: false,
      };
      state.notifications.unshift(newNotif);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, removeNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
