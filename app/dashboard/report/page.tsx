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
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TableFilter } from '@/components/shared/TableFilter'
import {
  SortableTableHead,
  SortDirection
} from '@/components/shared/SortableTableHead'
import { useSearchParams } from 'next/navigation'

import UploadFile from '@/components/upload-file'
import { jobOptions } from '@/lib/constants'
import { dummyLocations } from '@/lib/data/survey'
import { UploadFormValues } from '@/lib/types/report'
import { getSessionDefault, removeSessionFile } from '@/lib/utils'
import SearchableCombobox from '../survey/_components/SearchableCombobox'
import { useGetConductors } from '../survey/_hooks/@read/components/conductors'
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
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)

  // Hooks lainnya
  const { getToken, userId } = useAuth()
  const { data: surveys, isPending: loadingGetSurveys } =
    useGetSurveyReportList()
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('search') ?? ''

  // Sorting State
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Client-side filtering
  const filteredSurveys = searchTerm
    ? surveys?.filter(survey =>
        survey.nama_survey.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : surveys

  // Sorting Logic
  const sortedList = React.useMemo(() => {
    if (!filteredSurveys) return []
    if (!sortKey || !sortDirection) return filteredSurveys

    return [...filteredSurveys].sort((a, b) => {
      const aValue = (a as any)[sortKey]
      const bValue = (b as any)[sortKey]

      if (aValue === bValue) return 0

      const comparison = aValue > bValue ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredSurveys, sortKey, sortDirection])

  // Pagination processing
  const totalItems = sortedList.length
  const totalPages = Math.ceil(totalItems / limit)
  const paginatedList = sortedList.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  )

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const { conductors, loadingConductors } = useGetConductors()
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

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value)
    setLimit(newLimit)
    setCurrentPage(1)
  }

  return (
    <div className="mt-4 py-4 px-10">
      <div className="flex justify-between w-full">
        <h2 className="text-lg font-bold mb-4">Data Report</h2>
        <Sheet open={isUploadSheetOpen} onOpenChange={setIsUploadSheetOpen}>
          <SheetTrigger asChild>
            {/* //!! Need fix because have some major BUGS! */}
            {/* <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Upload Excel
            </Button> */}
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
                        options={jobOptions}
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
                        isLoading={loadingConductors}
                        options={conductors}
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

      <div className="mb-4 flex flex-col gap-4">
        <TableFilter placeholder="Filter nama survey..." />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <SortableTableHead
                  sortKey="nama_survey"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Nama Survey
                </SortableTableHead>
                <SortableTableHead
                  sortKey="lokasi"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Lokasi
                </SortableTableHead>
                <SortableTableHead
                  sortKey="updated_at"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Diperbarui Pada
                </SortableTableHead>
                <SortableTableHead
                  sortKey="user_id"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                >
                  ID Pengguna
                </SortableTableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingGetSurveys ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : totalItems === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Data survey tidak tersedia.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedList.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {(currentPage - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell>{data.nama_survey}</TableCell>
                    <TableCell>{data.lokasi}</TableCell>
                    <TableCell>
                      {format(data.updated_at, 'EEEE, d MMM yyyy HH:mm', {
                        locale: id
                      })}{' '}
                      WIB
                    </TableCell>
                    <TableCell>{data.user_id}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isDownloadLoading !== null}
                        onClick={() =>
                          handleDownloadReport({
                            id: data.id.toString(),
                            nama_survey: data.nama_survey,
                            excel_archive: data.excel_archive ?? []
                          })
                        }
                      >
                        {isDownloadLoading === data.id.toString()
                          ? 'Downloading...'
                          : 'Download Report'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span>Show </span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border p-1 rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span> entries</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border text-blue-500 hover:text-blue-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border text-blue-500 hover:text-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
