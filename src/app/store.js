import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import productsStore from '../model/productsStore';
import currentUserStore from '../model/currentUserStore';
import typesStore from '../model/typesStore';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    products: productsStore,
    currentUser: currentUserStore,
    types: typesStore,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});