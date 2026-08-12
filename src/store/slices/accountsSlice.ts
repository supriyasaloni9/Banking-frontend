import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankAccount } from '../../types';
import { INITIAL_BANK_ACCOUNTS } from '../../data/mockData';

interface AccountsState {
  accounts: BankAccount[];
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  accounts: INITIAL_BANK_ACCOUNTS,
  selectedAccountId: 'acc_chase_main',
  isLoading: false,
  error: null,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<BankAccount[]>) => {
      state.accounts = action.payload;
    },
    addAccount: (state, action: PayloadAction<BankAccount>) => {
      state.accounts.push(action.payload);
      state.selectedAccountId = action.payload.id;
    },
    removeAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter((acc) => acc.id !== action.payload);
      if (state.selectedAccountId === action.payload) {
        state.selectedAccountId = state.accounts[0]?.id || null;
      }
    },
    selectAccount: (state, action: PayloadAction<string | null>) => {
      state.selectedAccountId = action.payload;
    },
    updateAccountBalance: (
      state,
      action: PayloadAction<{ id: string; currentBalance: number; availableBalance: number }>
    ) => {
      const acc = state.accounts.find((a) => a.id === action.payload.id);
      if (acc) {
        acc.currentBalance = action.payload.currentBalance;
        acc.availableBalance = action.payload.availableBalance;
      }
    },
    setAccountsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setAccounts,
  addAccount,
  removeAccount,
  selectAccount,
  updateAccountBalance,
  setAccountsLoading,
} = accountsSlice.actions;

export default accountsSlice.reducer;
