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
import { ICreateSurveyHeader } from '@/lib/types/survey'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useCreateSurveyHeaderMutation } from '../../_hooks/@create/survey-header'
import SearchableCombobox from '../SearchableCombobox'
import { CloseSheetsConfirmationDialog } from '../dialog/CloseSheetsConfirm'

export interface ICreateSurveyHeaderForm
  extends Omit<ICreateSurveyHeader, 'user_id' | 'status_survey'> {}

export function CreateSurveyHeaderForm() {
  //#region  //*=========== Sheets & Dialog Manager ===========
  const { isOpen, close, open } = useOverlayStore()
  const sheetId = 'create-survey-header-sheets'
  const confirmCloseDialogId = `${sheetId}-close-confirm-dialog`
  //#endregion  //*======== Sheets & Dialog Manager ===========

  //#region  //*=========== Form Handler ===========
  const methods = useForm<ICreateSurveyHeaderForm>({
    mode: 'onBlur',
    defaultValues: {
      lokasi: '',
      nama_pekerjaan: '',
      nama_survey: ''
    }
  })

  const {
    formState: { isDirty, isValid, errors },
    register,
    reset,
    setValue,
    handleSubmit,
    control
  } = methods
  //#endregion  //*======== Form Handler ===========

  function handleCloseSheet() {
    if (isDirty) {
      open(confirmCloseDialogId)
    } else {
      reset()
      close(sheetId)
    }
  }

  //#region  //*=========== Submit Form Handler ===========
  const { mutate, isPending, isSuccess } = useCreateSurveyHeaderMutation()
  const { userId } = useAuth()

  useEffect(() => {
    if (isSuccess) {
      close(sheetId)
      reset()
    }
  }, [reset, isSuccess, close])

  function submitHandler(data: ICreateSurveyHeaderForm) {
    const payload = {
      ...data,
      user_id: userId ?? '',
      status_survey: 'Belum_Disetujui'
    } satisfies ICreateSurveyHeader

    mutate(payload)
  }
  //#endregion  //*======== Submit Form Handler ===========

  return (
    <>
      <Sheet
        open={isOpen[sheetId]}
        onOpenChange={isOpen => !isOpen && handleCloseSheet()}
      >
        <SheetContent
          className="w-full sm:max-w-sm overflow-y-auto"
          onInteractOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => {
            if (isDirty) {
              e.preventDefault()
              handleCloseSheet()
            }
          }}
        >
          <SheetHeader>
            <SheetTitle>Form Survey Lapangan</SheetTitle>
            <SheetDescription>
              Isi semua data dengan lengkap dan akurat
            </SheetDescription>
          </SheetHeader>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="grid gap-4 py-4"
            >
              {/* Nama Survey */}
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label required htmlFor="survey-name">
                    Nama Survey
                  </Label>
                </div>
                <Input
                  placeholder="Masukkan nama survey"
                  {...register('nama_survey', { required: true })}
                />
              </div>

              {/* Nama Pekerjaan */}
              <div className="grid gap-2">
                <Label required htmlFor="pekerjaan">
                  Nama Pekerjaan
                </Label>
                <Controller
                  name="nama_pekerjaan"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      options={jobOptions.map(item => ({
                        value: item,
                        label: item
                      }))}
                      onValueChange={onChange}
                      placeholder="Pilih nama pekerjaan"
                    />
                  )}
                />
              </div>

              {/* Lokasi/ULP */}
              <div className="grid gap-2">
                <Label required htmlFor="lokasi">
                  Lokasi/ULP
                </Label>
                <Controller
                  name="lokasi"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      options={dummyLocations}
                      onValueChange={value => {
                        setValue('lokasi', value ?? '', {
                          shouldValidate: true
                        })
                      }}
                      placeholder="Pilih lokasi"
                    />
                  )}
                />
              </div>

              <Button
                type="submit"
                onClick={() => {
                  errors && console.log('Error: ', errors)
                }}
                disabled={!isValid || isPending}
              >
                Simpan Survey
              </Button>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>
      <CloseSheetsConfirmationDialog
        reset={reset}
        sheetId={sheetId}
        dialogId={confirmCloseDialogId}
      />
    </>
  )
}
