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

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  // Filter client-side berdasarkan nama material
  const filteredList = searchTerm
    ? listAll?.filter(material =>
        material.nama_material.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : listAll

  // Pagination: hitung total items & pages, dan ambil data untuk halaman saat ini
  const totalItems = filteredList ? filteredList.length : 0
  const totalPages = Math.ceil(totalItems / limit)
  const paginatedList = filteredList
    ? filteredList.slice((currentPage - 1) * limit, currentPage * limit)
    : []

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
    <div className="mt-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>ID Tipe Material</TableHead>
              <TableHead>Nomor Material</TableHead>
              <TableHead>Nama Material</TableHead>
              <TableHead>Satuan Material</TableHead>
              <TableHead>Berat Material</TableHead>
              <TableHead>Harga Material</TableHead>
              <TableHead>Pasang RAB</TableHead>
              <TableHead>Bongkar</TableHead>
              <TableHead>Jenis Material</TableHead>
              <TableHead>Kategori Material</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Deleted At</TableHead>
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
