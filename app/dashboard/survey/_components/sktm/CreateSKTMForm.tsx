import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { ICreateFirstSKTM } from '@/lib/types/survey'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCreateSKTMMutation } from '../../_hooks/@create/sktm'
import { useGetMaterials } from '../../_hooks/@read/components/materials'
import SearchableCombobox from '../SearchableCombobox'
import { CameraDialog } from '../dialog/Camera'
import { CloseSheetsConfirmationDialog } from '../dialog/CloseSheetsConfirm'
import { MapsPickerDialog } from '../dialog/MapsPicker'

interface ICreateSKTMForm
  extends Omit<ICreateFirstSKTM, 'id_termination_masuk'> {
  id_termination: number
}

export function CreateSKTMForm({
  sheetId,
  surveyId
}: {
  sheetId: string
  surveyId: number
}) {
  const { survey_id } = useParams()

  const cameraRef = useRef<any>(null)
  const { materials, loadingMaterials } = useGetMaterials('terminasi', 'SKTM')

  //#region  //*=========== Sheets & Dialog Manager ===========
  const { isOpen, close, open } = useOverlayStore()
  const mapsDialogId = `${sheetId}-maps-dialog`
  const camDialogId = `${sheetId}-cam-dialog`
  const confirmCloseDialogId = `${sheetId}-close-confirm-dialog`
  //#endregion  //*======== Sheets & Dialog Manager ===========

  //#region  //*=========== Form Handler ===========
  const methods = useForm<ICreateSKTMForm>({
    mode: 'onBlur',
    defaultValues: {
      id_survey_header: surveyId,
      penyulang: '',
      long: '',
      lat: '',
      foto: '',
      keterangan: '',
      petugas_survey: '',
      has_arrester: false
    }
  })

  const {
    formState: { isDirty, isValid, errors },
    setValue,
    register,
    reset,
    handleSubmit,
    control,
    watch
  } = methods

  const photo = watch('foto')
  const location = watch('lat') || watch('long')
  //#endregion  //*======== Form Handler ===========

  //#region  //*=========== Helper Utils ===========
  function handleCloseSheet() {
    if (isDirty) {
      close(confirmCloseDialogId)
    } else {
      reset()
      close(sheetId)
    }
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setValue('lat', position.coords.latitude.toString(), {
            shouldDirty: true,
            shouldValidate: true
          })
          setValue('long', position.coords.longitude.toString(), {
            shouldDirty: true,
            shouldValidate: true
          })
          open(mapsDialogId)
        },
        error => {
          console.error('Error mendapatkan lokasi:', error)
          toast.error('Gagal mendapatkan lokasi!')
        }
      )
    } else {
      toast.error('Browser tidak mendukung geolokasi!')
    }
  }
  //#endregion  //*======== Helper Utils ===========

  //#region  //*=========== Submit Form Handler ===========
  const { mutate, isPending, isSuccess } = useCreateSKTMMutation(surveyId)

  useEffect(() => {
    if (isSuccess) {
      close(sheetId)
      reset()
    }
  }, [reset, isSuccess, close, sheetId])

  function submitHandler(data: ICreateSKTMForm) {
    const { id_termination, ...rest } = data

    const payload = {
      ...rest,
      id_survey_header: Number(survey_id),
      id_termination_masuk: id_termination
    } satisfies ICreateFirstSKTM

    mutate(payload)
  }
  //#endregion  //*======== Submit Form Handler ===========

  return (
    <>
      <Sheet
        open={isOpen[sheetId]}
        onOpenChange={isOpen => !isOpen && close(sheetId)}
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
            <SheetTitle>Form Tambah SKTM</SheetTitle>
            <SheetDescription>
              Isi semua data dengan lengkap dan akurat.
            </SheetDescription>
          </SheetHeader>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="grid gap-4 py-4"
            >
              {/* Nama Petugas */}
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label required htmlFor="namaPetugas">
                    Nama Petugas
                  </Label>
                </div>
                <Input
                  placeholder="Masukkan nama petugas survey"
                  {...register('petugas_survey', { required: true })}
                />
              </div>

              {/* Keterangan */}
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label required htmlFor="keterangan">
                    Keterangan
                  </Label>
                </div>
                <Input
                  placeholder="Masukkan keterangan survey"
                  {...register('keterangan', { required: true })}
                />
              </div>

              {/* ID Termination */}
              <div className="grid gap-2">
                <Label required htmlFor="termination">
                  Material Terminasi
                </Label>
                <Controller
                  name="id_termination"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      isLoading={loadingMaterials}
                      options={materials}
                      onValueChange={onChange}
                      placeholder="Pilih material terminasi"
                    />
                  )}
                />
              </div>

              {/* Penyulang */}
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label required htmlFor="penyulang">
                    Penyulang
                  </Label>
                </div>
                <Input
                  placeholder="Masukkan penyulang"
                  {...register('penyulang', { required: true })}
                />
              </div>

              {/* Panjang Jaringan */}
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label required htmlFor="panjangJaringan">
                    Panjang Jaringan
                  </Label>
                </div>
                <Input
                  type="number"
                  min="1"
                  placeholder="Masukkan panjang jaringan"
                  {...register('panjang_jaringan', {
                    required: true,
                    valueAsNumber: true
                  })}
                />
              </div>

              {/* Diameter Kabel */}
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label required htmlFor="diameterKabel">
                    Diameter Kabel
                  </Label>
                </div>
                <Input
                  type="number"
                  min="1"
                  placeholder="Masukkan diameter kabel"
                  {...register('diameter_kabel', {
                    required: true,
                    valueAsNumber: true
                  })}
                />
              </div>

              {/* With Arrester */}
              <div className="flex gap-2">
                <Label htmlFor="arrester">Dengan Arrester?</Label>
                <Controller
                  name="has_arrester"
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox checked={value} onCheckedChange={onChange} />
                  )}
                />
              </div>

              {/* Koordinat */}
              <div className="grid gap-2">
                <Label required htmlFor="koordinat">
                  Koordinat
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Latitude"
                    value={watch('lat') ?? ''}
                    readOnly
                  />
                  <Input
                    placeholder="Longitude"
                    value={watch('long') ?? ''}
                    readOnly
                  />
                  <Button
                    type="button"
                    onClick={getLocation}
                    variant={location ? 'secondary' : 'default'}
                  >
                    {location ? 'Ubah Lokasi' : 'Ambil Lokasi'}
                  </Button>
                </div>
              </div>

              {/* Foto */}
              <div className="grid gap-2">
                <Label required htmlFor="foto">
                  Foto Titik Survey
                </Label>
                {photo ? (
                  <>
                    <Image
                      src={photo}
                      alt="Foto Survey"
                      width={320}
                      height={192}
                      className="object-cover"
                    />
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => {
                        setValue('foto', '')
                        open(camDialogId)
                      }}
                    >
                      Ambil Ulang Foto
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => open(camDialogId)}
                  >
                    Ambil Foto
                  </Button>
                )}
              </div>

              <Button
                size="sm"
                type="submit"
                onClick={() => {
                  if (errors) {
                    console.log('Error: ', errors)
                  }
                }}
                disabled={!isValid || isPending || photo === ''}
              >
                Tambah SKTM
              </Button>

              <MapsPickerDialog dialogId={mapsDialogId} />
              <CameraDialog dialogId={camDialogId} ref={cameraRef} />
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
