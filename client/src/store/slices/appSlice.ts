import { createSlice } from '@reduxjs/toolkit';

interface appType {
  ip: string;
}

const initialState: appType = {
  ip: '',
}

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setIP(state, {payload}) {
      state.ip = payload;
    }
  }
});
export default appSlice.reducer;
export const appState = (state: any) => state.appSlice;
export const {setIP} = appSlice.actions; 