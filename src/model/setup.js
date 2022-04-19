import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { insertNewSetup } from '../services/setup';

const insertSetup = createAsyncThunk('setup/login', insertNewSetup);

const initialState = {
  saveSetupLoading: false,
  setupData: null,
};

export const currentUserStore = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    setSetupData: (state, { payload }) => {
      state.setupData = payload;
    }
  },
  extraReducers: {
    // GET ALL
    [insertSetup.pending]: (state) => {
      state.saveSetupLoading = true;
    },
    [insertSetup.fulfilled]: (state, { payload }) => {
      state.saveSetupLoading = false;
      if (payload === null || payload === undefined) return;
    },
    [insertSetup.rejected]: (state) => {
      state.saveSetupLoading = false;
    },
  }
});

const { setSetupData } = currentUserStore.actions;

export { insertSetup, setSetupData };
export default currentUserStore.reducer;
