import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllProducts, insertProduct, updateProduct, deleteProduct, getProductsShort, getProductsGroupedByType } from '../services/products';

const fetchAllProducts = createAsyncThunk('products/getAll', getAllProducts);
const fetchProductsGrouped = createAsyncThunk('products/getGrouped', getProductsGroupedByType);
const insertNewProduct = createAsyncThunk('products/insert', insertProduct);
const updateProductById = createAsyncThunk('products/update', updateProduct);
const deleteProductById = createAsyncThunk('products/delete', deleteProduct);
const fetchProductsShort = createAsyncThunk('products/getShort', getProductsShort);

const initialState = {
  productsList: [],
  productsListLoading: false,
  totalPages: 0,
  insertLoading: false,
  updateLoading: false,
  deleteLoading: false,
  loadingProductsShortList: false,
  productsShortList: [],
  groupedProductsList: null,
  groupedProductsListLoading: false,
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

    // GET ALL GROUPED
    [fetchProductsGrouped.pending]: (state) => {
      state.groupedProductsListLoading = true;
    },
    [fetchProductsGrouped.fulfilled]: (state, { payload }) => {
      state.groupedProductsListLoading = false;
      if (payload === null || payload === undefined) return;

      state.groupedProductsList = payload;
    },
    [fetchProductsGrouped.rejected]: (state) => {
      state.groupedProductsListLoading = false;
      state.groupedProductsList = null;
    },

    // GET ALL SHORT
    [fetchProductsShort.pending]: (state) => {
      state.loadingProductsShortList = true;
    },
    [fetchProductsShort.fulfilled]: (state, { payload }) => {
      state.loadingProductsShortList = false;
      if (payload === null || payload === undefined) return;

      state.productsShortList = payload;
    },
    [fetchProductsShort.rejected]: (state) => {
      state.loadingProductsShortList = false;
      state.productsShortList = [];
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
export { fetchAllProducts, insertNewProduct, updateProductById, deleteProductById, fetchProductsShort, fetchProductsGrouped };
export default productsStore.reducer;
