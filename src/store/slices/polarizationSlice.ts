import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PolarizationState {
  selectedFund1: string | null; // 基准基金代码
  selectedFund2: string | null; // 对比基金代码
}

const STORAGE_KEY = 'polarization_selected_funds';

// 从 localStorage 读取上次选中的基金
const loadFromStorage = (): PolarizationState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load polarization state from localStorage:', error);
  }
  return {
    selectedFund1: null,
    selectedFund2: null,
  };
};

const initialState: PolarizationState = loadFromStorage();

export const polarizationSlice = createSlice({
  name: 'polarization',
  initialState,
  reducers: {
    setSelectedFund1: (state, action: PayloadAction<string>) => {
      state.selectedFund1 = action.payload;
      // 保存到 localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save polarization state to localStorage:', error);
      }
    },
    setSelectedFund2: (state, action: PayloadAction<string>) => {
      state.selectedFund2 = action.payload;
      // 保存到 localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save polarization state to localStorage:', error);
      }
    },
    setSelectedFunds: (state, action: PayloadAction<{ fund1: string; fund2: string }>) => {
      state.selectedFund1 = action.payload.fund1;
      state.selectedFund2 = action.payload.fund2;
      // 保存到 localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save polarization state to localStorage:', error);
      }
    },
  },
});

export const { setSelectedFund1, setSelectedFund2, setSelectedFunds } = polarizationSlice.actions;

export default polarizationSlice.reducer;



