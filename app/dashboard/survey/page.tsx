'use client'
import { useEffect, useState } from 'react'

import { surveyStatus } from '@/lib/constants'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { SurveyHeader } from '@/lib/types/survey'
import Link from 'next/link'
import CreateSurveyForm from './_components/CreateSurveyForm'
import DeleteSurveyModal from './_components/DeleteSurveyModal'
import EditSurveyHeaderForm from './_components/EditSurveyHeaderForm'
import { useDeleteSurveyHeaderMutation } from './_hooks/@delete/useDeleteSurveyHeaderMutation'
import { useGetSurveyHeaderList } from './_hooks/@read/useGetSurveyHeaderList'

export const tableHeader = [
  '#',
  'Nama Survey',
  'Lokasi',
  'Status',
  'ID Pengguna',
  'Aksi'
]

export default function Page() {
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyHeader | null>(
    null
  )
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const { data: surveys, isPending: loadingGetSurveys } =
    useGetSurveyHeaderList()
  const { mutate: deleteSurveyHeader, isSuccess: successDeleteSurveyHeader } =
    useDeleteSurveyHeaderMutation()

  const { open, close } = useOverlayStore()

  useEffect(() => {
    if (successDeleteSurveyHeader) {
      close('delete-survey-modal')
    }
  }, [close, successDeleteSurveyHeader])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div className="py-4 px-6">
        <CreateSurveyForm />
        <div className="mt-4 px-4">
          <h2 className="text-lg font-bold mb-4">Data Survey</h2>
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
                        <td className="border p-2 ">
                          {surveyStatus[data.status_survey]}
                        </td>
                        <td className="border p-2">{data.user_id}</td>
                        <td className="border p-2 flex flex-col justify-center items-center gap-2">
                          <Link href={`/dashboard/survey/${data.id}`}>
                            <button className="text-green-500">
                              Lihat Detail
                            </button>
                          </Link>
                          <div className="flex justify-center items-center gap-2">
                            <button
                              className="text-blue-500"
                              onClick={() => {
                                setSelectedSurvey(data)
                                open('edit-survey-header-modal')
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-500"
                              onClick={() => {
                                setSelectedSurvey(data)
                                open('delete-survey-modal')
                              }}
                            >
                              Hapus
                            </button>
                          </div>
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
      <EditSurveyHeaderForm surveyHeader={selectedSurvey!!} />
      <DeleteSurveyModal
        onSubmit={() => {
          if (selectedSurvey) {
            deleteSurveyHeader(selectedSurvey.id!!)
          }
        }}
        onCancel={() => setSelectedSurvey(null)}
      />
    </>
  )
}
