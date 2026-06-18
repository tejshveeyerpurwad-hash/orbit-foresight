import { useState, useCallback, useRef } from 'react'

const API = import.meta.env.PROD ? '/api' : 'http://localhost:8000'

const PRESETS = [
  'Add payment retry support',
  'Implement OAuth 2.0 SSO',
  'Add full-text search',
  'Refactor billing module',
]

export function useAnalysis() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const ctrl = useRef(null)

  const analyze = useCallback(async (description) => {
    if (ctrl.current) ctrl.current.abort()
    const controller = new AbortController()
    ctrl.current = controller

    setLoading(true)
    setError(null)
    setData(null)

    const timer = setTimeout(() => controller.abort(), 20000)

    try {
      const res = await fetch(`${API}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const json = await res.json()
      await new Promise((r) => setTimeout(r, 600))
      setData(json)
    } catch (e) {
      if (e.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError(e.message || 'Something went wrong.')
      }
    } finally {
      setLoading(false)
      ctrl.current = null
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, analyze, reset, presets: PRESETS }
}
