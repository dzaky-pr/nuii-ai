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
import { jobOptions, surveyStatusOptions } from '@/lib/constants'
import { dummyLocations } from '@/lib/data/survey'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import {
  EditSurveyHeaderForm as IEditSurveyHeaderForm,
  SurveyHeader,
  UpdateSurveyHeader
} from '@/lib/types/survey'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useGetConductorList } from '../_hooks/@read/useGetConductorList'
import { useUpdateSurveyHeaderMutation } from '../_hooks/@update/useUpdateSurveyHeaderMutation'
import SearchableCombobox from './SearchableCombobox'

export default function EditSurveyHeaderForm({
  surveyHeader
}: {
  surveyHeader?: SurveyHeader
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const { isOpen, close } = useOverlayStore()
  const modalId = 'edit-survey-header-modal'

  const { conductorList, loadingConductorList } = useGetConductorList()

  //#region  //*=========== Form ===========
  const methods = useForm<IEditSurveyHeaderForm>({ mode: 'onTouched' })

  const {
    formState: { isDirty, errors, isValid },
    register,
    reset,
    handleSubmit,
    control
  } = methods

  useEffect(() => {
    if (surveyHeader) {
      const { id, created_at, updated_at, deleted_at, ...survey } = surveyHeader
      reset(survey)
    }
  }, [reset, surveyHeader])
  //#endregion  //*======== Form ===========

  const handleCloseSheet = () => {
    if (isDirty) {
      setShowConfirmDialog(true)
    } else {
      reset()
      close(modalId)
    }
  }

  //#region  //*=========== Submit Form Handler ===========
  const { mutate, isPending, isSuccess } = useUpdateSurveyHeaderMutation({
    surveyId: surveyHeader?.id.toString() ?? '0'
  })

  useEffect(() => {
    if (isSuccess) {
      close(modalId)
      reset()
    }
  }, [close, isSuccess, reset])

  const submitHandler = (data: IEditSurveyHeaderForm) => {
    const payload: UpdateSurveyHeader = {
      id_header: surveyHeader?.id ?? 0,
      header: {
        ...data,
        id_material_konduktor: Number(data.id_material_konduktor)
      }
    }

    mutate(payload)
  }
  //#endregion  //*======== Submit Form Handler ===========

  return (
    <div className="p-4">
      <Sheet
        open={isOpen[modalId]}
        onOpenChange={isOpen => !isOpen && close(modalId)}
      >
        <SheetContent
          className="w-full sm:max-w-2xl overflow-y-auto"
          onInteractOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => {
            if (isDirty) {
              e.preventDefault()
              handleCloseSheet()
            }
          }}
        >
          <SheetHeader>
            <SheetTitle>Edit Header Survey</SheetTitle>
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
                <Label htmlFor="namaSurvey">Nama Survey</Label>
                <Input
                  placeholder="Masukkan Nama Survey"
                  {...register('nama_survey', {
                    required: true
                  })}
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
                  name="id_material_konduktor"
                  control={control}
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

              {/* Status */}
              <div className="grid gap-2">
                <Label>Status</Label>
                <Controller
                  name="status_survey"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      options={surveyStatusOptions}
                      onValueChange={onChange}
                      placeholder="Pilih Status"
                    />
                  )}
                />
              </div>

              {/* User ID */}
              <div className="grid gap-2">
                <Label htmlFor="userId">ID Pengguna</Label>
                <Input readOnly {...register('user_id')} />
              </div>

              <Button
                type="submit"
                onClick={() => console.log(errors)}
                disabled={!isValid || isPending}
              >
                Simpan Survey
              </Button>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>

      {showConfirmDialog && (
        <div className="fixed z-[9999] inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <div className="bg-background border border-muted p-6 rounded-lg max-w-sm">
            <h3 className="font-bold text-lg">Batal Mengisi Form?</h3>
            <p className="py-4">Data yang sudah diisi akan hilang</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  reset()
                  close(modalId)
                  setShowConfirmDialog(false)
                }}
              >
                Batalkan
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Lanjutkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
