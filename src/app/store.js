import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import productsStore from '../model/productsStore';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    products: productsStore,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});