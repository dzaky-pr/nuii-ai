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
import { ICreateCubicle } from '@/lib/types/survey/cubicle'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCreateCubicleMutation } from '../../_hooks/@create/cubicle'
import { useGetMaterials } from '../../_hooks/@read/components/materials'
import { CameraDialog } from '../dialog/Camera'
import { CloseSheetsConfirmationDialog } from '../dialog/CloseSheetsConfirm'
import { MapsPickerDialog } from '../dialog/MapsPicker'
import SearchableCombobox from '../SearchableCombobox'
export function CreateCubicleForm({
  sheetId,
  surveyId
}: {
  sheetId: string
  surveyId: number
}) {
  const cameraRef = useRef<any>(null)
  const { materials, loadingMaterials } = useGetMaterials(
    'accessory',
    'CUBICLE'
  )

  //#region  //*=========== Sheets & Dialog Manager ===========
  const { isOpen, close, open } = useOverlayStore()
  const mapsDialogId = `${sheetId}-maps-dialog`
  const camDialogId = `${sheetId}-cam-dialog`
  const confirmCloseDialogId = `${sheetId}-close-confirm-dialog`
  //#endregion  //*======== Sheets & Dialog Manager ===========

  //#region  //*=========== Form Handler ===========
  const methods = useForm<ICreateCubicle>({
    mode: 'onBlur',
    defaultValues: {
      id_survey_header: surveyId,
      penyulang: '',
      long: '',
      lat: '',
      foto: '',
      keterangan: '',
      petugas_survey: '',
      has_grounding: false,
      id_cubicle_material: 0,
      cubicle_type: ''
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
          setValue('lat', position.coords.latitude.toString())
          setValue('long', position.coords.longitude.toString())
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
  const { mutate, isPending, isSuccess } = useCreateCubicleMutation(surveyId)

  useEffect(() => {
    if (isSuccess) {
      close(sheetId)
      reset()
    }
  }, [reset, isSuccess, close, sheetId])

  function submitHandler(data: ICreateCubicle) {
    const payload = {
      ...data,
      ...(data.id_cubicle_material !== 0
        ? { id_cubicle_material: data.id_cubicle_material }
        : undefined),
      ...(data.cubicle_type !== ''
        ? { id_cubicle_material: data.cubicle_type }
        : undefined)
    }

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
            <SheetTitle>Form Tambah Cubicle</SheetTitle>
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
                  <Label htmlFor="keterangan">Keterangan</Label>
                </div>
                <Input
                  placeholder="Masukkan keterangan survey"
                  {...register('keterangan', { required: true })}
                />
              </div>

              {/* ID Material Tiang */}
              <div className="grid gap-2">
                <Label htmlFor="tiang">Material Cubicle</Label>
                <Controller
                  name="id_cubicle_material"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      options={materials}
                      onValueChange={onChange}
                      placeholder="Pilih material cubicle"
                    />
                  )}
                />
              </div>

              {watch('id_cubicle_material') !== 0 && (
                <>
                  {/* Tipe Cubicle */}
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <Label htmlFor="keterangan">Tipe Cubicle</Label>
                    </div>
                    <Input
                      placeholder="Masukkan tipe cubicle"
                      {...register('cubicle_type')}
                    />
                  </div>
                </>
              )}

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

              {/* With Grounding */}
              <div className="flex gap-2">
                <Label required htmlFor="arrester">
                  Dengan Grounding?
                </Label>
                <Controller
                  name="has_grounding"
                  control={control}
                  rules={{ required: true }}
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
                      onClick={() => reset({ foto: '' })}
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
                  errors && console.log('Error: ', errors)
                }}
                disabled={!isValid || isPending || loadingMaterials}
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
