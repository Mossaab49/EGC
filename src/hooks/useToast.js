import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Centralizes transient toast state and cleanup.
 *
 * @param {number} timeout
 * @returns {import('../types/domain.js').ToastContextValue}
 */
export function useToast(timeout = 3600) {
  const [toastState, setToastState] = useState(null)
  const timerRef = useRef(null)

  const toast = useCallback((payload) => {
    setToastState(payload)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setToastState(null), timeout)
  }, [timeout])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  return { toast, toastState }
}
