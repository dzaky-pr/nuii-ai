'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface TableFilterProps {
  placeholder?: string
  paramName?: string
  debounceTime?: number
  className?: string
}

export function TableFilter({
  placeholder = 'Search...',
  paramName = 'search',
  debounceTime = 500,
  className = ''
}: TableFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialValue = searchParams.get(paramName) ?? ''

  const [searchValue, setSearchValue] = useState(initialValue)

  // Sync state from URL (if changed externally)
  useEffect(() => {
    const currentParam = searchParams.get(paramName) ?? ''
    if (currentParam !== searchValue) {
      setSearchValue(currentParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, paramName])

  // Debounced URL update
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentParams = new URLSearchParams(searchParams.toString())
      const currentParamValue = currentParams.get(paramName) ?? ''

      if (currentParamValue === searchValue) return

      if (searchValue) {
        currentParams.set(paramName, searchValue)
      } else {
        currentParams.delete(paramName)
      }

      router.push(`?${currentParams.toString()}`)
    }, debounceTime)

    return () => clearTimeout(handler)
  }, [searchValue, debounceTime, router, searchParams, paramName])

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        className="pl-8 w-full sm:w-[300px]"
      />
    </div>
  )
}
