'use client'

import { formatISOtoGMT7 } from '@/lib/utils/formatIso'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { useGetLog } from '../_hooks/@read/useGetLog'

export function LogTable() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('search') ?? ''
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const { listAll, loadingListAll } = useGetLog()

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

  // Reverse urutan: terbaru (di akhir array) muncul paling atas
  const sortedList = filteredList
    ? filteredList.slice().reverse()
    : filteredList

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Waktu</th>
            <th className="border p-2">Tipe Log</th>
            <th className="border p-2">ID Material</th>
            <th className="border p-2">ID Tipe Material</th>
            <th className="border p-2">Nama Material</th>
            <th className="border p-2">Satuan Material</th>
            <th className="border p-2">Berat Material</th>
            <th className="border p-2">Harga Material</th>
            <th className="border p-2">Pasang RAB</th>
            <th className="border p-2">Bongkar</th>
            <th className="border p-2">Jenis Material</th>
            <th className="border p-2">Kategori Material</th>
          </tr>
        </thead>
        <tbody>
          {loadingListAll ? (
            <tr className="text-center">
              <td colSpan={16} className="py-4 font-medium">
                Loading...
              </td>
            </tr>
          ) : sortedList?.length === 0 ? (
            <tr className="text-center">
              <td colSpan={16} className="py-4 font-medium">
                Data tidak tersedia.
              </td>
            </tr>
          ) : (
            sortedList?.map(material => (
              <tr key={material.id} className="text-center border-t">
                <td className="border p-2">
                  {' '}
                  {material.updated_at
                    ? formatISOtoGMT7(material.updated_at)
                    : '-'}
                </td>
                <td
                  className={`border p-2 font-bold ${
                    material.tipe_log === 'Create'
                      ? 'text-green-500'
                      : material.tipe_log === 'Delete'
                      ? 'text-red-500'
                      : 'text-blue-500'
                  }`}
                >
                  <pre>{material.tipe_log}</pre>
                </td>
                <td className="border p-2">{material.id_material}</td>
                <td className="border p-2">{material.id_tipe_material}</td>
                <td className="border p-2">{material.nama_material}</td>
                <td className="border p-2">{material.satuan_material}</td>
                <td className="border p-2">{material.berat_material}</td>
                <td className="border p-2">{material.harga_material}</td>
                <td className="border p-2">{material.pasang_rab}</td>
                <td className="border p-2">{material.bongkar}</td>
                <td className="border p-2">{material.jenis_material}</td>
                <td className="border p-2">{material.kategori_material}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
