import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { insertNewSetup, getAllSetups, getDetails, getDetailsEvolution } from '../services/setup';

const fetchAllSetups = createAsyncThunk('setup/all', getAllSetups);
const insertSetup = createAsyncThunk('setup/insert', insertNewSetup);
const fetchSetupDetails = createAsyncThunk('setup/details', getDetails);
const fetchSetupDetailsEvolution = createAsyncThunk('setup/evolution', getDetailsEvolution);

const initialState = {
  saveSetupLoading: false,
  setupData: null,
  loadingSetupsList: false,
  setupsList: null,
  totalPages: null,
  setupSummary: null,
  setupSummaryLoading: false,
  setupProductsEvolution: null,
  setupProductsEvolutionLoading: false,
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

    // FETCH SETUP DETAILS SUMMARY
    [fetchSetupDetails.pending]: (state) => {
      state.setupSummaryLoading = true;
    },
    [fetchSetupDetails.fulfilled]: (state, { payload }) => {
      state.setupSummary = payload;
      state.setupSummaryLoading = false;
    },
    [fetchSetupDetails.rejected]: (state) => {
      state.setupSummaryLoading = false;
    },

    // FETCH  SETUP PRODUCTS EVOLUTION
    [fetchSetupDetailsEvolution.pending]: (state) => {
      state.setupProductsEvolutionLoading = true;
    },
    [fetchSetupDetailsEvolution.fulfilled]: (state, { payload }) => {
      state.setupProductsEvolution = payload;
      state.setupProductsEvolutionLoading = false;
    },
    [fetchSetupDetailsEvolution.rejected]: (state) => {
      state.setupProductsEvolutionLoading = false;
    },
  }
});

const { setSetupData } = currentUserStore.actions;

export { insertSetup, setSetupData, fetchAllSetups, fetchSetupDetails, fetchSetupDetailsEvolution, };
export default currentUserStore.reducer;
