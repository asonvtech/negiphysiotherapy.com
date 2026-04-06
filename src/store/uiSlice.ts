import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  compact: boolean;
}

const initialState: UiState = {
  compact: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCompactMode: (state) => {
      state.compact = !state.compact;
    },
  },
});

export const { toggleCompactMode } = uiSlice.actions;
export default uiSlice.reducer;
