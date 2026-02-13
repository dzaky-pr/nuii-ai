'use client'

import React from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { TableHead } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export type SortDirection = 'asc' | 'desc' | null

interface SortableTableHeadProps {
  children: React.ReactNode
  sortKey: string
  currentSortKey: string | null
  currentSortDirection: SortDirection
  onSort: (key: string) => void
  align?: 'left' | 'center' | 'right'
  className?: string
}

export function SortableTableHead({
  children,
  sortKey,
  currentSortKey,
  currentSortDirection,
  onSort,
  align = 'left',
  className
}: SortableTableHeadProps) {
  const isSorted = currentSortKey === sortKey

  return (
    <TableHead
      className={cn(
        'cursor-pointer select-none',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div
        className={cn(
          'flex items-center gap-2',
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end'
        )}
      >
        {children}
        {isSorted ? (
          currentSortDirection === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-30" />
        )}
      </div>
    </TableHead>
  )
}
