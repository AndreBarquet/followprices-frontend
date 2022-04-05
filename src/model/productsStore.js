import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteProduct, getAllProducts } from '../services/products';

const fetchAllProducts = createAsyncThunk('products/getAll', getAllProducts);
const deleteProductById = createAsyncThunk('products/delete', deleteProduct);

const initialState = {
  productsList: [],
  productsListLoading: false,
  totalPages: 0,
};

export const productsStore = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // definir funções que nao sejam relacionadas a chamada de api
  },
  extraReducers: {
    // GET ALL
    [fetchAllProducts.pending]: (state) => {
      state.productsListLoading = true;
    },
    [fetchAllProducts.fulfilled]: (state, { payload }) => {
      state.productsListLoading = false;
      if (payload === null || payload === undefined) return;
      state.productsList = payload?.content;
      state.totalPages = payload?.totalPages;
    },
    [fetchAllProducts.rejected]: (state) => {
      state.productsListLoading = false;
      state.productsList = [];
    },
  }
});

// export const { increment } = products.actions;
export { fetchAllProducts, deleteProductById };
export default productsStore.reducer;
