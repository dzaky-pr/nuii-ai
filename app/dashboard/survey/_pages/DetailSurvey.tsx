'use client'

import { Button } from '@/components/ui/button'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { SurveyDetail } from '@/lib/types/survey'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import DeleteSurveyModal from '../_components/DeleteSurveyModal'
import EditSurveyDetailForm from '../_components/EditSurveyDetailForm'
import { useDeleteSurveyMutation } from '../_hooks/@delete/useDeleteSurveyMutation'
import { useGetSurveyDetail } from '../_hooks/@read/useGetSurveyDetail'

const tableHeader = [
  '#',
  'Foto',
  'ULP',
  'Penyulang',
  'Nama Tiang',
  'Konstruksi',
  'Panjang Jaringan (meter)',
  'Lokasi',
  'Petugas',
  'Keterangan',
  'Aksi'
]

export default function DetailSurveyPage({ surveyId }: { surveyId: string }) {
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyDetail | null>(
    null
  )

  const { data: survey, isPending } = useGetSurveyDetail(surveyId)
  const { mutate: deleteSurveyDetail, isSuccess: successDeleteSurveyDetail } =
    useDeleteSurveyMutation({ isHeader: false })

  const { open, close } = useOverlayStore()

  useEffect(() => {
    if (successDeleteSurveyDetail) {
      close('delete-survey-modal')
    }
  }, [close, successDeleteSurveyDetail])

  if (isPending) {
    return (
      <div className="grid place-items-center min-h-screen">
        <h2 className="font-semibold">Loading...</h2>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="grid place-items-center min-h-screen">
        <h2 className="font-semibold">Data survey tidak ditemukan.</h2>
      </div>
    )
  }

  return (
    <>
      <div className="py-4 px-10 flex flex-col gap-8 mt-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Button asChild size="icon" variant="outline">
              <Link href="/dashboard/survey">
                <ArrowLeft size={16} />
              </Link>
            </Button>
            <h3 className="font-semibold">
              Survey {survey?.header.nama_survey}
            </h3>
          </div>
          <Button size="sm" variant="outline">
            Lihat RAB
          </Button>
        </div>
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
              {survey.detail.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    {item.foto ? (
                      <Image
                        src={item.foto}
                        alt="Foto Survey"
                        width={100}
                        height={60}
                        className="object-cover"
                      />
                    ) : (
                      'Foto tidak tersedia.'
                    )}
                  </td>
                  <td className="border p-2">{survey.header.lokasi}</td>
                  <td className="border p-2">{item.penyulang}</td>
                  <td className="border p-2">{item.id_material_tiang}</td>
                  <td className="border p-2">{item.id_konstruksi}</td>
                  <td className="border p-2">{item.panjang_jaringan}</td>
                  <td className="border p-2">
                    <Button size="sm" variant="outline">
                      Lihat Map
                    </Button>
                  </td>
                  <td className="border p-2">{item.petugas_survey}</td>
                  <td className="border p-2">{item.keterangan}</td>
                  <td className="border p-2 flex flex-col justify-center gap-2">
                    <button
                      className="text-green-500"
                      onClick={() => {
                        setSelectedSurvey(item)
                        open('detail-survey-modal')
                      }}
                    >
                      Lihat Detail
                    </button>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="text-blue-500"
                        onClick={() => {
                          setSelectedSurvey(item)
                          open('edit-survey-detail-modal')
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          setSelectedSurvey(item)
                          open('delete-survey-modal')
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EditSurveyDetailForm surveyDetail={selectedSurvey!!} />
      <DeleteSurveyModal
        onSubmit={() => {
          if (selectedSurvey) {
            deleteSurveyDetail(selectedSurvey.id!!)
          }
        }}
        onCancel={() => setSelectedSurvey(null)}
      />
    </>
  )
}
