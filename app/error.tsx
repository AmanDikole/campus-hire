'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white p-4 text-center">
      <div className="rounded-full bg-red-50 p-4 mb-4">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
      <p className="text-gray-500 max-w-md mb-8">
        We encountered an error while loading this page. This might be a network issue or a temporary glitch.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition"
      >
        <RotateCcw size={18} />
        Try Again
      </button>
    </div>
  )
}