import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { insertNewSetup, getAllSetups } from '../services/setup';

const fetchAllSetups = createAsyncThunk('setup/all', getAllSetups);
const insertSetup = createAsyncThunk('setup/login', insertNewSetup);

const initialState = {
  saveSetupLoading: false,
  setupData: null,
  loadingSetupsList: false,
  setupsList: null,
  totalPages: null,
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
    [fetchAllSetups.pending]: (state) => {
      state.loadingSetupsList = true;
    },
    [fetchAllSetups.fulfilled]: (state, { payload }) => {
      state.loadingSetupsList = false;
      if (payload === null || payload === undefined) return;
      state.setupsList = payload?.content;
      state.totalPages = payload?.totalPages;
    },
    [fetchAllSetups.rejected]: (state) => {
      state.loadingSetupsList = false;
    },

    // INSERT
    [insertSetup.pending]: (state) => {
      state.saveSetupLoading = true;
    },
    [insertSetup.fulfilled]: (state, { payload }) => {
      state.saveSetupLoading = false;
    },
    [insertSetup.rejected]: (state) => {
      state.saveSetupLoading = false;
    },
  }
});

const { setSetupData } = currentUserStore.actions;

export { insertSetup, setSetupData, fetchAllSetups };
export default currentUserStore.reducer;
