'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  limit: number
  totalItems: number
}

export function PaginationControls({
  currentPage,
  totalPages,
  limit,
  totalItems
}: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      router.push(`?${createQueryString('page', (currentPage - 1).toString())}`)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      router.push(`?${createQueryString('page', (currentPage + 1).toString())}`)
    }
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set('limit', newLimit)
    params.set('page', '1') // Reset to page 1
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <span>Show </span>
        <select
          value={limit}
          onChange={handleLimitChange}
          className="border p-1 rounded"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span> entries</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 border text-blue-500 hover:text-blue-600 disabled:opacity-50 flex items-center"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border text-blue-500 hover:text-blue-600 disabled:opacity-50 flex items-center"
        >
          Next
        </button>
      </div>
    </div>
  )
}
