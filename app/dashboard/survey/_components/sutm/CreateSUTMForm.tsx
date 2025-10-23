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
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { ICreateFirstSUTM } from '@/lib/types/survey'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCreateSUTMMutation } from '../../_hooks/@create/sutm'
import { useGetConstructions } from '../../_hooks/@read/components/constructions'
import { useGetGroundings } from '../../_hooks/@read/components/groundings'
import { useGetListTiang } from '../../_hooks/@read/components/list-tiang'
import { useGetPoles } from '../../_hooks/@read/components/poles'
import SearchableCombobox from '../SearchableCombobox'
import { CameraDialog } from '../dialog/Camera'
import { CloseSheetsConfirmationDialog } from '../dialog/CloseSheetsConfirm'
import { MapsPickerDialog } from '../dialog/MapsPicker'

export function CreateSUTMForm({
  sheetId,
  surveyId
}: {
  sheetId: string
  surveyId: number
}) {
  const cameraRef = useRef<any>(null)

  const { listTiang, loadingListTiang } = useGetListTiang()
  const { poles, loadingPoles } = useGetPoles()
  const {constructions, loadingConstructions} = useGetConstructions()
  const {groundings, loadingGroundings} = useGetGroundings()

  //#region  //*=========== Sheets & Dialog Manager ===========
  const { isOpen, close, open } = useOverlayStore()
  const mapsDialogId = `${sheetId}-maps-dialog`
  const camDialogId = `${sheetId}-cam-dialog`
  const confirmCloseDialogId = `${sheetId}-close-confirm-dialog`
  //#endregion  //*======== Sheets & Dialog Manager ===========

  //#region  //*=========== Form Handler ===========
  const methods = useForm<ICreateFirstSUTM>({
    mode: 'onBlur',
    defaultValues: {
      id_survey_header: surveyId,
      penyulang: '',
      long: '',
      lat: '',
      foto: '',
      keterangan: '',
      petugas_survey: ''
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
  const { mutate, isPending, isSuccess } = useCreateSUTMMutation(surveyId)

  useEffect(() => {
    if (isSuccess) {
      close(sheetId)
      reset()
    }
  }, [isSuccess, close, reset, sheetId])

  function submitHandler(data: ICreateFirstSUTM) {
    mutate(data)
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
            <SheetTitle>Form Tambah SUTM</SheetTitle>
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

              {/* ID Material Tiang */}
              <div className="grid gap-2">
                <Label required htmlFor="tiang">
                  Material Tiang
                </Label>
                <Controller
                  name="id_material_tiang"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      options={listTiang}
                      onValueChange={onChange}
                      placeholder="Pilih material tiang"
                    />
                  )}
                />
              </div>

              {/* ID Konstruksi */}
              <div className="grid gap-2">
                <Label required htmlFor="konstruksi">
                  Konstruksi
                </Label>
                <Controller
                  name="id_konstruksi"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      options={constructions}
                      onValueChange={onChange}
                      placeholder="Pilih konstruksi"
                    />
                  )}
                />
              </div>

              {/* ID Pole Supporter */}
              <div className="grid gap-2">
                <Label required htmlFor="konstruksi">
                  Pole Supporter
                </Label>
                <Controller
                  name="id_pole_supporter"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      options={poles}
                      onValueChange={onChange}
                      placeholder="Pilih pole supporter"
                    />
                  )}
                />
              </div>

              {/* ID Grounding */}
              <div className="grid gap-2">
                <Label required htmlFor="grounding">
                  Grounding
                </Label>
                <Controller
                  name="id_grounding_termination"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      options={groundings}
                      onValueChange={onChange}
                      placeholder="Pilih grounding"
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
                disabled={
                  !isValid ||
                  isPending ||
                  loadingListTiang ||
                  loadingConstructions ||
                  loadingGroundings ||
                  loadingPoles
                }
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
