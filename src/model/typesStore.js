import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteType, getAllTypes, insertType, updateType } from '../services/types';

const fetchAllTypes = createAsyncThunk('types/getAll', getAllTypes);
const insertNewType = createAsyncThunk('types/insert', insertType);
const updateTypeById = createAsyncThunk('types/update', updateType);
const deleteTypeById = createAsyncThunk('types/delete', deleteType);

const initialState = {
  typesList: [],
  typesListLoading: false,
  totalPages: 0,
  deleteLoading: false,
  insertLoading: false,
  updateLoading: false,
};

export const typesStore = createSlice({
  name: 'types',
  initialState,
  reducers: {
    // definir funções que nao sejam relacionadas a chamada de api
  },
  extraReducers: {
    // GET ALL
    [fetchAllTypes.pending]: (state) => {
      state.typesListLoading = true;
    },
    [fetchAllTypes.fulfilled]: (state, { payload }) => {
      state.typesListLoading = false;
      if (payload === null || payload === undefined) return;
      state.typesList = payload?.content;
      state.totalPages = payload?.totalPages;
    },
    [fetchAllTypes.rejected]: (state) => {
      state.typesListLoading = false;
      state.typesList = [];
    },

    // INSERT
    [insertNewType.pending]: (state) => {
      state.insertLoading = true;
    },
    [insertNewType.fulfilled]: (state, { payload }) => {
      state.insertLoading = false;
    },
    [insertNewType.rejected]: (state) => {
      state.insertLoading = false;
    },

    // UPDATE
    [updateTypeById.pending]: (state) => {
      state.updateLoading = true;
    },
    [updateTypeById.fulfilled]: (state, { payload }) => {
      state.updateLoading = false;
    },
    [updateTypeById.rejected]: (state) => {
      state.updateLoading = false;
    },

    // DELETE
    [deleteTypeById.pending]: (state) => {
      state.deleteLoading = true;
    },
    [deleteTypeById.fulfilled]: (state, { payload }) => {
      state.deleteLoading = false;
    },
    [deleteTypeById.rejected]: (state) => {
      state.deleteLoading = false;
    },
  }
});

// export const { increment } = products.actions;
export { fetchAllTypes, deleteTypeById, insertNewType, updateTypeById };
export default typesStore.reducer;
