'use client'

import { formatISOtoGMT7 } from '@/lib/utils/formatIso'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { useGetLog } from '../_hooks/@read/useGetLog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TableFilter } from '@/components/shared/TableFilter'
import {
  SortableTableHead,
  SortDirection
} from '@/components/shared/SortableTableHead'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export function LogTable() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('search') ?? ''
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const { listAll, loadingListAll } = useGetLog()

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [limit, setLimit] = React.useState<number>(10)

  // Sorting State
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Filter client-side
  const filteredList = React.useMemo(() => {
    if (!listAll) return []

    return listAll.filter(item => {
      // Search Filter
      const matchesSearch = searchTerm
        ? item.nama_material.toLowerCase().includes(searchTerm.toLowerCase())
        : true

      // Status Filter
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : item.tipe_log.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [listAll, searchTerm, statusFilter])

  // Sorting Logic
  const sortedList = React.useMemo(() => {
    if (!filteredList) return []
    if (!sortKey || !sortDirection) return filteredList

    return [...filteredList].sort((a, b) => {
      const aValue = (a as any)[sortKey]
      const bValue = (b as any)[sortKey]

      // Handle nested properties (simple version)
      if (sortKey === 'nama_material' && a.nama_material && b.nama_material) {
        return sortDirection === 'asc'
          ? a.nama_material.localeCompare(b.nama_material)
          : b.nama_material.localeCompare(a.nama_material)
      }

      if (aValue === bValue) return 0

      const comparison = aValue > bValue ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredList, sortKey, sortDirection])

  if (!isMounted) return null

  // Pagination processing
  const totalItems = sortedList.length
  const totalPages = Math.ceil(totalItems / limit)
  const paginatedList = sortedList.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  )

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value)
    setLimit(newLimit)
    setCurrentPage(1)
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
        <TableFilter
          placeholder="Filter log by material or user..."
          className="w-full sm:w-auto"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium">Type:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                sortKey="updated_at"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Waktu
              </SortableTableHead>
              <SortableTableHead
                sortKey="tipe_log"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Tipe Log
              </SortableTableHead>
              <SortableTableHead
                sortKey="id_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                ID Material
              </SortableTableHead>
              <SortableTableHead
                sortKey="id_tipe_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                ID Tipe Material
              </SortableTableHead>
              <SortableTableHead
                sortKey="nama_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Nama Material
              </SortableTableHead>
              <SortableTableHead
                sortKey="satuan_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Satuan Material
              </SortableTableHead>
              <SortableTableHead
                sortKey="berat_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Berat Material
              </SortableTableHead>
              <SortableTableHead
                sortKey="harga_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Harga Material
              </SortableTableHead>
              <SortableTableHead
                sortKey="pasang_rab"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Pasang RAB
              </SortableTableHead>
              <SortableTableHead
                sortKey="bongkar"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Bongkar
              </SortableTableHead>
              <SortableTableHead
                sortKey="jenis_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Jenis Material
              </SortableTableHead>
              <SortableTableHead
                sortKey="kategori_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Kategori Material
              </SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingListAll ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : totalItems === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  Data tidak tersedia.
                </TableCell>
              </TableRow>
            ) : (
              paginatedList.map(material => (
                <TableRow key={material.id}>
                  <TableCell>
                    {material.updated_at
                      ? formatISOtoGMT7(material.updated_at)
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'font-bold',
                        material.tipe_log === 'Create'
                          ? 'text-green-500'
                          : material.tipe_log === 'Delete'
                            ? 'text-red-500'
                            : 'text-blue-500'
                      )}
                    >
                      <pre className="font-sans">{material.tipe_log}</pre>
                    </span>
                  </TableCell>
                  <TableCell>{material.id_material}</TableCell>
                  <TableCell>{material.id_tipe_material}</TableCell>
                  <TableCell>{material.nama_material}</TableCell>
                  <TableCell>{material.satuan_material}</TableCell>
                  <TableCell>{material.berat_material}</TableCell>
                  <TableCell>{material.harga_material}</TableCell>
                  <TableCell>{material.pasang_rab}</TableCell>
                  <TableCell>{material.bongkar}</TableCell>
                  <TableCell>{material.jenis_material}</TableCell>
                  <TableCell>{material.kategori_material}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
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
            className="px-3 py-1 border text-blue-500 hover:text-blue-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border text-blue-500 hover:text-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
