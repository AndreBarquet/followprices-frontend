import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import productsStore from '../model/productsStore';
import currentUserStore from '../model/currentUserStore';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    products: productsStore,
    currentUser: currentUserStore,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});