'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
  }
}

let loadPromise: Promise<void> | null = null

function loadAMapScript(key: string, version: string): Promise<void> {
  if (loadPromise) return loadPromise
  if (typeof window !== 'undefined' && window.AMap) {
    loadPromise = Promise.resolve()
    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    window._AMapSecurityConfig = { securityJsCode: '' }
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=${version}&key=${key}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('AMap load failed'))
    document.head.appendChild(script)
  })

  return loadPromise
}

export function useAMap() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_AMAP_KEY
    const version = process.env.NEXT_PUBLIC_AMAP_VERSION || '2.0'
    if (!key) { setError('No AMap key'); return }

    loadAMapScript(key, version)
      .then(() => setLoaded(true))
      .catch((e) => setError(e.message))
  }, [])

  return { loaded, error }
}
