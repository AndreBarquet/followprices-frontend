import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteType, getAllTypes } from '../services/types';

const fetchAllTypes = createAsyncThunk('types/getAll', getAllTypes);
const deleteTypeById = createAsyncThunk('types/delete', deleteType);

const initialState = {
  typesList: [],
  typesListLoading: false,
  totalPages: 0,
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
  }
});

// export const { increment } = products.actions;
export { fetchAllTypes, deleteTypeById };
export default typesStore.reducer;
