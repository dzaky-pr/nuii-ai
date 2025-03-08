'use client'

import React from 'react'
import { useGetAllList } from '../_hooks/@read/useGetAllMaterials'

export function MaterialTable() {
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const { listAll, loadingListAll } = useGetAllList()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border-collapse border">
        <thead>
          <tr className="">
            <th className="border p-2">No.</th>
            <th className="border p-2">Nama Material</th>
            <th className="border p-2">Satuan</th>
            <th className="border p-2">Berat</th>
            <th className="border p-2">Harga</th>
            <th className="border p-2">Jenis</th>
            <th className="border p-2">Kategori</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loadingListAll ? (
            <tr className="text-center">
              <td colSpan={8} className="py-4 font-medium">
                Loading...
              </td>
            </tr>
          ) : listAll?.length === 0 ? (
            <tr className="text-center">
              <td colSpan={8} className="py-4 font-medium">
                Data tidak tersedia.
              </td>
            </tr>
          ) : (
            listAll?.map((material, index) => (
              <tr key={material.id} className="text-center border-t">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{material.nama_material}</td>
                <td className="border p-2">{material.satuan_material}</td>
                <td className="border p-2">{material.berat_material}</td>
                <td className="border p-2">{material.harga_material}</td>
                <td className="border p-2">{material.jenis_material}</td>
                <td className="border p-2">{material.kategori_material}</td>
                <td className="border p-2">
                  <button className="text-blue-500 hover:underline mr-2">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
