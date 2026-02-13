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
import { useUpdateSurveyHeaderMutation } from '../_hooks/@create/survey-header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

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
  const [cubicleToDelete, setCubicleToDelete] = useState<number | null>(null)
  const [showApproveConfirm, setShowApproveConfirm] = useState(false)

  const { data: survey, isPending } = useGetSurveyDetail(surveyId)

  const updateCubicleMutation = useUpdateCubicleMutation(Number(surveyId))
  const deleteCubicleMutation = useDeleteCubicleMutation(Number(surveyId))
  const updateSurveyMutation = useUpdateSurveyHeaderMutation()

  const { open } = useOverlayStore()
  const sktmFormId = 'create-sktm-form-sheets'
  const sutmFormId = 'create-sutm-form-sheets'
  const cubicleFormId = 'create-cubicle-form-sheets'
  const updateCubicleFormId = 'update-cubicle-form-sheets'
  const deleteCubicleDialogId = 'delete-cubicle-confirm-dialog'
  const approveSurveyDialogId = 'approve-survey-confirm-dialog'

  const handleUpdateCubicle = (cubicleData: any) => {
    setSelectedCubicle(cubicleData)
    open(updateCubicleFormId)
  }

  const handleDeleteCubicle = (id: number) => {
    setCubicleToDelete(id)
    open(deleteCubicleDialogId)
  }

  const confirmDeleteCubicle = () => {
    if (cubicleToDelete !== null) {
      deleteCubicleMutation.mutate(cubicleToDelete)
      setCubicleToDelete(null)
    }
  }

  const handleApprove = () => {
    setShowApproveConfirm(true)
    open(approveSurveyDialogId)
  }

  const confirmApprove = () => {
    if (!survey) return

    // Try to find id_material_konduktor from SUTM surveys if available
    // Backend validation requires this field.
    // If not SUTM, we default to 1 (assuming it's a valid ID in DB) to satisfy validator.
    // This is a workaround for backend schema requiring it even if irrelevant for non-SUTM.
    const idMaterialKonduktor =
      survey.sutm_surveys?.[0]?.id_material_konduktor || 1

    updateSurveyMutation.mutate({
      id: survey.id,
      nama_survey: survey.nama_survey,
      nama_pekerjaan: survey.nama_pekerjaan,
      lokasi: survey.lokasi,
      user_id: survey.user_id,
      status_survey: 'Disetujui',
      id_material_konduktor: idMaterialKonduktor
    })
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
            {survey.status_survey !== 'Disetujui' && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white ml-2"
                onClick={handleApprove}
                disabled={updateSurveyMutation.isPending}
              >
                {updateSurveyMutation.isPending
                  ? 'Processing...'
                  : 'Setujui Survey'}
              </Button>
            )}
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

        <div className="rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="w-96 text-start font-bold">
                  Nama Survey
                </TableHead>
                <TableCell>{survey.nama_survey}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="w-96 text-start font-bold">
                  Nama Pekerjaan
                </TableHead>
                <TableCell>{survey.nama_pekerjaan}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="w-96 text-start font-bold">
                  Lokasi
                </TableHead>
                <TableCell>{survey.lokasi}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="w-96 text-start font-bold">
                  Status
                </TableHead>
                <TableCell>{survey.status_survey.replace('_', ' ')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
              'w-full rounded-md border',
              hideSurveySequence ? 'hidden' : 'block'
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {surveySequenceHeaders.map((item, index) => (
                    <TableHead key={index}>{item}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : !survey.SurveySequance || !survey.SurveySequance.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Data urutan tiang tidak tersedia.
                    </TableCell>
                  </TableRow>
                ) : (
                  survey.SurveySequance.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.tipe}</TableCell>
                      <TableCell>{data.urutan}</TableCell>
                      <TableCell>
                        <a
                          href={`#${data.tipe.toLowerCase()}-section`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {data.survey_detail_id}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
              'w-full rounded-md border',
              hideSktmSection ? 'hidden' : 'block'
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {surveySktmHeaders.map((item, index) => (
                    <TableHead key={index}>{item}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : !survey.sktm_surveys || !survey.sktm_surveys.length ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center">
                      Data SKTM tidak tersedia.
                    </TableCell>
                  </TableRow>
                ) : (
                  survey.sktm_surveys.flatMap(sktm =>
                    sktm.sktm_details.map((detail, index) => (
                      <TableRow key={`${sktm.id}-${detail.id}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{detail.penyulang}</TableCell>
                        <TableCell className="text-start min-w-[200px]">
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
                        </TableCell>
                        <TableCell>{detail.panjang_jaringan}</TableCell>
                        <TableCell>{detail.diameter_kabel}</TableCell>
                        <TableCell>
                          Lat: {detail.lat}
                          <br />
                          Long: {detail.long}
                        </TableCell>
                        <TableCell>
                          {detail.has_arrester ? 'Ya' : 'Tidak'}
                        </TableCell>
                        <TableCell className="justify-center flex">
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
                        </TableCell>
                        <TableCell>{detail.keterangan}</TableCell>
                        <TableCell>{detail.petugas_survey}</TableCell>
                        <TableCell>{detail.id}</TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
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
              'w-full rounded-md border',
              hideSutmSection ? 'hidden' : 'block'
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {surveySutmHeaders.map((item, index) => (
                    <TableHead key={index}>{item}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={13} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : !survey.sutm_surveys || !survey.sutm_surveys.length ? (
                  <TableRow>
                    <TableCell colSpan={13} className="h-24 text-center">
                      Data SUTM tidak tersedia.
                    </TableCell>
                  </TableRow>
                ) : (
                  survey.sutm_surveys.flatMap(sutm =>
                    sutm.sutm_details.map((detail, index) => (
                      <TableRow key={`${sutm.id}-${detail.id}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{detail.penyulang}</TableCell>
                        <TableCell>
                          {sutm.material_konduktor?.nama_material ?? '-'}
                        </TableCell>
                        <TableCell>
                          {detail.material_tiang?.nama_material ?? '-'}
                        </TableCell>
                        <TableCell>
                          {detail.konstruksi?.nama_konstruksi ?? '-'}
                        </TableCell>
                        <TableCell>
                          {detail.pole_supporter?.nama_pole ?? '-'}
                        </TableCell>
                        <TableCell>
                          {detail.grounding_termination?.nama_grounding ?? '-'}
                        </TableCell>
                        <TableCell>{detail.panjang_jaringan}</TableCell>
                        <TableCell>
                          Lat: {detail.lat}
                          <br />
                          Long: {detail.long}
                        </TableCell>
                        <TableCell className="justify-center flex">
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
                        </TableCell>
                        <TableCell>{detail.keterangan}</TableCell>
                        <TableCell>{detail.petugas_survey}</TableCell>
                        <TableCell>{detail.id}</TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
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
              'w-full rounded-md border',
              hideCubiclePole ? 'hidden' : 'block'
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {surveyCubicleHeaders.map((item, index) => (
                    <TableHead key={index}>{item}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : !survey.cubicle_surveys ||
                  !survey.cubicle_surveys.length ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      Data tiang cubicle tidak tersedia.
                    </TableCell>
                  </TableRow>
                ) : (
                  survey.cubicle_surveys.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.cubicle_type}</TableCell>
                      <TableCell>
                        {data.has_grounding ? 'Ya' : 'Tidak'}
                      </TableCell>
                      <TableCell>{data.penyulang}</TableCell>
                      <TableCell>
                        Latitude: {data.lat}
                        <br />
                        Longitude: {data.long}
                      </TableCell>
                      <TableCell className="justify-center flex">
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
                      </TableCell>
                      <TableCell>{data.keterangan}</TableCell>
                      <TableCell>{data.petugas_survey}</TableCell>
                      <TableCell>{data.id}</TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
              'w-full rounded-md border',
              hideAppTm ? 'hidden' : 'block'
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {surveyAppTmHeaders.map((item, index) => (
                    <TableHead key={index}>{item}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : !survey.app_tm_surveys || !survey.app_tm_surveys.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Data APP TM tidak tersedia.
                    </TableCell>
                  </TableRow>
                ) : (
                  survey.app_tm_surveys.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.keterangan}</TableCell>
                      <TableCell>{data.penyulang}</TableCell>
                      <TableCell className="text-start">
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
                      </TableCell>
                      <TableCell>
                        Latitude: {data.lat}
                        <br />
                        Longitude: {data.long}
                      </TableCell>
                      <TableCell className="justify-center flex">
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
                      </TableCell>
                      <TableCell>{data.id}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
      <ConfirmDialog
        dialogId={deleteCubicleDialogId}
        title="Hapus Cubicle"
        description="Apakah Anda yakin ingin menghapus cubicle ini? Data yang sudah dihapus tidak dapat dikembalikan."
        onConfirm={confirmDeleteCubicle}
        confirmText="Hapus"
        cancelText="Batal"
        variant="destructive"
      />
      <ConfirmDialog
        dialogId={approveSurveyDialogId}
        title="Setujui Survey"
        description="Apakah Anda yakin ingin menyetujui survey ini? Survey yang sudah disetujui akan masuk ke laporan."
        onConfirm={confirmApprove}
        confirmText="Setujui"
        cancelText="Batal"
      />
    </>
  )
}
