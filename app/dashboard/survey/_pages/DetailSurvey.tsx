'use client'

import { Button } from '@/components/ui/button'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { cn } from '@/lib/utils'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CreateCubicleForm } from '../_components/cubicle/CreateCubicleForm'
import { UpdateCubicleForm } from '../_components/cubicle/UpdateCubicleForm'
import { CreateSKTMForm } from '../_components/sktm/CreateSKTMForm'
import { CreateSUTMForm } from '../_components/sutm/CreateSUTMForm'
import { useGetSurveyDetail } from '../_hooks/@read/survey-details'
import {
  useUpdateCubicleMutation,
  useDeleteCubicleMutation
} from '../_hooks/@create/cubicle'

const surveySequenceHeaders = ['No', 'Tipe', 'Urutan', 'ID Ref']
const surveyCubicleHeaders = [
  'No',
  'Tipe Cubicle',
  'Grounding',
  'Penyulang',
  'Koordinat',
  'Foto',
  'Keterangan',
  'Petugas Survey',
  'ID',
  'Aksi'
]
const surveyAppTmHeaders = [
  'No',
  'Keterangan',
  'Penyulang',
  'Komponen',
  'Koordinat',
  'Foto',
  'ID'
]

const surveySktmHeaders = [
  'No',
  'Penyulang',
  'Komponen',
  'Panjang (m)',
  'Diameter (mm)',
  'Koordinat',
  'Arrester',
  'Foto',
  'Keterangan',
  'Petugas',
  'ID'
]

const surveySutmHeaders = [
  'No',
  'Penyulang',
  'Konduktor',
  'Tiang',
  'Konstruksi',
  'Pole Supporter',
  'Grounding',
  'Panjang (m)',
  'Koordinat',
  'Foto',
  'Keterangan',
  'Petugas',
  'ID'
]

export default function DetailSurveyPage({ surveyId }: { surveyId: string }) {
  const [isMounted, setIsMounted] = useState(false)
  const [hideSurveySequence, setHideSurveySequence] = useState(false)
  const [hideSktmPole, setHideSktmPole] = useState(false)
  const [hideSutmPole, setHideSutmPole] = useState(false)
  const [hideCubiclePole, setHideCubiclePole] = useState(false)
  const [hideAppTm, setHideAppTm] = useState(false)
  const [hideSktmSection, setHideSktmSection] = useState(false)
  const [hideSutmSection, setHideSutmSection] = useState(false)
  const [selectedCubicle, setSelectedCubicle] = useState<any>(null)

  const { data: survey, isPending } = useGetSurveyDetail(surveyId)

  const updateCubicleMutation = useUpdateCubicleMutation(Number(surveyId))
  const deleteCubicleMutation = useDeleteCubicleMutation(Number(surveyId))

  const { open } = useOverlayStore()
  const sktmFormId = 'create-sktm-form-sheets'
  const sutmFormId = 'create-sutm-form-sheets'
  const cubicleFormId = 'create-cubicle-form-sheets'
  const updateCubicleFormId = 'update-cubicle-form-sheets'

  const handleUpdateCubicle = (cubicleData: any) => {
    setSelectedCubicle(cubicleData)
    open(updateCubicleFormId)
  }

  const handleDeleteCubicle = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus cubicle ini?')) {
      deleteCubicleMutation.mutate(id)
    }
  }

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
              Survey {survey.nama_survey}
            </h1>
          </div>

          <div className="flex sm:flex-row flex-col sm:w-fit w-full gap-4">
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => open(sktmFormId)}
            >
              Tambah SKTM
            </Button>
            <Button
              size="sm"
              className="bg-sky-500 hover:bg-sky-600 text-white"
              onClick={() => open(sutmFormId)}
            >
              Tambah SUTM
            </Button>
            <Button
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => open(cubicleFormId)}
            >
              Tambah Cubicle
            </Button>
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
            <h1 className="text-lg font-semibold">Urutan Tiang</h1>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => setHideSurveySequence(!hideSurveySequence)}
            >
              {hideSurveySequence ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </Button>
          </div>

          <div
            className={cn(
              'overflow-x-auto w-full',
              hideSurveySequence ? 'hidden' : 'block'
            )}
          >
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  {surveySequenceHeaders.map((item, index) => (
                    <th key={index} className="border p-2">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr className="text-center">
                    <td colSpan={3} className="py-4 font-medium">
                      Loading...
                    </td>
                  </tr>
                ) : !survey.SurveySequance || !survey.SurveySequance.length ? (
                  <tr className="text-center">
                    <td colSpan={4} className="py-4 font-medium">
                      Data urutan tiang tidak tersedia.
                    </td>
                  </tr>
                ) : (
                  survey.SurveySequance.map((data, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{data.tipe}</td>
                      <td className="border p-2">{data.urutan}</td>
                      <td className="border p-2">
                        <a
                          href={`#${data.tipe.toLowerCase()}-section`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {data.survey_detail_id}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-y-4" id="sktm-section">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-lg font-semibold">SKTM</h1>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => setHideSktmSection(!hideSktmSection)}
            >
              {hideSktmSection ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </Button>
          </div>

          <div
            className={cn(
              'overflow-x-auto w-full',
              hideSktmSection ? 'hidden' : 'block'
            )}
          >
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  {surveySktmHeaders.map((item, index) => (
                    <th key={index} className="border p-2">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr className="text-center">
                    <td colSpan={11} className="py-4 font-medium">
                      Loading...
                    </td>
                  </tr>
                ) : !survey.sktm_surveys || !survey.sktm_surveys.length ? (
                  <tr className="text-center">
                    <td colSpan={11} className="py-4 font-medium">
                      Data SKTM tidak tersedia.
                    </td>
                  </tr>
                ) : (
                  survey.sktm_surveys.flatMap(sktm =>
                    sktm.sktm_details.map((detail, index) => (
                      <tr
                        key={`${sktm.id}-${detail.id}`}
                        className="text-center"
                      >
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{detail.penyulang}</td>
                        <td className="border p-2 text-start min-w-[200px]">
                          {sktm.sktm_components &&
                          sktm.sktm_components.length > 0 ? (
                            <ul className="list-disc pl-4 text-xs">
                              {sktm.sktm_components.map((comp, idx) => (
                                <li key={idx}>
                                  {comp.material?.nama_material} (
                                  {Number(comp.kuantitas)})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="border p-2">
                          {detail.panjang_jaringan}
                        </td>
                        <td className="border p-2">{detail.diameter_kabel}</td>
                        <td className="border p-2">
                          Lat: {detail.lat}
                          <br />
                          Long: {detail.long}
                        </td>
                        <td className="border p-2">
                          {detail.has_arrester ? 'Ya' : 'Tidak'}
                        </td>
                        <td className="border p-2 justify-center flex">
                          {detail.foto && detail.foto !== '-' ? (
                            <Image
                              src={detail.foto}
                              alt="Foto SKTM"
                              width={150}
                              height={150}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs italic">
                              No Image
                            </span>
                          )}
                        </td>
                        <td className="border p-2">{detail.keterangan}</td>
                        <td className="border p-2">{detail.petugas_survey}</td>
                        <td className="border p-2">{detail.id}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-y-4" id="sutm-section">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-lg font-semibold">SUTM</h1>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => setHideSutmSection(!hideSutmSection)}
            >
              {hideSutmSection ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </Button>
          </div>

          <div
            className={cn(
              'overflow-x-auto w-full',
              hideSutmSection ? 'hidden' : 'block'
            )}
          >
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  {surveySutmHeaders.map((item, index) => (
                    <th key={index} className="border p-2">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr className="text-center">
                    <td colSpan={13} className="py-4 font-medium">
                      Loading...
                    </td>
                  </tr>
                ) : !survey.sutm_surveys || !survey.sutm_surveys.length ? (
                  <tr className="text-center">
                    <td colSpan={13} className="py-4 font-medium">
                      Data SUTM tidak tersedia.
                    </td>
                  </tr>
                ) : (
                  survey.sutm_surveys.flatMap(sutm =>
                    sutm.sutm_details.map((detail, index) => (
                      <tr
                        key={`${sutm.id}-${detail.id}`}
                        className="text-center"
                      >
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{detail.penyulang}</td>
                        <td className="border p-2">
                          {sutm.material_konduktor?.nama_material ?? '-'}
                        </td>
                        <td className="border p-2">
                          {detail.material_tiang?.nama_material ?? '-'}
                        </td>
                        <td className="border p-2">
                          {detail.konstruksi?.nama_konstruksi ?? '-'}
                        </td>
                        <td className="border p-2">
                          {detail.pole_supporter?.nama_pole ?? '-'}
                        </td>
                        <td className="border p-2">
                          {detail.grounding_termination?.nama_grounding ?? '-'}
                        </td>
                        <td className="border p-2">
                          {detail.panjang_jaringan}
                        </td>
                        <td className="border p-2">
                          Lat: {detail.lat}
                          <br />
                          Long: {detail.long}
                        </td>
                        <td className="border p-2 justify-center flex">
                          {detail.foto && detail.foto !== '-' ? (
                            <Image
                              src={detail.foto}
                              alt="Foto SUTM"
                              width={150}
                              height={150}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs italic">
                              No Image
                            </span>
                          )}
                        </td>
                        <td className="border p-2">{detail.keterangan}</td>
                        <td className="border p-2">{detail.petugas_survey}</td>
                        <td className="border p-2">{detail.id}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-y-4" id="cubicle-section">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-lg font-semibold">Tiang Cubicle</h1>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => setHideCubiclePole(!hideCubiclePole)}
            >
              {hideCubiclePole ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </Button>
          </div>

          <div
            className={cn(
              'overflow-x-auto w-full',
              hideCubiclePole ? 'hidden' : 'block'
            )}
          >
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  {surveyCubicleHeaders.map((item, index) => (
                    <th key={index} className="border p-2">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr className="text-center">
                    <td colSpan={10} className="py-4 font-medium">
                      Loading...
                    </td>
                  </tr>
                ) : !survey.cubicle_surveys ||
                  !survey.cubicle_surveys.length ? (
                  <tr className="text-center">
                    <td colSpan={10} className="py-4 font-medium">
                      Data tiang cubicle tidak tersedia.
                    </td>
                  </tr>
                ) : (
                  survey.cubicle_surveys.map((data, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{data.cubicle_type}</td>
                      <td className="border p-2">
                        {data.has_grounding ? 'Ya' : 'Tidak'}
                      </td>
                      <td className="border p-2">{data.penyulang}</td>
                      <td className="border p-2">
                        Latitude: {data.lat}
                        <br />
                        Longitude: {data.long}
                      </td>
                      <td className="border p-2 justify-center flex">
                        {data.foto && data.foto !== '-' ? (
                          <Image
                            src={data.foto}
                            alt="Foto cubicle"
                            width={150}
                            height={150}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            No Image
                          </span>
                        )}
                      </td>
                      <td className="border p-2">{data.keterangan}</td>
                      <td className="border p-2">{data.petugas_survey}</td>
                      <td className="border p-2">{data.id}</td>
                      <td className="border p-2">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => handleUpdateCubicle(data)}
                            className="text-blue-600 underline text-xs"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteCubicle(data.id)}
                            className="text-red-600 underline text-xs"
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

        <div className="flex flex-col gap-y-4" id="app_tm-section">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-lg font-semibold">APP TM</h1>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => setHideAppTm(!hideAppTm)}
            >
              {hideAppTm ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </Button>
          </div>

          <div
            className={cn(
              'overflow-x-auto w-full',
              hideAppTm ? 'hidden' : 'block'
            )}
          >
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  {surveyAppTmHeaders.map((item, index) => (
                    <th key={index} className="border p-2">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr className="text-center">
                    <td colSpan={7} className="py-4 font-medium">
                      Loading...
                    </td>
                  </tr>
                ) : !survey.app_tm_surveys || !survey.app_tm_surveys.length ? (
                  <tr className="text-center">
                    <td colSpan={7} className="py-4 font-medium">
                      Data APP TM tidak tersedia.
                    </td>
                  </tr>
                ) : (
                  survey.app_tm_surveys.map((data, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{data.keterangan}</td>
                      <td className="border p-2">{data.penyulang}</td>
                      <td className="border p-2 text-start">
                        {data.AppTmComponent &&
                        data.AppTmComponent.length > 0 ? (
                          <ul className="list-disc pl-4 text-xs">
                            {data.AppTmComponent.map((comp, idx) => (
                              <li key={idx}>
                                {comp.material?.nama_material} ({comp.kuantitas}
                                )
                              </li>
                            ))}
                          </ul>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="border p-2">
                        Latitude: {data.lat}
                        <br />
                        Longitude: {data.long}
                      </td>
                      <td className="border p-2 justify-center flex">
                        {data.foto && data.foto !== '-' ? (
                          <Image
                            src={data.foto}
                            alt="Foto APP TM"
                            width={150}
                            height={150}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            No Image
                          </span>
                        )}
                      </td>
                      <td className="border p-2">{data.id}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CreateSKTMForm sheetId={sktmFormId} surveyId={Number(surveyId)} />
      <CreateSUTMForm sheetId={sutmFormId} surveyId={Number(surveyId)} />
      <CreateCubicleForm sheetId={cubicleFormId} surveyId={Number(surveyId)} />
      <UpdateCubicleForm
        sheetId={updateCubicleFormId}
        surveyId={Number(surveyId)}
        cubicleData={selectedCubicle}
      />
    </>
  )
}
