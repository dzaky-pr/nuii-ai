'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { baseURL } from '@/lib/tools/api'
import { useAuth } from '@clerk/nextjs'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import UploadFile from '@/components/upload-file'
import { jobOptions } from '@/lib/constants'
import { dummyLocations } from '@/lib/data/survey'
import { UploadFormValues } from '@/lib/types/report'
import { getSessionDefault, removeSessionFile } from '@/lib/utils'
import SearchableCombobox from '../survey/_components/SearchableCombobox'
import { useGetConductorList } from '../survey/_hooks/@read/useGetConductorList'
import { useGetSurveyReportList } from './_hooks/useGetSurveyReportList'
import { useUploadExcelArchiveMutation } from './_hooks/useUploadExcelArchiveMutation'

const tableHeader = [
  '#',
  'Nama Survey',
  'Lokasi',
  'Diperbarui Pada',
  'ID Pengguna',
  'Aksi'
]

export default function ReportPage() {
  // State diurutkan PERTAMA
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isDownloadLoading, setIsDownloadLoading] = useState<string | null>(
    null
  )
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState<boolean>(false)

  // Hooks lainnya
  const { getToken, userId } = useAuth()
  const { data: surveys, isPending: loadingGetSurveys } =
    useGetSurveyReportList()
  const { conductorList, loadingConductorList } = useGetConductorList()
  const { mutate: uploadExcel, isPending: uploadLoading } =
    useUploadExcelArchiveMutation()
  const methods = useForm<UploadFormValues>({ mode: 'onTouched' })
  const { handleSubmit, register, control, reset } = methods

  // Effect for Mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleDownloadReport = async (data: {
    id: string
    nama_survey: string
    excel_archive: {
      file_path: string
      file_name: string
    }[]
  }) => {
    setIsDownloadLoading(data.id)
    try {
      const token = await getToken()

      if (data.excel_archive.length > 0) {
        // download dari archive
        const archive = data.excel_archive[0]
        const fileUrl = `${baseURL}/${archive.file_path}`
        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
          throw new Error(
            `Gagal mengunduh file archive: ${response.statusText}`
          )
        }

        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.setAttribute('download', archive.file_name)
        document.body.appendChild(a)
        a.click()

        window.URL.revokeObjectURL(blobUrl)
        document.body.removeChild(a)

        toast.success('Berhasil mengunduh file archive!') // <-- hanya muncul kalau sukses download
      } else {
        // generate baru
        const response = await fetch(
          `${baseURL}/survey/export/excel/${data.id}`,
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
          }-${date.getFullYear()}_REPORT-SURVEY-${data.nama_survey}-${
            data.id
          }.xlsx`
        )
        document.body.appendChild(a)
        a.click()

        window.URL.revokeObjectURL(blobUrl)
        document.body.removeChild(a)

        toast.success('Berhasil mengunduh file report!') // <-- hanya muncul kalau sukses download
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengunduh file.'

      toast.error(`Failed. ${errorMessage}`)
    } finally {
      setIsDownloadLoading(null)
    }
  }

  const onSubmitUpload = async (data: UploadFormValues) => {
    try {
      const fileSession = getSessionDefault('file_path')

      if (!fileSession?.link) {
        toast.error('File belum diupload. Mohon upload file terlebih dahulu.')
        return
      }

      const payload = {
        header: {
          nama_survey: data.nama_survey,
          nama_pekerjaan: data.nama_pekerjaan,
          lokasi: data.lokasi,
          user_id: userId || '',
          id_material_konduktor: Number(data.id_material_konduktor)
        },
        file: {
          file_name: fileSession.user_file_name || '',
          file_path: fileSession.link || ''
        }
      }

      uploadExcel(payload, {
        onSuccess: () => {
          setIsUploadSheetOpen(false)
          reset()
          removeSessionFile('file_path')
        }
      })
    } catch (error) {
      console.error(error)
      toast.error('Gagal submit data!')
    }
  }

  return (
    <div className="mt-4 py-4 px-10">
      <div className="flex justify-between w-full">
        <h2 className="text-lg font-bold mb-4">Data Report</h2>
        <Sheet open={isUploadSheetOpen} onOpenChange={setIsUploadSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Upload Excel
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Upload Report Baru</SheetTitle>
              <SheetDescription>
                Isi data berikut untuk upload excel baru.
              </SheetDescription>
            </SheetHeader>

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmitUpload)}
                className="grid gap-4 py-4"
              >
                {/* Nama Survey */}
                <div className="grid gap-2">
                  <Label>Nama Survey</Label>
                  <Input
                    {...register('nama_survey', { required: true })}
                    placeholder="Nama Survey"
                  />
                </div>

                {/* Nama Pekerjaan */}

                <div className="grid gap-2">
                  <Label>Nama Pekerjaan</Label>
                  <Controller
                    name="nama_pekerjaan"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SearchableCombobox
                        value={value ?? undefined}
                        options={jobOptions.map(item => ({
                          value: item,
                          label: item
                        }))}
                        onValueChange={onChange}
                        placeholder="Pilih Nama Pekerjaan"
                      />
                    )}
                  />
                </div>

                {/* Lokasi/ULP */}
                <div className="grid gap-2">
                  <Label htmlFor="lokasi">Lokasi/ULP</Label>
                  <Controller
                    name="lokasi"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SearchableCombobox
                        value={value ?? undefined}
                        options={dummyLocations}
                        onValueChange={onChange}
                        placeholder="Pilih Lokasi"
                      />
                    )}
                  />
                </div>

                {/* Jenis Konduktor */}
                <div className="grid gap-2">
                  <Label>Jenis Konduktor</Label>
                  <Controller
                    control={control}
                    name="id_material_konduktor"
                    render={({ field: { onChange, value } }) => (
                      <SearchableCombobox
                        value={value ?? undefined}
                        isLoading={loadingConductorList}
                        options={conductorList}
                        onValueChange={onChange}
                        placeholder="Pilih Jenis Konduktor"
                      />
                    )}
                  />
                </div>

                {/* Upload File */}
                <div className="grid gap-2">
                  <Label>Upload File Excel</Label>
                  <UploadFile
                    sessionIdName="file_path"
                    uploadType="/upload-file/excel"
                    accept={{
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                        ['.xlsx']
                    }}
                    maxSizeInBytes={25 * 1000000} // maksimal 25MB
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </FormProvider>
          </SheetContent>
        </Sheet>
      </div>

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
                surveys.map((data, index) => (
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
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isDownloadLoading !== null}
                        onClick={() =>
                          handleDownloadReport({
                            id: data.id.toString(),
                            nama_survey: data.nama_survey,
                            excel_archive: data.excel_archive
                          })
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
