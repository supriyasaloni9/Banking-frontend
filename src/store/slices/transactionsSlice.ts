import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionCategory } from '../../types';
import { INITIAL_TRANSACTIONS } from '../../data/mockData';

interface TransactionsState {
  transactions: Transaction[];
  searchQuery: string;
  selectedCategory: TransactionCategory | 'All';
  selectedAccountFilter: string | 'All';
  selectedStatus: 'All' | 'completed' | 'pending' | 'failed';
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
}

const initialState: TransactionsState = {
  transactions: INITIAL_TRANSACTIONS,
  searchQuery: '',
  selectedCategory: 'All',
  selectedAccountFilter: 'All',
  selectedStatus: 'All',
  currentPage: 1,
  itemsPerPage: 8,
  isLoading: false,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSelectedCategory: (state, action: PayloadAction<TransactionCategory | 'All'>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setSelectedAccountFilter: (state, action: PayloadAction<string | 'All'>) => {
      state.selectedAccountFilter = action.payload;
      state.currentPage = 1;
    },
    setSelectedStatus: (state, action: PayloadAction<'All' | 'completed' | 'pending' | 'failed'>) => {
      state.selectedStatus = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  addTransaction,
  setSearchQuery,
  setSelectedCategory,
  setSelectedAccountFilter,
  setSelectedStatus,
  setCurrentPage,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
