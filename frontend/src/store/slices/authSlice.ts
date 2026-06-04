import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import api from "@/lib/axios"
import type { User } from "@/types"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post("/auth/login", { email, password })
      localStorage.setItem("token", data.data.accessToken)
      if (data.data.refreshToken) {
        localStorage.setItem("refreshToken", data.data.refreshToken)
      }
      return {
        user: data.data.user,
        token: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } }
        }
        return rejectWithValue(
          axiosError.response?.data?.message || "Login failed"
        )
      }
      return rejectWithValue("Login failed")
    }
  }
)

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      })
      localStorage.setItem("token", data.data.accessToken)
      return {
        user: data.data.user,
        token: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } }
        }
        return rejectWithValue(
          axiosError.response?.data?.message || "Registration failed"
        )
      }
      return rejectWithValue("Registration failed")
    }
  }
)

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/profile")
      return data.data.user
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } }
        }
        return rejectWithValue(
          axiosError.response?.data?.message || "Failed to fetch profile"
        )
      }
      return rejectWithValue("Failed to fetch profile")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    updateToken(state, action: PayloadAction<string>) {
      state.token = action.payload
      localStorage.setItem("token", action.payload)
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.token = null
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
      })
  },
})

export const { loginSuccess, logout, setUser, updateToken, clearError } =
  authSlice.actions
export default authSlice.reducer
