import { configureStore } from '@reduxjs/toolkit';
import appSlice from './slices/appSlice';

const store = configureStore({
  reducer: {
    appSlice
  }
})

export default store;