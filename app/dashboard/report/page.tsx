'use client'

import { Button } from '@/components/ui/button'
import { baseURL } from '@/lib/tools/api'
import { useAuth } from '@clerk/nextjs'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useGetSurveyReportList } from './_hooks/useGetSurveyReportList'

const tableHeader = [
  '#',
  'Nama Survey',
  'Lokasi',
  'Diperbarui Pada',
  'ID Pengguna',
  'Aksi'
]

export default function ReportPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isDownloadLoading, setIsDownloadLoading] = useState<string | null>(
    null
  )

  const { getToken } = useAuth()

  const { data: surveys, isPending: loadingGetSurveys } =
    useGetSurveyReportList()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleDownloadReport = async (id: string, nama_survey: string) => {
    setIsDownloadLoading(id) // <- set id survey yg lagi loading
    try {
      const token = await getToken()

      const response = await fetch(`${baseURL}/survey/export/excel/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      })

      if (!response.ok) {
        throw new Error(`Gagal mengunduh file report: ${response.statusText}`)
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const date = new Date()
      const a = document.createElement('a')
      a.href = blobUrl
      a.setAttribute(
        'download',
        `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}_REPORT-SURVEY-${nama_survey}-${id}.xlsx`
      )

      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Gagal mengunduh: ', error.message)
        toast.error(`Gagal mengunduh file report. Silakan coba lagi!`)
      }
    } finally {
      toast.success('Berhasil mengunduh file report!')
      setIsDownloadLoading(null) // <- reset loading
    }
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
                      {format(data.updated_at, 'EEEE, d MMM yyyy HH:mm', {
                        locale: id
                      })}{' '}
                      WIB
                    </td>
                    <td className="border p-2">{data.user_id}</td>
                    <td className="border p-2">
                      {/* <Link href={`/dashboard/report/${data.id}`}>
                        <button
                          className="text-green-500 disabled:text-neutral-500"
                          disabled={data.status_survey === 'Belum_Disetujui'}
                        >
                          Lihat Detail
                        </button>
                      </Link> */}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isDownloadLoading !== null}
                        onClick={() =>
                          handleDownloadReport(
                            data.id.toString(),
                            data.nama_survey
                          )
                        }
                      >
                        {isDownloadLoading === data.id.toString()
                          ? 'Downloading...'
                          : 'Download Report'}
                      </Button>
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
