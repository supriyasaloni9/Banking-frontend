import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransferRecord } from '../../types';
import { INITIAL_TRANSFERS } from '../../data/mockData';

interface TransfersState {
  transfers: TransferRecord[];
  isTransferring: boolean;
  error: string | null;
}

const initialState: TransfersState = {
  transfers: INITIAL_TRANSFERS,
  isTransferring: false,
  error: null,
};

const transfersSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {
    addTransfer: (state, action: PayloadAction<TransferRecord>) => {
      state.transfers.unshift(action.payload);
    },
    setIsTransferring: (state, action: PayloadAction<boolean>) => {
      state.isTransferring = action.payload;
    },
    setTransferError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addTransfer, setIsTransferring, setTransferError } = transfersSlice.actions;
export default transfersSlice.reducer;
