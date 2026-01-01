'use client'

import { Search } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
8 // Optional, but let's use standard timeout for simplicity

export function JobSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  // Simple debounce logic to avoid refreshing on every single keystroke immediately
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    
    // Updates URL without reloading page
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative w-full md:w-96 group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search by role or company..."
        className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm shadow-sm"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString()}
      />
    </div>
  )
}