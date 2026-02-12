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
import { cn } from '@/lib/utils'

export function LogTable() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('search') ?? ''
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const { listAll, loadingListAll } = useGetLog()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [limit, setLimit] = React.useState<number>(10)

  // Filter client-side berdasarkan nama material
  const filteredList = searchTerm
    ? listAll?.filter(material =>
        material.nama_material.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : listAll

  // Reverse urutan: terbaru (di akhir array) muncul paling atas
  const sortedList = filteredList
    ? filteredList.slice().reverse()
    : filteredList

  // Pagination processing
  const totalItems = sortedList ? sortedList.length : 0
  const totalPages = Math.ceil(totalItems / limit)
  const paginatedList = sortedList
    ? sortedList.slice((currentPage - 1) * limit, currentPage * limit)
    : []

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
    <div className="mt-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Tipe Log</TableHead>
              <TableHead>ID Material</TableHead>
              <TableHead>ID Tipe Material</TableHead>
              <TableHead>Nama Material</TableHead>
              <TableHead>Satuan Material</TableHead>
              <TableHead>Berat Material</TableHead>
              <TableHead>Harga Material</TableHead>
              <TableHead>Pasang RAB</TableHead>
              <TableHead>Bongkar</TableHead>
              <TableHead>Jenis Material</TableHead>
              <TableHead>Kategori Material</TableHead>
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
