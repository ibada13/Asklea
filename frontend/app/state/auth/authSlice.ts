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
      { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    );
    return response.data;
  }
);

export const checkUser = createAsyncThunk('auth/checkUser', async () => {
  const token = getTokenFromLocalStorage();
  if (token) {
    try {
      const response = await axios.get('/auth/check', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch {
      return null;
    }
  }
  return null;
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
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        const role = action.payload?.role?.toLowerCase();
        state.isPatient = role === 'patient';
        state.isDoctor = role === 'doctor';
        state.isAdmin = role === 'admin';
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      .addCase(register.pending, (state) => { state.loading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        const role = action.payload?.role?.toLowerCase();
        state.isPatient = role === 'patient';
        state.isDoctor = role === 'doctor';
        state.isAdmin = role === 'admin';
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      .addCase(getUser.pending, (state) => { state.loading = true; })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        const role = action.payload?.role?.toLowerCase();
        state.isPatient = role === 'patient';
        state.isDoctor = role === 'doctor';
        state.isAdmin = role === 'admin';
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isPatient = false;
        state.isDoctor = false;
        state.isAdmin = false;
      })

      .addCase(checkUser.pending, (state) => { state.loading = true; })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        const role = action.payload?.role?.toLowerCase();
        state.isPatient = role === 'patient';
        state.isDoctor = role === 'doctor';
        state.isAdmin = role === 'admin';
      })
      .addCase(checkUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isPatient = false;
        state.isDoctor = false;
        state.isAdmin = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
