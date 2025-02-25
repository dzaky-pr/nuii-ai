'use client'

import { Button } from '@/components/ui/button'
import { baseURL } from '@/lib/tools/api'
import { useAuth } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function DetailReportPage({ reportId }: { reportId: string }) {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false)

  const { getToken } = useAuth()

  const handleDownloadReport = async () => {
    setIsDownloadLoading(true)

    try {
      const token = await getToken()

      const response = await fetch(
        `${baseURL}/survey/export/excel/${reportId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        }
      )

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
        }-${date.getFullYear()}_REPORT-SURVEY-${reportId}.xlsx`
      )

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Gagal mengunduh: ', error.message)
        toast.error(`Gagal mengunduh file report. Silakan coba lagi!`)
      }
    } finally {
      toast.success('Berhasil mengunduh file report!')
      setIsDownloadLoading(false)
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  //   if (isPending) {
  //     return (
  //       <div className="grid place-items-center min-h-screen">
  //         <h2 className="font-semibold">Loading...</h2>
  //       </div>
  //     )
  //   }

  //   if (!report) {
  //     return (
  //       <div className="grid place-items-center min-h-screen">
  //         <h2 className="font-semibold">Data laporan survey tidak tersedia.</h2>
  //       </div>
  //     )
  //   }

  return (
    <>
      <div className="py-4 px-10 flex flex-col gap-8 mt-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Button asChild size="icon" variant="outline">
              <Link href="/dashboard/report">
                <ArrowLeft size={16} />
              </Link>
            </Button>
            <h3 className="font-semibold">Report {reportId}</h3>
          </div>
          <div className="flex gap-4 items-center">
            <Button size="sm" variant="outline" onClick={handleDownloadReport}>
              {isDownloadLoading ? 'Downloading...' : 'Download Report'}
            </Button>
          </div>
        </div>
        {/* <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {primaryHeader.map((item, index) => (
                    <th
                      key={index}
                      rowSpan={item.row}
                      colSpan={item.col}
                      className="border p-2"
                    >
                      {item.name}
                    </th>
                  ))}
                </tr>
                <tr>
                  {[1, 2, 3].map(iteration =>
                    secondaryHeader.map((item, index) => (
                      <th key={`${iteration}-${index}`} className="border p-2">
                        {item}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
            </table>
          </div> */}
      </div>
    </>
  )
}
