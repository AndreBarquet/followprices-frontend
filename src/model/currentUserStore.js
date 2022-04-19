import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login } from '../services/login';

const userLogin = createAsyncThunk('currentUser/login', login);

const initialState = {
  loginLoading: false,
  currentUser: null,
};

export const currentUserStore = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentuser: (state, { payload }) => {
      state.currentUser = payload;
    }
  },
  extraReducers: {
    // GET ALL
    [userLogin.pending]: (state) => {
      state.loginLoading = true;
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.loginLoading = false;
      if (payload === null || payload === undefined) return;
    },
    [userLogin.rejected]: (state) => {
      state.loginLoading = false;
    },
  }
});

const { setCurrentuser } = currentUserStore.actions;

export { userLogin, setCurrentuser };
export default currentUserStore.reducer;
