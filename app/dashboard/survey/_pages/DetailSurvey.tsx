'use client'

import { Button } from '@/components/ui/button'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CreateCubicleForm } from '../_components/cubicle/CreateCubicleForm'
import { CreateSKTMForm } from '../_components/sktm/CreateSKTMForm'
import { CreateSUTMForm } from '../_components/sutm/CreateSUTMForm'
import { useGetSurveyDetail } from '../_hooks/@read/survey-details'

export default function DetailSurveyPage({ surveyId }: { surveyId: string }) {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const { data: survey, isPending } = useGetSurveyDetail(surveyId)

  const { open } = useOverlayStore()
  const sktmFormId = 'create-sktm-form-sheets'
  const sutmFormId = 'create-sutm-form-sheets'
  const cubicleFormId = 'create-cubicle-form-sheets'

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
      <div className="flex flex-col px-6 sm:px-10 py-4 w-full">
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
      </div>
      <CreateSKTMForm sheetId={sktmFormId} surveyId={Number(surveyId)} />
      <CreateSUTMForm sheetId={sutmFormId} surveyId={Number(surveyId)} />
      <CreateCubicleForm sheetId={cubicleFormId} surveyId={Number(surveyId)} />
    </>
  )
}
