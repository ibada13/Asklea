import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/app/lib/axios';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const res = await axios.post('/auth/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.access_token);
      }

      return res.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || err?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);


export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }: { username: string; email: string; password: string }) => {
    const token = getToken();

    const res = await axios.post(
      '/auth/register',
      { username, email, password },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  }
);

export const checkUser = createAsyncThunk('auth/checkUser', async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await axios.get('/auth/check', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch {
    return null;
  }
});

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const token = getToken();
  if (!token) return null;

  const res = await axios.get('/auth/', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await axios.post('/auth/refresh', null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (typeof window !== 'undefined' && res.data.access_token) {
      localStorage.setItem('token', res.data.access_token);
    }

    return res.data;
  } catch {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return null;
  }
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
    logout: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      state.user = null;
      state.isAdmin = false;
      state.isDoctor = false;
      state.isPatient = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    const handleRole = (state: AuthState, role?: string) => {
      const r = role?.toLowerCase();
      state.isPatient = r === 'patient';
      state.isDoctor = r === 'doctor';
      state.isAdmin = r === 'admin';
    };

    builder
      // Login
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        handleRole(state, action.payload?.role);
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // Register
      .addCase(register.pending, (state) => { state.loading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        handleRole(state, action.payload?.role);
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // Check User
      .addCase(checkUser.pending, (state) => { state.loading = true; })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        handleRole(state, action.payload?.role);
      })
      .addCase(checkUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // Get User
      .addCase(getUser.pending, (state) => { state.loading = true; })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        handleRole(state, action.payload?.role);
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => { state.loading = true; })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user || state.user;
          handleRole(state, action.payload?.user?.role || state.user?.role);
        } else {
          state.user = null;
          state.isAdmin = false;
          state.isDoctor = false;
          state.isPatient = false;
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAdmin = false;
        state.isDoctor = false;
        state.isPatient = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
