'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { formatISOtoGMT7 } from '@/lib/utils/formatIso'
import { useGetAllList } from '../_hooks/@read/useGetAllMaterials'
import { useDeleteMaterialMutation } from '../_hooks/@delete/useDeleteMutation'
import useOverlayStore from '@/lib/hooks/useOverlayStore'

import { Button } from '@/components/ui/button'
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

import DeleteMaterialModal from '../_components/DeleteMaterialModal'
import EditMaterialForm from '../_components/EditMaterialForm'

export function MaterialTable() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('search') ?? ''
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const { listAll, loadingListAll } = useGetAllList()

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [limit, setLimit] = React.useState<number>(10)

  // Delete hook instance
  const deleteMutation = useDeleteMaterialMutation()
  const [materialToDelete, setMaterialToDelete] = React.useState<number | null>(
    null
  )
  const modalId = 'delete-material-modal'
  const { open, close } = useOverlayStore()

  // Sorting State
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Filter client-side berdasarkan nama material
  const filteredList = React.useMemo(() => {
    return searchTerm
      ? listAll?.filter(material =>
          material.nama_material
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : listAll
  }, [searchTerm, listAll])

  // Sorting Logic
  const sortedList = React.useMemo(() => {
    if (!filteredList) return []
    if (!sortKey || !sortDirection) return filteredList

    return [...filteredList].sort((a, b) => {
      const aValue = (a as any)[sortKey]
      const bValue = (b as any)[sortKey]

      if (aValue === bValue) return 0

      const comparison = aValue > bValue ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredList, sortKey, sortDirection])

  if (!isMounted) return null

  // Pagination: hitung total items & pages, dan ambil data untuk halaman saat ini
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

  const handleDeleteClick = (materialId: number) => {
    setMaterialToDelete(materialId)
    open(modalId)
  }

  const handleDeleteSubmit = () => {
    if (materialToDelete !== null) {
      deleteMutation.mutate(materialToDelete, {
        onSuccess: () => {
          close(modalId)
          setMaterialToDelete(null)
        },
        onError: () => {
          close(modalId)
          setMaterialToDelete(null)
        }
      })
    }
  }

  const handleDeleteCancel = () => {
    close(modalId)
    setMaterialToDelete(null)
  }

  // Pagination control functions
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
      {/* Search Filter */}
      <div className="flex justify-start w-full">
        <TableFilter placeholder="Search by material name..." />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <SortableTableHead
                sortKey="id_tipe_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                ID Tipe Material
              </SortableTableHead>
              <SortableTableHead
                sortKey="nomor_material"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Nomor Material
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
              <SortableTableHead
                sortKey="created_at"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Created At
              </SortableTableHead>
              <SortableTableHead
                sortKey="updated_at"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Updated At
              </SortableTableHead>
              <SortableTableHead
                sortKey="deleted_at"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              >
                Deleted At
              </SortableTableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingListAll ? (
              <TableRow>
                <TableCell colSpan={15} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : totalItems === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="h-24 text-center">
                  Data tidak tersedia.
                </TableCell>
              </TableRow>
            ) : (
              paginatedList.map((material, index) => (
                <TableRow key={material.id}>
                  <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                  <TableCell>{material.id_tipe_material}</TableCell>
                  <TableCell>{material.nomor_material}</TableCell>
                  <TableCell>{material.nama_material}</TableCell>
                  <TableCell>{material.satuan_material}</TableCell>
                  <TableCell>{material.berat_material}</TableCell>
                  <TableCell>{material.harga_material}</TableCell>
                  <TableCell>{material.pasang_rab}</TableCell>
                  <TableCell>{material.bongkar}</TableCell>
                  <TableCell>{material.jenis_material}</TableCell>
                  <TableCell>{material.kategori_material}</TableCell>
                  <TableCell>
                    {material.created_at
                      ? formatISOtoGMT7(material.created_at)
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {material.updated_at
                      ? formatISOtoGMT7(material.updated_at)
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {material.deleted_at
                      ? formatISOtoGMT7(material.deleted_at)
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center space-x-3">
                      <EditMaterialForm material={material} />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(material.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
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
      <DeleteMaterialModal
        modalId={modalId}
        onSubmit={handleDeleteSubmit}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}
