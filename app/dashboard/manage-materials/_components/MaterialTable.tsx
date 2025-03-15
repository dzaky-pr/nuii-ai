'use client'

import { Button } from '@/components/ui/button'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { formatISOtoGMT7 } from '@/lib/utils/formatIso'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import DeleteMaterialModal from '../_components/DeleteMaterialModal'
import EditMaterialForm from '../_components/EditMaterialForm'

import { useDeleteMaterialMutation } from '../_hooks/@delete/useDeleteMutation'
import { useGetAllList } from '../_hooks/@read/useGetAllMaterials'

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
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">No.</th>
            <th className="border p-2">ID Tipe Material</th>
            <th className="border p-2">Nomor Material</th>
            <th className="border p-2">Nama Material</th>
            <th className="border p-2">Satuan Material</th>
            <th className="border p-2">Berat Material</th>
            <th className="border p-2">Harga Material</th>
            <th className="border p-2">Pasang RAB</th>
            <th className="border p-2">Bongkar</th>
            <th className="border p-2">Jenis Material</th>
            <th className="border p-2">Kategori Material</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Updated At</th>
            <th className="border p-2">Deleted At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loadingListAll ? (
            <tr className="text-center">
              <td colSpan={16} className="py-4 font-medium">
                Loading...
              </td>
            </tr>
          ) : totalItems === 0 ? (
            <tr className="text-center">
              <td colSpan={16} className="py-4 font-medium">
                Data tidak tersedia.
              </td>
            </tr>
          ) : (
            paginatedList.map((material, index) => (
              <tr key={material.id} className="text-center border-t">
                <td className="border p-2">
                  {(currentPage - 1) * limit + index + 1}
                </td>
                <td className="border p-2">{material.id_tipe_material}</td>
                <td className="border p-2">{material.nomor_material}</td>
                <td className="border p-2">{material.nama_material}</td>
                <td className="border p-2">{material.satuan_material}</td>
                <td className="border p-2">{material.berat_material}</td>
                <td className="border p-2">{material.harga_material}</td>
                <td className="border p-2">{material.pasang_rab}</td>
                <td className="border p-2">{material.bongkar}</td>
                <td className="border p-2">{material.jenis_material}</td>
                <td className="border p-2">{material.kategori_material}</td>
                <td className="border p-2">
                  {material.created_at
                    ? formatISOtoGMT7(material.created_at)
                    : '-'}
                </td>
                <td className="border p-2">
                  {material.updated_at
                    ? formatISOtoGMT7(material.updated_at)
                    : '-'}
                </td>
                <td className="border p-2">
                  {material.deleted_at
                    ? formatISOtoGMT7(material.deleted_at)
                    : '-'}
                </td>
                <td className="border p-2 flex justify-center items-center space-x-3">
                  <EditMaterialForm material={material} />
                  <Button
                    className="bg-red-500 hover:bg-red-600 hover:underline"
                    onClick={() => handleDeleteClick(material.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
