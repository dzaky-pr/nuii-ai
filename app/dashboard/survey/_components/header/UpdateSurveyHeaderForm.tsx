import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { jobOptions } from '@/lib/constants'
import { dummyLocations } from '@/lib/data/survey'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { ICreateSurveyHeader, ISurveyHeader } from '@/lib/types/survey'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useUpdateSurveyHeaderMutation } from '../../_hooks/@create/survey-header'
import SearchableCombobox from '../SearchableCombobox'
import { CloseSheetsConfirmationDialog } from '../dialog/CloseSheetsConfirm'

export interface IUpdateSurveyHeaderForm extends Omit<
  ICreateSurveyHeader,
  'user_id' | 'status_survey'
> {}

interface UpdateSurveyHeaderFormProps {
  surveyData?: ISurveyHeader
}

export function UpdateSurveyHeaderForm({
  surveyData
}: UpdateSurveyHeaderFormProps) {
  //#region  //*=========== Sheets & Dialog Manager ===========
  const { isOpen, close, open } = useOverlayStore()
  const sheetId = 'update-survey-header-sheets'
  const confirmCloseDialogId = `${sheetId}-close-confirm-dialog`
  const { userId } = useAuth()
  //#endregion  //*======== Sheets & Dialog Manager ===========

  //#region  //*=========== Form Handler ===========
  const methods = useForm<IUpdateSurveyHeaderForm>({
    mode: 'onBlur',
    defaultValues: {
      lokasi: surveyData?.lokasi || '',
      nama_pekerjaan: surveyData?.nama_pekerjaan || '',
      nama_survey: surveyData?.nama_survey || ''
    }
  })

  const {
    formState: { isDirty, isValid },
    register,
    reset,
    setValue,
    handleSubmit,
    control
  } = methods
  //#endregion  //*======== Form Handler ===========

  //#region  //*=========== Update Survey Header ===========
  const updateSurveyHeaderMutation = useUpdateSurveyHeaderMutation()
  //#endregion  //*======== Update Survey Header ===========

  const onSubmit = (data: IUpdateSurveyHeaderForm) => {
    if (!surveyData?.id || !userId) return

    updateSurveyHeaderMutation.mutate(
      {
        id: surveyData.id,
        user_id: userId,
        status_survey: surveyData.status_survey,
        ...data
      },
      {
        onSuccess: () => {
          close(sheetId)
          reset()
        }
      }
    )
  }

  const handleClose = () => {
    if (isDirty) {
      open(confirmCloseDialogId)
    } else {
      close(sheetId)
      reset()
    }
  }

  const handleConfirmClose = () => {
    close(sheetId)
    close(confirmCloseDialogId)
    reset()
  }

  useEffect(() => {
    if (surveyData) {
      setValue('nama_survey', surveyData.nama_survey)
      setValue('nama_pekerjaan', surveyData.nama_pekerjaan)
      setValue('lokasi', surveyData.lokasi)
    }
  }, [surveyData, setValue])

  return (
    <>
      <FormProvider {...methods}>
        <Sheet open={isOpen[sheetId]} onOpenChange={handleClose}>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Update Survey Header</SheetTitle>
              <SheetDescription>
                Update survey header information
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="nama_survey">Nama Survey</Label>
                <Input
                  id="nama_survey"
                  placeholder="Masukkan nama survey"
                  {...register('nama_survey', { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama_pekerjaan">Nama Pekerjaan</Label>
                <Controller
                  name="nama_pekerjaan"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      options={jobOptions}
                      placeholder="Pilih nama pekerjaan"
                      value={value ?? undefined}
                      onValueChange={onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lokasi">Lokasi</Label>
                <Controller
                  name="lokasi"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      options={dummyLocations}
                      placeholder="Pilih lokasi"
                      value={value ?? undefined}
                      onValueChange={onChange}
                    />
                  )}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || updateSurveyHeaderMutation.isPending}
                  className="flex-1"
                >
                  {updateSurveyHeaderMutation.isPending
                    ? 'Menyimpan...'
                    : 'Update'}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>

        <CloseSheetsConfirmationDialog
          dialogId={confirmCloseDialogId}
          sheetId={sheetId}
          reset={reset}
        />
      </FormProvider>
    </>
  )
}
