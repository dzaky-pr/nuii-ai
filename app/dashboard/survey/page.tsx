'use client'

import React, { useEffect, useState } from 'react'

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

const tableHeaders = [
  'No.',
  'Nama Survey',
  'Lokasi',
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
  // Pagination state moved up to avoid conditional hook call error
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)

  const { data: surveys, isPending: loadingGetSurveys } =
    useGetSurveyHeaderList()
  // Sorting State
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('search') ?? ''

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
                  Estimasi SUTM
                </Link>
              </Button>
            </div>
          </div>
          <div className="mb-4 flex flex-col gap-4">
            <TableFilter placeholder="Filter nama survey..." />
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
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
                      sortKey="status_survey"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Status
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="user_id"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      ID Pengguna
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="created_at"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Dibuat Pada
                    </SortableTableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingGetSurveys ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : totalItems === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Data survey tidak tersedia.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedList.map((data, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            {(currentPage - 1) * limit + index + 1}
                          </TableCell>
                          <TableCell>{data.nama_survey}</TableCell>
                          <TableCell>{data.lokasi}</TableCell>
                          <TableCell>
                            {surveyStatus[data.status_survey]}
                          </TableCell>
                          <TableCell>{data.user_id}</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Link href={`/dashboard/survey/${data.id}`}>
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
                          </TableCell>
                        </TableRow>
                      )
                    })
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
      </div>
      <CreateSurveyHeaderForm />
      <UpdateSurveyHeaderForm surveyData={selectedSurvey || undefined} />
    </>
  )
}
