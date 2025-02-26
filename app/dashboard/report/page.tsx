'use client'

import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useGetSurveyHeaderList } from '../survey/_hooks/@read/useGetSurveyHeaderList'

export const tableHeader = [
  '#',
  'Nama Survey',
  'Lokasi',
  'Diperbarui Pada',
  'ID Pengguna',
  'Aksi'
]

export default function ReportPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const { data: surveys, isPending: loadingGetSurveys } =
    useGetSurveyHeaderList()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="mt-4 py-4 px-10">
      <h2 className="text-lg font-bold mb-4">Data Report</h2>
      <div className="mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {tableHeader.map((item, index) => (
                  <th key={index} className="border p-2">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingGetSurveys ? (
                <tr className="text-center">
                  <td colSpan={6} className="py-4 font-medium">
                    Loading...
                  </td>
                </tr>
              ) : !surveys ? (
                <tr className="text-center">
                  <td colSpan={6} className="py-4 font-medium">
                    Data survey tidak tersedia.
                  </td>
                </tr>
              ) : (
                surveys?.map((data, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{data.nama_survey}</td>
                    <td className="border p-2">{data.lokasi}</td>
                    <td className="border p-2">
                      {format(data.updated_at, 'EEEE, d MMMM yyyy HH:mm', {
                        locale: id
                      })}
                    </td>
                    <td className="border p-2">{data.user_id}</td>
                    <td className="border p-2">
                      <Link href={`/dashboard/report/${data.id}`}>
                        <button className="text-green-500">Lihat Detail</button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
