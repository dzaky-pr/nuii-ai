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
import { jobOptions } from '@/lib/constants'
import { dummyLocations } from '@/lib/data/survey'
import useRouteStore from '@/lib/hooks/useRouteStore'
import { IBatch } from '@/lib/types/maps'
import { SurveyHeader } from '@/lib/types/survey'
import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import SearchableSelect from '../../_components/SearchableSelect'
import { useGetConductorList } from '../../_hooks/@read/useGetConductorList'
import { useCreateBatchMutation } from '../_hooks/useCreateBatchMutation'

interface SurveyHeaderForm extends SurveyHeader {
  penyulang: string
}

export default function CreateBatchForm({
  onSuccess
}: {
  onSuccess: () => void
}) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)

  //#region  //*=========== Form ===========
  const methods = useForm<SurveyHeaderForm>({ mode: 'onBlur' })

  const {
    control,
    formState: { errors, isDirty, isValid },
    handleSubmit,
    reset,
    register,
    setValue
  } = methods
  //#endregion  //*======== Form ===========

  const { conductorList, loadingConductorList } = useGetConductorList()
  const { estimation } = useRouteStore()

  //#region  //*=========== Utility ===========
  function handleCloseSheet() {
    if (isDirty) {
      setShowConfirmDialog(true)
    } else {
      reset()
      setIsSheetOpen(false)
    }
  }
  //#endregion  //*======== Utility ===========

  //#region  //*=========== Submit Form Handler ===========
  const { mutate, isPending, isSuccess } = useCreateBatchMutation()
  const { userId } = useAuth()

  function submitHandler(data: SurveyHeaderForm) {
    if (!estimation?.poles) {
      toast.info('Data tiang dalam estimasi tidak ditemukan!')
      return
    }
    const payload: IBatch = {
      header: {
        ...data,
        user_id: userId ?? '',
        id_material_konduktor: Number(data.id_material_konduktor)
      },
      details: estimation?.poles.map(pole => ({
        id_material_tiang: pole.id_tiang,
        id_konstruksi: pole.id_konstruksi,
        penyulang: data.penyulang,
        panjang_jaringan: pole.panjang_jaringan,
        long: String(pole.longitude),
        lat: String(pole.latitude),
        petugas_survey: '-',
        foto: '-'
      }))
    }
    mutate(payload)
  }

  useEffect(() => {
    if (isSuccess) {
      reset()
      onSuccess()
      setIsSheetOpen(false)
    }
  }, [isSuccess, reset, onSuccess])
  //#endregion  //*======== Submit Form Handler ===========

  return (
    <>
      <Sheet
        open={isSheetOpen}
        onOpenChange={open => {
          if (!open) {
            handleCloseSheet()
          } else {
            setIsSheetOpen(true)
          }
        }}
      >
        <SheetTrigger asChild>
          <Button
            size="sm"
            className="bg-green-500 text-white hover:bg-green-600 w-fit self-center"
          >
            Simpan
          </Button>
        </SheetTrigger>
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
                <Label required htmlFor="nama-survey">
                  Nama Survey
                </Label>
                <Input
                  placeholder="Masukkan Nama Survey"
                  maxLength={60}
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
                  render={({ field: { onChange } }) => (
                    <SearchableSelect
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
                <Label required htmlFor="lokasi">
                  Lokasi/ULP
                </Label>
                <Controller
                  name="lokasi"
                  control={control}
                  render={() => (
                    <SearchableSelect
                      options={dummyLocations}
                      onValueChange={value => {
                        setValue('lokasi', value, {
                          shouldValidate: true
                        })
                      }}
                      placeholder="Pilih Lokasi"
                    />
                  )}
                />
              </div>

              {/* Penyulang */}
              <div className="grid gap-2">
                <Label required htmlFor="penyulang">
                  Penyulang
                </Label>
                <Input
                  placeholder="Masukkan Penyulang"
                  maxLength={60}
                  {...register('penyulang', { required: true })}
                />
              </div>

              {/* Jenis Konduktor */}
              <div className="grid gap-2">
                <Label required htmlFor="konduktor">
                  Jenis Konduktor
                </Label>
                <Controller
                  name="id_material_konduktor"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => (
                    <SearchableSelect
                      isLoading={loadingConductorList}
                      options={conductorList}
                      onValueChange={onChange}
                      placeholder="Pilih Jenis Konduktor"
                    />
                  )}
                />
              </div>
              <Button
                type="submit"
                onClick={() => {
                  errors && console.log('Error: ', errors)
                }}
                disabled={isPending || !isValid}
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
                  setIsSheetOpen(false)
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
    </>
  )
}
