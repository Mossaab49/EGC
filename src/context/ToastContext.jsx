import React, { createContext, useContext } from 'react'
import { useToast } from '../hooks/useToast.js'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const toastApi = useToast()

  return <ToastContext.Provider value={toastApi}>{children}</ToastContext.Provider>
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used inside ToastProvider')
  }
  return context
}
