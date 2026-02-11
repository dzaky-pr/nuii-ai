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
import { ICreateCubicle, IDetailCubicle } from '@/lib/types/survey/cubicle'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useUpdateCubicleMutation } from '../../_hooks/@create/cubicle'
import { useGetMaterials } from '../../_hooks/@read/components/materials'
import { CameraDialog } from '../dialog/Camera'
import { CloseSheetsConfirmationDialog } from '../dialog/CloseSheetsConfirm'
import { MapsPickerDialog } from '../dialog/MapsPicker'
import SearchableCombobox from '../SearchableCombobox'

export interface IUpdateCubicleForm extends Omit<
  ICreateCubicle,
  'id_survey_header'
> {}

interface UpdateCubicleFormProps {
  sheetId: string
  surveyId: number
  cubicleData?: IDetailCubicle
}

export function UpdateCubicleForm({
  sheetId,
  surveyId,
  cubicleData
}: UpdateCubicleFormProps) {
  const cameraRef = useRef<any>(null)
  const { materials } = useGetMaterials('cubicle', 'CUBICLE')
  const cubicleTypes = ['Incoming', 'Outgoing', 'Metering']

  //#region  //*=========== Sheets & Dialog Manager ===========
  const { isOpen, close, open } = useOverlayStore()
  const mapsDialogId = `${sheetId}-maps-dialog`
  const camDialogId = `${sheetId}-cam-dialog`
  const confirmCloseDialogId = `${sheetId}-close-confirm-dialog`
  //#endregion  //*======== Sheets & Dialog Manager ===========

  //#region  //*=========== Form Handler ===========
  const methods = useForm<IUpdateCubicleForm>({
    mode: 'onBlur',
    defaultValues: {
      penyulang: cubicleData?.penyulang || '',
      long: cubicleData?.long || '',
      lat: cubicleData?.lat || '',
      foto: cubicleData?.foto || '',
      keterangan: cubicleData?.keterangan || '',
      petugas_survey: cubicleData?.petugas_survey || '',
      has_grounding: cubicleData?.has_grounding || false,
      id_cubicle_material: cubicleData?.id_cubicle_material || undefined,
      cubicle_type: cubicleData?.cubicle_type || undefined
    }
  })

  const {
    formState: { isDirty, isValid },
    register,
    reset,
    setValue,
    handleSubmit,
    control,
    watch
  } = methods
  //#endregion  //*======== Form Handler ===========

  //#region  //*=========== Update Cubicle ===========
  const updateCubicleMutation = useUpdateCubicleMutation(surveyId)
  //#endregion  //*======== Update Cubicle ===========

  const onSubmit = (data: IUpdateCubicleForm) => {
    if (!cubicleData?.id) return

    updateCubicleMutation.mutate(
      {
        id: cubicleData.id,
        data
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
    if (cubicleData) {
      setValue('penyulang', cubicleData.penyulang)
      setValue('long', cubicleData.long)
      setValue('lat', cubicleData.lat)
      setValue('foto', cubicleData.foto)
      setValue('keterangan', cubicleData.keterangan)
      setValue('petugas_survey', cubicleData.petugas_survey)
      setValue('has_grounding', cubicleData.has_grounding)
      setValue(
        'id_cubicle_material',
        cubicleData.id_cubicle_material ?? undefined
      )
      setValue('cubicle_type', cubicleData.cubicle_type ?? undefined)
    }
  }, [cubicleData, setValue])

  return (
    <>
      <FormProvider {...methods}>
        <Sheet open={isOpen[sheetId]} onOpenChange={handleClose}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Update Cubicle</SheetTitle>
              <SheetDescription>Update data cubicle survey</SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
              {/* Cubicle Type */}
              <div className="space-y-2">
                <Label htmlFor="cubicle_type">Tipe Cubicle</Label>
                <Controller
                  name="cubicle_type"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      options={cubicleTypes.map(type => ({
                        value: type,
                        label: type
                      }))}
                      value={value ?? undefined}
                      onValueChange={onChange}
                      placeholder="Pilih tipe cubicle"
                    />
                  )}
                />
              </div>

              {/* Penyulang */}
              <div className="space-y-2">
                <Label htmlFor="penyulang">Penyulang</Label>
                <Input
                  id="penyulang"
                  {...register('penyulang', { required: true })}
                  placeholder="Masukkan penyulang"
                />
              </div>

              {/* Koordinat */}
              <div className="space-y-2">
                <Label>Koordinat</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      {...register('lat', { required: true })}
                      placeholder="Latitude"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      {...register('long', { required: true })}
                      placeholder="Longitude"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => open(mapsDialogId)}
                  >
                    Pilih
                  </Button>
                </div>
              </div>

              {/* Foto */}
              <div className="space-y-2">
                <Label>Foto</Label>
                <div className="flex gap-2">
                  <Input
                    {...register('foto')}
                    placeholder="URL foto atau ambil foto"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => open(camDialogId)}
                  >
                    Ambil Foto
                  </Button>
                </div>
                {watch('foto') && (
                  <div className="mt-2">
                    <Image
                      src={watch('foto')}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* Keterangan */}
              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Input
                  id="keterangan"
                  {...register('keterangan')}
                  placeholder="Masukkan keterangan"
                />
              </div>

              {/* Petugas Survey */}
              <div className="space-y-2">
                <Label htmlFor="petugas_survey">Petugas Survey</Label>
                <Input
                  id="petugas_survey"
                  {...register('petugas_survey', { required: true })}
                  placeholder="Masukkan nama petugas survey"
                />
              </div>

              {/* Has Grounding */}
              <div className="flex items-center space-x-2">
                <Controller
                  name="has_grounding"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="has_grounding"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="has_grounding">Ada Grounding</Label>
              </div>

              {/* Material */}
              <div className="space-y-2">
                <Label>Material</Label>
                <Controller
                  name="id_cubicle_material"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      options={materials || []}
                      value={value?.toString() ?? undefined}
                      onValueChange={val =>
                        onChange(val ? parseInt(val) : undefined)
                      }
                      placeholder="Pilih material"
                    />
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || updateCubicleMutation.isPending}
                >
                  {updateCubicleMutation.isPending ? 'Menyimpan...' : 'Update'}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>

        {/* Dialogs */}
        <MapsPickerDialog dialogId={mapsDialogId} />

        <CameraDialog dialogId={camDialogId} ref={cameraRef} />

        <CloseSheetsConfirmationDialog
          dialogId={confirmCloseDialogId}
          sheetId={sheetId}
          reset={reset}
        />
      </FormProvider>
    </>
  )
}
