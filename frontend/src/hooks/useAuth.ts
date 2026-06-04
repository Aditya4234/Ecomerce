"use client"

import { useCallback, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import {
  loginUser,
  registerUser,
  fetchProfile,
  logout as logoutAction,
} from "@/store/slices/authSlice"

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  )

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile())
    }
  }, [token, user, dispatch])

  const login = useCallback(
    (email: string, password: string) => {
      return dispatch(loginUser({ email, password })).unwrap()
    },
    [dispatch]
  )

  const register = useCallback(
    (name: string, email: string, password: string) => {
      return dispatch(registerUser({ name, email, password })).unwrap()
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(logoutAction())
  }, [dispatch])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  }
}
