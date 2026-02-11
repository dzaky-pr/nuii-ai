'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useGetSurveyDetail } from '../_hooks/@read/survey-details'

const surveySUTMHeaders = [
  'No',
  'Material Tiang',
  'Konstruksi',
  'Pole Supporter',
  'Grounding Termination',
  'Penyulang',
  'Panjang Jaringan',
  'Koordinat',
  'Foto',
  'Keterangan',
  'Petugas Survey',
  'ID'
]

export default function AutoSUTMDetailPage({ surveyId }: { surveyId: string }) {
  const [isMounted, setIsMounted] = useState(false)
  const [hideSUTMDetails, setHideSUTMDetails] = useState(false)

  const { data: survey, isPending } = useGetSurveyDetail(surveyId)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (isPending) {
    return (
      <div className="grid place-items-center min-h-[calc(100svh-65.6px)]">
        <h2 className="font-semibold">Loading...</h2>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="flex flex-col items-center justify-center gap-y-4 min-h-[calc(100svh-65.6px)] px-6 sm:px-10">
        <Button asChild size="sm" variant="outline">
          <Link href="/dashboard/survey">
            <ArrowLeft className="size-4 mb-0.5 mr-2" />
            Kembali
          </Link>
        </Button>
        <h2 className="font-semibold">Data survey tidak ditemukan.</h2>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col px-6 sm:px-10 py-4 w-full gap-y-8">
        <div className="flex w-full justify-between sm:flex-row flex-col gap-4">
          <div className="flex gap-x-4 items-center justify-between sm:justify-center max-sm:flex-row-reverse">
            <Button asChild size="sm" variant="outline" className="sm:size-10">
              <Link href="/dashboard/survey">
                <ArrowLeft className="size-4 max-sm:hidden" />
                <span className="sm:hidden">Kembali</span>
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">
              Auto SUTM Survey {survey.nama_survey}
            </h1>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <th className="text-start p-4 border w-96">Nama Survey</th>
                <td className="text-start p-4 border">{survey.nama_survey}</td>
              </tr>
              <tr>
                <th className="text-start p-4 border w-96">Nama Pekerjaan</th>
                <td className="text-start p-4 border">
                  {survey.nama_pekerjaan}
                </td>
              </tr>
              <tr>
                <th className="text-start p-4 border w-96">Lokasi</th>
                <td className="text-start p-4 border">{survey.lokasi}</td>
              </tr>
              <tr>
                <th className="text-start p-4 border w-96">Status</th>
                <td className="text-start p-4 border">
                  {survey.status_survey.replace('_', ' ')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-lg font-semibold">Detail SUTM</h1>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => setHideSUTMDetails(!hideSUTMDetails)}
            >
              {hideSUTMDetails ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </Button>
          </div>

          <div
            className={cn(
              'overflow-x-auto w-full',
              hideSUTMDetails ? 'hidden' : 'block'
            )}
          >
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  {surveySUTMHeaders.map((item, index) => (
                    <th key={index} className="border p-2">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr className="text-center">
                    <td colSpan={12} className="py-4 font-medium">
                      Loading...
                    </td>
                  </tr>
                ) : !survey.sutm_surveys ||
                  !survey.sutm_surveys.length ||
                  !(survey.sutm_surveys[0] as any).sutm_details ||
                  !(survey.sutm_surveys[0] as any).sutm_details.length ? (
                  <tr className="text-center">
                    <td colSpan={12} className="py-4 font-medium">
                      Data SUTM tidak tersedia.
                    </td>
                  </tr>
                ) : (
                  (survey.sutm_surveys[0] as any).sutm_details.map(
                    (detail: any, index: number) => (
                      <tr key={index} className="text-center">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">
                          {detail.material_tiang?.nama_material || '-'}
                        </td>
                        <td className="border p-2">
                          {detail.konstruksi?.nama_konstruksi || '-'}
                        </td>
                        <td className="border p-2">
                          {detail.pole_supporter?.nama_pole || '-'}
                        </td>
                        <td className="border p-2">
                          {detail.grounding_termination?.nama_grounding || '-'}
                        </td>
                        <td className="border p-2">{detail.penyulang}</td>
                        <td className="border p-2">
                          {detail.panjang_jaringan}m
                        </td>
                        <td className="border p-2">
                          Lat: {detail.lat}
                          <br />
                          Lng: {detail.long}
                        </td>
                        <td className="border p-2 justify-center flex">
                          {detail.foto &&
                          detail.foto !== '-' &&
                          detail.foto.startsWith('http') ? (
                            <Image
                              src={detail.foto}
                              alt="Foto SUTM"
                              width={150}
                              height={150}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-[150px] h-[150px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="border p-2">{detail.keterangan}</td>
                        <td className="border p-2">{detail.petugas_survey}</td>
                        <td className="border p-2">{detail.id}</td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
