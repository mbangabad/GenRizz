import React from 'react'

// Lightweight toast fallback; replace with your preferred toaster if needed.
export function ToastContainer() {
  return null
}

export function toast(message) {
  // eslint-disable-next-line no-console
  console.info('[toast]', message)
}

