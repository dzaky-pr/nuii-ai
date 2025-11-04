'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { surveyStatus } from '@/lib/constants'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { NotebookPen, Route } from 'lucide-react'
import Link from 'next/link'
import { CreateSurveyHeaderForm } from './_components/header/CreateSurveyHeaderForm'
import { useGetSurveyHeaderList } from './_hooks/@read/survey-headers'

const tableHeaders = [
  '#',
  'Nama Survey',
  'Lokasi',
  'Status',
  'ID Pengguna',
  'Aksi'
]

export default function Page() {
  const [isMounted, setIsMounted] = useState(false)

  const { data: surveys, isPending: loadingGetSurveys } =
    useGetSurveyHeaderList()

  const { open } = useOverlayStore()

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
                      <td colSpan={6} className="py-4 font-medium">
                        Loading...
                      </td>
                    </tr>
                  ) : !surveys || !surveys.length ? (
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
                        <td className="border p-2 ">
                          {surveyStatus[data.status_survey]}
                        </td>
                        <td className="border p-2">{data.user_id}</td>
                        <td className="border p-2">
                          <Link href={`/dashboard/survey/${data.id}`}>
                            <button className="text-neutral-300 underline">
                              Lihat Detail
                            </button>
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
      </div>
      <CreateSurveyHeaderForm />
    </>
  )
}
