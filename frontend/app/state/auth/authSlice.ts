import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/app/lib/axios';

const getTokenFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await axios.post('/auth/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }: { username: string; email: string; password: string }) => {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      '/auth/register',
      { username, email, password },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );

    return response.data;
  }
);

export const checkUser = createAsyncThunk('auth/checkUser', async () => {
  const token = getTokenFromLocalStorage();
  if (token) {
    try {
      await axios.get('/auth/check', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
});

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const token = getTokenFromLocalStorage();
  if (token) {
    const response = await axios.get('/auth/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
  return null;
});

interface AuthState {
  isPatient: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
  user: any | null;
  loading: boolean;
}

const initialState: AuthState = {
  isPatient: false,
  isDoctor: false,
  isAdmin: false,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      state.user = null;
      state.isPatient = false;
      state.isDoctor = false;
      state.isAdmin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {})
      .addCase(register.fulfilled, (state) => {})
      .addCase(checkUser.fulfilled, (state, action) => {})
      .addCase(checkUser.rejected, (state) => {
        state.isPatient = false;
        state.isDoctor = false;
        state.isAdmin = false;
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;

        const role = action.payload?.role;

        state.isPatient = role === 'patient';
        state.isDoctor = role === 'doctor';
        state.isAdmin = role === 'admin';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
