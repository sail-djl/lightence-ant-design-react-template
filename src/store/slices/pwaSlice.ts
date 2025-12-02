import { createSlice } from '@reduxjs/toolkit';

interface PwaState {
  canPrompt: boolean;
  isPWASupported: boolean;
  isStandalone: boolean;
  event: null;
}

const initialState: PwaState = {
  canPrompt: false,
  isPWASupported: false,
  isStandalone: window.matchMedia('(display-mode: standalone)').matches,
  event: null,
};

export const pwaSlice = createSlice({
  name: 'pwa',
  initialState,
  reducers: {
    markPromptReady: (state) => {
      state.canPrompt = true;
      state.isPWASupported = true;
      state.event = null;
    },
    clearPrompt: (state) => {
      state.canPrompt = false;
      state.event = null;
    },
  },
});

export const { markPromptReady, clearPrompt } = pwaSlice.actions;

export default pwaSlice.reducer;
