import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionId: null,
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
    addSession: (state, action) => {
      state.sessions.unshift(action.payload);
    },
    removeSession: (state, action) => {
      state.sessions = state.sessions.filter(session => session.sessionId !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSession: (state) => {
      state.sessionId = null;
      state.currentSession = null;
    },
  },
});

export const {
  setSessionId,
  setSessions,
  setCurrentSession,
  addSession,
  removeSession,
  setLoading,
  setError,
  clearError,
  resetSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;