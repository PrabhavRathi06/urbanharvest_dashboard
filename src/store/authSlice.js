import { createSlice } from '@reduxjs/toolkit';

// Check if credentials are saved in localStorage
const savedUser = localStorage.getItem('uh_user');
const savedRemember = localStorage.getItem('uh_remember') === 'true';

const initialState = {
  isAuthenticated: !!savedUser,
  user: savedUser ? JSON.parse(savedUser) : null,
  rememberMe: savedRemember,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;

      if (state.rememberMe) {
        localStorage.setItem('uh_user', JSON.stringify(action.payload));
        localStorage.setItem('uh_remember', 'true');
      } else {
        localStorage.removeItem('uh_user');
        localStorage.removeItem('uh_remember');
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('uh_user');
      localStorage.removeItem('uh_remember');
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setRememberMe,
  clearError,
} = authSlice.actions;

// Thunk for simulated API Login
export const loginUser = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (email === 'admin@urbanharvest.com' && password === 'admin123') {
    dispatch(
      loginSuccess({
        email,
        name: 'Prabhav Rathi',
        role: 'Administrator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      })
    );
    return true;
  } else {
    dispatch(loginFailure('Invalid email or password. Use admin@urbanharvest.com / admin123'));
    return false;
  }
};

export default authSlice.reducer;
