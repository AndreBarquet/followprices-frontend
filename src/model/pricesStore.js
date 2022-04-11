import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPrices, insertPrice } from '../services/prices';

const fetchProductPrices = createAsyncThunk('prices/getAll', getPrices);
const insertNewPrice = createAsyncThunk('prices/insert', insertPrice);

const initialState = {
  pricesList: [],
  loadingPricesList: false,
  insertPriceLoading: false,
};

export const pricesStore = createSlice({
  name: 'prices',
  initialState,
  reducers: {
    // definir funções que nao sejam relacionadas a chamada de api
  },
  extraReducers: {
    // GET BY PRODUCT
    [fetchProductPrices.pending]: (state) => {
      state.loadingPricesList = true;
    },
    [fetchProductPrices.fulfilled]: (state, { payload }) => {
      state.loadingPricesList = false;
      if (payload === null || payload === undefined) return;
      state.pricesList = payload?.content;
    },
    [fetchProductPrices.rejected]: (state) => {
      state.loadingPricesList = false;
      state.pricesList = [];
    },

    // INSERT
    [insertNewPrice.pending]: (state) => {
      state.insertPriceLoading = true;
    },
    [insertNewPrice.fulfilled]: (state, { payload }) => {
      state.insertPriceLoading = false;
    },
    [insertNewPrice.rejected]: (state) => {
      state.insertPriceLoading = false;
    },
  }
});

// export const { increment } = products.actions;
export { fetchProductPrices, insertNewPrice };
export default pricesStore.reducer;
