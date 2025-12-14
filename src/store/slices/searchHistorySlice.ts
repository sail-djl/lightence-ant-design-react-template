import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SearchHistoryState = {
  pages: Record<string, Record<string, string[]>>;
};

const STORAGE_KEY = 'search_history_v1';
const MAX_ITEMS = 3;

const loadFromStorage = (): SearchHistoryState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (_error) {}
  return { pages: {} };
};

const searchHistorySlice = createSlice({
  name: 'searchHistory',
  initialState: loadFromStorage(),
  reducers: {
    addEntry: (state, action: PayloadAction<{ page: string; field: string; value: string }>) => {
      const { page, field, value } = action.payload;
      if (!value) return;
      if (!state.pages[page]) state.pages[page] = {};
      const current = state.pages[page][field] || [];
      const filtered = current.filter((v) => v !== value);
      filtered.unshift(value);
      state.pages[page][field] = filtered.slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (_error) {}
    },
    clearField: (state, action: PayloadAction<{ page: string; field: string }>) => {
      const { page, field } = action.payload;
      if (!state.pages[page]) state.pages[page] = {};
      state.pages[page][field] = [];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (_error) {}
    },
    clearPage: (state, action: PayloadAction<{ page: string }>) => {
      const { page } = action.payload;
      state.pages[page] = {};
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (_error) {}
    },
  },
});

export const { addEntry, clearField, clearPage } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;

