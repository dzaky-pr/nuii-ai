'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Camera } from 'react-camera-pro'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import MapPicker from './MapPicker'
import SearchableCombobox, { Option } from './SearchableCombobox'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle
} from '@/components/ui/dialog'
import { jobOptions } from '@/lib/constants'
import { dummyLocations } from '@/lib/data/survey'
import {
  CreateExistingSurvey,
  CreateNewSurvey,
  CreateSurveyForm as ICreateSurveyForm
} from '@/lib/types/survey'
import { useAuth } from '@clerk/nextjs'
import { useCreateExistingSurveyMutation } from '../_hooks/@create/useCreateExistingSurveyMutation'
import { useCreateNewSurveyMutation } from '../_hooks/@create/useCreateNewSurveyMutation'
import { useGetConductorList } from '../_hooks/@read/useGetConductorList'
import { useGetConstructionList } from '../_hooks/@read/useGetConstructionList'
import { useGetGroundingList } from '../_hooks/@read/useGetGroundingList'
import { useGetPoleList } from '../_hooks/@read/useGetPoleList'
import { useGetSurveyDetail } from '../_hooks/@read/useGetSurveyDetail'
import { useGetSurveyNameList } from '../_hooks/@read/useGetSurveyNameList'
import { useGetTiangList } from '../_hooks/@read/useGetTiangList'

export default function CreateSurveyForm() {
  //#region  //*=========== Initial State & Ref ===========
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const [isCustomSurvey, setIsCustomSurvey] = useState<boolean>(false)
  const [showMapDialog, setShowMapDialog] = useState<boolean>(false)
  const [showCameraDialog, setShowCameraDialog] = useState<boolean>(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)
  const [selectedConstruction, setSelectedConstruction] = useState<
    Option | undefined
  >()
  const [disableSelectGrounding, setDisableSelectGrounding] =
    useState<boolean>(false)

  const cameraRef = useRef<any>(null)
  //#endregion  //*======== Initial State & Ref ===========

  //#region  //*=========== Form ===========
  const methods = useForm<ICreateSurveyForm>({ mode: 'onBlur' })

  const {
    formState: { isDirty, errors },
    getValues,
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control
  } = methods

  const latitudeValue = watch('detail.lat')
  const longitudeValue = watch('detail.long')
  const locationValue = watch('detail.lat') || watch('detail.long')
  const photoValue = watch('detail.foto')
  const surveyId = watch('id_header')
  //#endregion  //*======== Form ===========

  //#region  //*=========== Get Data Hooks ===========
  const { surveyNameList, loadingSurveyNameList } = useGetSurveyNameList()
  const { listTiang, loadingListTiang } = useGetTiangList()
  const { constructionList, loadingConstructionList } = useGetConstructionList()
  const { conductorList, loadingConductorList } = useGetConductorList()
  const { poleList, loadingPoleList } = useGetPoleList()
  const { groundingList, loadingGroundingList } = useGetGroundingList()
  const { data: surveyDetail } = useGetSurveyDetail(surveyId?.toString())
  //#endregion  //*======== Get Data Hooks ===========

  useEffect(() => {
    if (selectedConstruction?.label) {
      const label = selectedConstruction.label.toLowerCase()

      if (label.includes('tm-11')) {
        setDisableSelectGrounding(true)
        setValue('detail.id_grounding_termination', 1)
      } else if (label.includes('arr')) {
        setDisableSelectGrounding(true)
        setValue('detail.id_grounding_termination', 2)
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

  useEffect(() => {
    if (isCustomSurvey) {
      setValue('detail.panjang_jaringan', 0)
    } else if (!isCustomSurvey && surveyDetail?.header.lokasi) {
      setValue('header.lokasi', surveyDetail.header.lokasi)
    }
  }, [isCustomSurvey, setValue, surveyDetail?.header.lokasi])

  //#region  //*=========== Utility ===========
  const handleCloseSheet = () => {
    if (isDirty) {
      setShowConfirmDialog(true)
    } else {
      resetForm()
      setIsSheetOpen(false)
    }
  }

  const resetForm = () => {
    reset()
    setIsCustomSurvey(false)
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setValue('detail.lat', position.coords.latitude.toString())
          setValue('detail.long', position.coords.longitude.toString())
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
  const {
    mutate: mutateNewSurvey,
    isPending: loadingNewSurvey,
    isSuccess: successNewSurvey
  } = useCreateNewSurveyMutation()
  const {
    mutate: mutateExistingSurvey,
    isPending: loadingExistingSurvey,
    isSuccess: successExistingSurvey
  } = useCreateExistingSurveyMutation({
    surveyId: watch('id_header')?.toString()
  })
  const { userId } = useAuth()

  useEffect(() => {
    if (successNewSurvey || successExistingSurvey) {
      setIsSheetOpen(false)
      reset()
    }
  }, [reset, successExistingSurvey, successNewSurvey])

  const submitHandler = (data: ICreateSurveyForm) => {
    const { id_header, ...rest } = data

    if (isCustomSurvey) {
      const trimmedName = watch('header.nama_survey').trim()
      const compareSurveyName = surveyNameList.some(
        opt => opt.value.toLowerCase() === trimmedName.toLowerCase()
      )

      if (compareSurveyName) {
        toast.error('Nama survey sudah terpakai!')
        return
      }

      const newSurveyPayload: CreateNewSurvey = {
        ...rest,
        header: {
          ...rest.header,
          user_id: userId ?? '',
          status_survey: 'Belum_Disetujui',
          id_material_konduktor: Number(data.header.id_material_konduktor)
        },
        detail: {
          ...rest.detail,
          id_konstruksi: Number(data.detail.id_konstruksi),
          id_material_tiang: Number(data.detail.id_material_tiang)
        }
      }

      mutateNewSurvey(newSurveyPayload)
    } else {
      const existingSurveyPayload: CreateExistingSurvey = {
        id_header: Number(data.id_header),
        detail: {
          ...rest.detail,
          id_konstruksi: Number(data.detail.id_konstruksi),
          id_material_tiang: Number(data.detail.id_material_tiang)
        }
      }

      mutateExistingSurvey(existingSurveyPayload)
    }
  }
  //#endregion  //*======== Submit Form Handler ===========

  return (
    <div className="p-4">
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
          <Button variant="outline">Buat Survey Baru</Button>
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
                <div className="flex justify-between">
                  <Label required htmlFor="survey-name">
                    Nama Survey
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Label
                      htmlFor="custom-survey-checkbox"
                      className="text-sm font-medium leading-none"
                    >
                      Survey Baru?
                    </Label>
                    <Checkbox
                      checked={isCustomSurvey}
                      onCheckedChange={checked => {
                        const isChecked =
                          typeof checked === 'boolean' ? checked : false
                        setIsCustomSurvey(isChecked)
                        if (!isChecked) {
                          reset({
                            header: {
                              nama_survey: ''
                            }
                          })
                        }
                      }}
                    />
                  </div>
                </div>
                {isCustomSurvey ? (
                  <Input
                    placeholder="Masukkan Nama Survey"
                    {...register('header.nama_survey', {
                      required: isCustomSurvey
                    })}
                  />
                ) : (
                  <Controller
                    name="id_header"
                    control={control}
                    rules={{ required: isCustomSurvey }}
                    render={({ field: { onChange, value } }) => (
                      <SearchableCombobox
                        value={value ?? undefined}
                        isLoading={loadingSurveyNameList}
                        options={surveyNameList}
                        onValueChange={onChange}
                        placeholder="Pilih Nama Survey"
                      />
                    )}
                  />
                )}
              </div>

              {/* Nama Pekerjaan */}
              <div className="grid gap-2">
                <Label required htmlFor="pekerjaan">
                  Nama Pekerjaan
                </Label>
                <Controller
                  name="header.nama_pekerjaan"
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
                {isCustomSurvey ? (
                  <Controller
                    name="header.lokasi"
                    control={control}
                    rules={{ required: isCustomSurvey }}
                    render={({ field: { value } }) => (
                      <SearchableCombobox
                        value={value ?? undefined}
                        options={dummyLocations}
                        onValueChange={value => {
                          setValue('header.lokasi', value ?? '', {
                            shouldValidate: true
                          })
                        }}
                        placeholder="Pilih Lokasi"
                      />
                    )}
                  />
                ) : (
                  <Input
                    readOnly
                    {...register('header.lokasi', { required: isCustomSurvey })}
                  />
                )}
              </div>

              {/* Penyulang */}
              <div className="grid gap-2">
                <Label required htmlFor="penyulang">
                  Penyulang
                </Label>
                <Input
                  maxLength={60}
                  {...register('detail.penyulang', { required: true })}
                />
              </div>

              {/* Tiang */}
              <div className="grid gap-2">
                <Label required htmlFor="tiang">
                  Tiang
                </Label>
                <Controller
                  name="detail.id_material_tiang"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
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
                <Label required htmlFor="konstruksi">
                  Konstruksi
                </Label>
                <Controller
                  name="detail.id_konstruksi"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
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

              {/* Jenis Konduktor */}
              <div className="grid gap-2">
                <Label required htmlFor="konduktor">
                  Jenis Konduktor
                </Label>
                <Controller
                  name="header.id_material_konduktor"
                  control={control}
                  rules={{ required: true }}
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

              {/* Panjang Jaringan */}
              <div className="grid gap-2">
                <Label required htmlFor="panjangJaringan">
                  Panjang Jaringan (meter)
                </Label>
                <Input
                  type="number"
                  max={999}
                  disabled={isCustomSurvey}
                  {...register('detail.panjang_jaringan', {
                    valueAsNumber: true,
                    required: true
                  })}
                />
              </div>

              {/* Pole Suporter */}
              <div className="grid gap-2">
                <Label>Pole Suporter</Label>
                <Controller
                  name="detail.id_pole_supporter"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
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
                  name="detail.id_grounding_termination"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchableCombobox
                      value={value ?? undefined}
                      isDisabled={disableSelectGrounding}
                      isLoading={loadingGroundingList}
                      options={groundingList}
                      onValueChange={onChange}
                      placeholder="Pilih Tipe Grounding"
                    />
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
                    value={watch('detail.lat') || ''}
                    readOnly
                  />
                  <Input
                    placeholder="Longitude"
                    value={watch('detail.long') || ''}
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
                        lat: Number(latitudeValue),
                        lng: Number(longitudeValue)
                      }}
                      onPositionChange={newPos => {
                        setValue('detail.lat', newPos.lat.toString())
                        setValue('detail.long', newPos.lng.toString())
                      }}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <Button onClick={() => setShowMapDialog(false)}>
                        Simpan Lokasi
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowMapDialog(false)
                          reset({
                            detail: {
                              lat: '0',
                              long: '0'
                            }
                          })
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
                <Label required htmlFor="foto">
                  Foto Titik Survey
                </Label>
                {photoValue ? (
                  <>
                    <Image
                      src={photoValue}
                      alt="Foto Survey"
                      width={320}
                      height={192}
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      onClick={() => reset({ detail: { foto: '' } })}
                    >
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
                          setValue('detail.foto', photo)
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
                <Label required htmlFor="keterangan">
                  Keterangan
                </Label>
                <Input
                  id="keterangan"
                  maxLength={60}
                  {...register('detail.keterangan', { required: true })}
                />
              </div>

              {/* Petugas Survey */}
              <div className="grid gap-2">
                <Label required htmlFor="petugas">
                  Petugas Survey
                </Label>
                <Input
                  id="petugas"
                  maxLength={60}
                  {...register('detail.petugas_survey', { required: true })}
                />
              </div>

              <Button
                type="submit"
                onClick={() => {
                  errors && console.log('Error: ', errors)
                }}
                disabled={
                  loadingNewSurvey ||
                  loadingExistingSurvey ||
                  // !isValid ||
                  !photoValue
                }
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
                  resetForm()
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
    </div>
  )
}
