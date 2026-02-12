'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { surveyStatus } from '@/lib/constants'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { ISurveyHeader } from '@/lib/types/survey'
import { NotebookPen, Route } from 'lucide-react'
import Link from 'next/link'
import { CreateSurveyHeaderForm } from './_components/header/CreateSurveyHeaderForm'
import { UpdateSurveyHeaderForm } from './_components/header/UpdateSurveyHeaderForm'
import { useGetSurveyHeaderList } from './_hooks/@read/survey-headers'
import { useDeleteSurveyHeaderMutation } from './_hooks/@create/survey-header'

const tableHeaders = [
  'No.',
  'Nama Survey',
  'Lokasi',
  'Tipe',
  'Status',
  'ID Pengguna',
  'Dibuat Pada',
  'Aksi'
]

export default function Page() {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState<ISurveyHeader | null>(
    null
  )

  const { data: surveys, isPending: loadingGetSurveys } =
    useGetSurveyHeaderList()

  const { mutate: deleteSurvey } = useDeleteSurveyHeaderMutation()

  const { open } = useOverlayStore()

  const handleDeleteSurvey = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus survey ini?')) {
      deleteSurvey(id)
    }
  }

  const openUpdateForm = (survey: ISurveyHeader) => {
    setSelectedSurvey(survey)
    open('update-survey-header-sheets')
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div className="py-4 px-6">
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between w-full items-center mb-4 sm:flex-row flex-col gap-4">
            <h2 className="text-lg font-bold">Data Survey</h2>
            <div className="flex gap-4 items-center sm:flex-row flex-col w-full sm:w-fit">
              <Button
                size="sm"
                className="bg-green-500 text-white hover:bg-green-600 max-sm:w-full"
                onClick={() => open('create-survey-header-sheets')}
              >
                <NotebookPen className="size-4 text-white mr-2 mb-0.5" />
                Buat Survey Baru
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white max-sm:w-full"
              >
                <Link href="/dashboard/survey/maps">
                  <Route className="size-4 text-white mr-2 mb-0.5" /> Rute &
                  Estimasi
                </Link>
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    {tableHeaders.map((item, index) => (
                      <th key={index} className="border p-2">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loadingGetSurveys ? (
                    <tr className="text-center">
                      <td colSpan={8} className="py-4 font-medium">
                        Loading...
                      </td>
                    </tr>
                  ) : !surveys || !surveys.length ? (
                    <tr className="text-center">
                      <td colSpan={8} className="py-4 font-medium">
                        Data survey tidak tersedia.
                      </td>
                    </tr>
                  ) : (
                    surveys?.map((data, index) => {
                      const isBatchSurvey = data.SurveySequance?.some(
                        seq => seq.tipe === 'SUTM'
                      )
                      return (
                        <tr key={index} className="text-center">
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">{data.nama_survey}</td>
                          <td className="border p-2">{data.lokasi}</td>
                          <td className="border p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${isBatchSurvey ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              {isBatchSurvey ? 'Batch' : 'Manual'}
                            </span>
                          </td>
                          <td className="border p-2 ">
                            {surveyStatus[data.status_survey]}
                          </td>
                          <td className="border p-2">{data.user_id}</td>
                          <td className="border p-2">
                            <div className="flex flex-col">
                              <span>
                                {new Date(data.created_at).toLocaleDateString(
                                  'id-ID',
                                  {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  }
                                )}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {new Date(data.created_at).toLocaleTimeString(
                                  'id-ID',
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false,
                                    timeZone: 'Asia/Jakarta'
                                  }
                                )}{' '}
                                WIB
                              </span>
                            </div>
                          </td>
                          <td className="border p-2">
                            <div className="flex gap-2 justify-center">
                              <Link
                                href={
                                  isBatchSurvey
                                    ? `/dashboard/survey/auto-survey/${data.id}`
                                    : `/dashboard/survey/${data.id}`
                                }
                              >
                                <button className="text-blue-600 underline text-sm">
                                  Lihat Detail
                                </button>
                              </Link>
                              <button
                                onClick={() => openUpdateForm(data)}
                                className="text-green-600 underline text-sm"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => handleDeleteSurvey(data.id)}
                                className="text-red-600 underline text-sm"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <CreateSurveyHeaderForm />
      <UpdateSurveyHeaderForm surveyData={selectedSurvey || undefined} />
    </>
  )
}
