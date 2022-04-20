import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import productsStore from '../model/productsStore';
import currentUserStore from '../model/currentUserStore';
import typesStore from '../model/typesStore';
import pricesStore from '../model/pricesStore';
import setupsStore from '../model/setupsStore';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    products: productsStore,
    currentUser: currentUserStore,
    types: typesStore,
    prices: pricesStore,
    setups: setupsStore,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});