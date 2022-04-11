import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllProducts, insertProduct, updateProduct, deleteProduct } from '../services/products';

const fetchAllProducts = createAsyncThunk('products/getAll', getAllProducts);
const insertNewProduct = createAsyncThunk('products/insert', insertProduct);
const updateProductById = createAsyncThunk('products/update', updateProduct);
const deleteProductById = createAsyncThunk('products/delete', deleteProduct);

const initialState = {
  productsList: [],
  productsListLoading: false,
  totalPages: 0,
  insertLoading: false,
  updateLoading: false,
  deleteLoading: false,
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

    // INSERT
    [insertNewProduct.pending]: (state) => {
      state.insertLoading = true;
    },
    [insertNewProduct.fulfilled]: (state, { payload }) => {
      state.insertLoading = false;
    },
    [insertNewProduct.rejected]: (state) => {
      state.insertLoading = false;
    },

    // UPDATE
    [updateProductById.pending]: (state) => {
      state.deleteLoading = true;
    },
    [updateProductById.fulfilled]: (state, { payload }) => {
      state.deleteLoading = false;
    },
    [updateProductById.rejected]: (state) => {
      state.deleteLoading = false;
    },

    // DELETE
    [deleteProductById.pending]: (state) => {
      state.deleteLoading = true;
    },
    [deleteProductById.fulfilled]: (state, { payload }) => {
      state.deleteLoading = false;
    },
    [deleteProductById.rejected]: (state) => {
      state.deleteLoading = false;
    },
  }
});

// export const { increment } = products.actions;
export { fetchAllProducts, insertNewProduct, updateProductById, deleteProductById };
export default productsStore.reducer;
