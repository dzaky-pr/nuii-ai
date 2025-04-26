import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import {
  EditSurveyDetailForm as IEditSurveyDetailForm,
  SurveyDetailExtended,
  UpdateSurveyDetail
} from '@/lib/types/survey'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Camera } from 'react-camera-pro'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useGetConstructionList } from '../_hooks/@read/useGetConstructionList'
import { useGetGroundingList } from '../_hooks/@read/useGetGroundingList'
import { useGetPoleList } from '../_hooks/@read/useGetPoleList'
import { useGetTiangList } from '../_hooks/@read/useGetTiangList'
import { useUpdateSurveyDetailMutation } from '../_hooks/@update/useUpdateSurveyDetailMutation'
import MapPicker from './MapPicker'
import SearchableSelect, { Option } from './SearchableSelect'

export default function EditSurveyDetailForm({
  surveyDetail
}: {
  surveyDetail?: SurveyDetailExtended
}) {
  //#region  //*=========== Initial State & Ref ===========
  const [showMapDialog, setShowMapDialog] = useState(false)
  const [showCameraDialog, setShowCameraDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedConstruction, setSelectedConstruction] = useState<
    Option | undefined
  >()
  const [disableSelectGrounding, setDisableSelectGrounding] =
    useState<boolean>(false)

  const cameraRef = useRef<any>(null)
  //#endregion  //*======== Initial State & Ref ===========

  const { isOpen, close } = useOverlayStore()
  const modalId = 'edit-survey-detail-modal'

  //#region  //*=========== Form ===========
  const methods = useForm<IEditSurveyDetailForm>({ mode: 'onTouched' })

  const {
    formState: { isDirty, errors, isValid },
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control
  } = methods

  const locationValue = watch('lat') || watch('long')
  const photoValue = watch('foto')

  useEffect(() => {
    if (surveyDetail) {
      const { id, created_at, updated_at, deleted_at, ...survey } = surveyDetail
      reset(survey)
    }
  }, [reset, surveyDetail])
  //#endregion  //*======== Form ===========

  //#region  //*=========== Get Data Hooks ===========
  const { listTiang, loadingListTiang } = useGetTiangList()
  const { constructionList, loadingConstructionList } = useGetConstructionList()
  const { groundingList, loadingGroundingList } = useGetGroundingList()
  const { poleList, loadingPoleList } = useGetPoleList()
  //#endregion  //*======== Get Data Hooks ===========

  useEffect(() => {
    if (selectedConstruction?.label) {
      const label = selectedConstruction.label.toLowerCase()

      if (label.includes('tm-11')) {
        setDisableSelectGrounding(true)
        setValue('id_grounding_termination', 1)
      } else if (label.includes('arr')) {
        setDisableSelectGrounding(true)
        setValue('id_grounding_termination', 2)
      } else {
        setDisableSelectGrounding(false)
      }
    }
  }, [selectedConstruction, setValue])

  useEffect(() => {
    if (!showCameraDialog) {
      cameraRef.current = null
    }
  }, [showCameraDialog])

  //#region  //*=========== Utility ===========
  const handleCloseSheet = () => {
    if (isDirty) {
      setShowConfirmDialog(true)
    } else {
      reset()
      close(modalId)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setValue('lat', position.coords.latitude.toString())
          setValue('long', position.coords.longitude.toString())
          setShowMapDialog(true)
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
  //#endregion  //*======== Utility ===========

  //#region  //*=========== Submit Form Handler ===========
  const { mutate, isPending, isSuccess } = useUpdateSurveyDetailMutation({
    surveyId: surveyDetail?.id.toString() ?? '0'
  })

  useEffect(() => {
    if (isSuccess) {
      close(modalId)
      reset()
    }
  }, [close, isSuccess, reset])

  const submitHandler = (data: IEditSurveyDetailForm) => {
    const payload: UpdateSurveyDetail = {
      id_detail: surveyDetail?.id ?? 0,
      detail: {
        ...data,

        id_konstruksi: Number(data.id_konstruksi),
        id_material_tiang: Number(data.id_material_tiang),
        ...(data.id_pole_supporter
          ? { id_pole_supporter: data.id_pole_supporter }
          : {}),
        ...(data.id_grounding_termination
          ? { id_grounding_termination: Number(data.id_grounding_termination) }
          : {})
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
          <VisuallyHidden>
            <DialogTitle>Edit Detail Survey</DialogTitle>
          </VisuallyHidden>
          <h2 className="text-lg font-bold mb-4">Edit Detail Survey</h2>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="grid gap-4 py-4"
            >
              {/* Penyulang */}
              <div className="grid gap-2">
                <Label htmlFor="penyulang">Penyulang</Label>
                <Input
                  id="penyulang"
                  maxLength={60}
                  {...register('penyulang')}
                />
              </div>

              {/* Tiang */}
              <div className="grid gap-2">
                <Label>Tiang</Label>
                <Controller
                  name="id_material_tiang"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableSelect
                      value={String(value)}
                      isLoading={loadingListTiang}
                      options={listTiang}
                      onValueChange={onChange}
                      placeholder="Pilih Tiang"
                    />
                  )}
                />
              </div>

              {/* Konstruksi */}
              <div className="grid gap-2">
                <Label htmlFor="konstruksi">Konstruksi</Label>
                <Controller
                  name="id_konstruksi"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableSelect
                      value={String(value)}
                      isLoading={loadingConstructionList}
                      options={constructionList}
                      onValueChange={(newValue, option) => {
                        onChange(newValue)
                        setSelectedConstruction(option)
                      }}
                      placeholder="Pilih Konstruksi"
                    />
                  )}
                />
              </div>

              {/* Panjang Jaringan */}
              <div className="grid gap-2">
                <Label htmlFor="panjangJaringan">
                  Panjang Jaringan (meter)
                </Label>
                <Input
                  id="panjang_jaringan"
                  type="number"
                  max={999}
                  {...register('panjang_jaringan', {
                    valueAsNumber: true
                  })}
                />
              </div>

              {/* Pole Suporter */}
              <div className="grid gap-2">
                <Label>Pole Suporter</Label>
                <Controller
                  name="id_pole_supporter"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableSelect
                      value={String(value)}
                      isLoading={loadingPoleList}
                      options={poleList}
                      onValueChange={onChange}
                      placeholder="Pilih Pole Suporter"
                    />
                  )}
                />
              </div>

              {/* Grounding */}
              <div className="grid gap-2">
                <Label>Grounding</Label>
                <Controller
                  name="id_grounding_termination"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableSelect
                      isDisabled={disableSelectGrounding}
                      isLoading={loadingGroundingList}
                      options={groundingList}
                      value={String(value)}
                      onValueChange={onChange}
                      placeholder="Pilih Tipe Grounding"
                    />
                  )}
                />
              </div>

              {/* Koordinat */}
              <div className="grid gap-2">
                <Label>Koordinat</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Latitude"
                    value={watch('lat') || ''}
                    readOnly
                  />
                  <Input
                    placeholder="Longitude"
                    value={watch('long') || ''}
                    readOnly
                  />
                  <Button
                    type="button"
                    onClick={getLocation}
                    variant={locationValue ? 'secondary' : 'default'}
                  >
                    {locationValue ? 'Ubah Lokasi' : 'Ambil Lokasi'}
                  </Button>
                </div>
              </div>

              {/* Modal Peta dengan Dialog shadcn */}
              <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
                <DialogPortal>
                  <DialogContent className="bg-background p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Atur Lokasi di Peta</DialogTitle>
                      <DialogDescription>
                        Geser peta untuk menyesuaikan lokasi yang diinginkan.
                      </DialogDescription>
                    </DialogHeader>
                    <MapPicker
                      initialPosition={{
                        lat: Number(surveyDetail?.lat),
                        lng: Number(surveyDetail?.long)
                      }}
                      onPositionChange={newPos => {
                        setValue('lat', newPos.lat.toString())
                        setValue('long', newPos.lng.toString())
                      }}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <Button onClick={() => setShowMapDialog(false)}>
                        Simpan Lokasi
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setValue('lat', surveyDetail?.lat || '')
                          setValue('long', surveyDetail?.long || '')
                          setShowMapDialog(false)
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  </DialogContent>
                </DialogPortal>
              </Dialog>

              {/* Foto */}
              <div className="grid gap-2">
                <Label>Foto Titik Survey</Label>
                {photoValue ? (
                  <>
                    <Image
                      src={photoValue}
                      alt="Foto Survey"
                      width={320}
                      height={192}
                      className="object-cover"
                    />
                    <Button type="button" onClick={() => setValue('foto', '')}>
                      Ambil Ulang Foto
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setShowCameraDialog(true)}
                  >
                    Ambil Foto
                  </Button>
                )}
              </div>

              {/* Dialog kamera */}
              <Dialog
                open={showCameraDialog}
                onOpenChange={setShowCameraDialog}
              >
                <DialogPortal>
                  <DialogContent className="bg-background p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Ambil Foto</DialogTitle>
                      <DialogDescription>
                        Pastikan kamera menghadap dengan benar.
                      </DialogDescription>
                    </DialogHeader>
                    <Camera
                      ref={cameraRef}
                      aspectRatio={1 / 1}
                      facingMode="environment"
                      errorMessages={{
                        noCameraAccessible: 'No camera device accessible',
                        permissionDenied: 'Permission denied',
                        switchCamera: 'Switch camera',
                        canvas: 'Canvas not supported'
                      }}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        onClick={() => {
                          const photo = cameraRef.current.takePhoto()
                          setValue('foto', photo)
                          setShowCameraDialog(false)
                        }}
                      >
                        Ambil Foto
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCameraDialog(false)}
                      >
                        Batal
                      </Button>
                    </div>
                  </DialogContent>
                </DialogPortal>
              </Dialog>

              {/* Keterangan */}
              <div className="grid gap-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Input
                  id="keterangan"
                  maxLength={60}
                  {...register('keterangan')}
                />
              </div>

              {/* Petugas Survey */}
              <div className="grid gap-2">
                <Label htmlFor="petugas">Petugas Survey</Label>
                <Input
                  id="petugas"
                  maxLength={60}
                  {...register('petugas_survey')}
                />
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
