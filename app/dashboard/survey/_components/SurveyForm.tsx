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
import { dummyLocations, tiangMaterial } from '@/lib/data/survey'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { gk1 } from '@/lib/data/gambar_konstruksi_1'
import { Camera } from 'react-camera-pro'
import { toast } from 'sonner'
import MapPicker from './MapPicker'
import SearchableSelect, { Option } from './SearchableSelect'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle
} from '@/components/ui/dialog'

// Definisi tipe data Survey (sama dengan di page.tsx)
export type SurveyData = {
  surveyName: string
  location: string
  penyulang: string
  tiang: string
  konstruksi: string
  jenisKonduktor: string
  panjangJaringan: string
  coordinates: { lat: number; lng: number }
  photo: string
  keterangan: string
  petugas: string
}

export default function SurveyForm({
  onSubmit,
  surveyNames,
  setSurveyNames,
  submittedSurveys // <-- Prop baru untuk akses data survey yang telah disubmit
}: {
  onSubmit: (data: any) => void
  surveyNames: Option[]
  setSurveyNames: (opts: Option[]) => void
  submittedSurveys: SurveyData[]
}) {
  const [isDirty, setIsDirty] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [hasLocation, setHasLocation] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [cameraAllowed, setCameraAllowed] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [useCustomSurvey, setUseCustomSurvey] = useState(false)
  const [customSurveyName, setCustomSurveyName] = useState('')

  const [formData, setFormData] = useState({
    surveyName: '',
    namaPekerjaan: '',
    location: '',
    penyulang: '',
    tiang: '',
    konstruksi: '',
    jenisKonduktor: '',
    panjangJaringan: '',
    coordinates: { lat: 0, lng: 0 },
    photo: '',
    keterangan: '',
    petugas: ''
  })
  const [isOpen, setIsOpen] = useState(false)
  const [showCameraDialog, setShowCameraDialog] = useState(false)
  const cameraRef = useRef<any>(null)

  const videoConstraints = {
    facingMode: { exact: 'environment' } // gunakan kamera belakang
  }

  useEffect(() => {
    const isFormEmpty = Object.values(formData).every(
      value =>
        (typeof value === 'string' && value === '') ||
        (typeof value === 'object' && value.lat === 0 && value.lng === 0)
    )
    setIsDirty(!isFormEmpty)
  }, [formData])

  // Jika user memilih survey name yang sudah ada, secara otomatis set ULP sesuai survey pertama dengan nama tersebut
  useEffect(() => {
    if (!useCustomSurvey && formData.surveyName) {
      const found = submittedSurveys.find(
        survey => survey.surveyName === formData.surveyName
      )
      if (found) {
        setFormData(prev => ({ ...prev, location: found.location }))
      }
    }
  }, [formData.surveyName, useCustomSurvey, submittedSurveys])

  const handleClose = () => {
    if (isDirty) {
      setShowConfirm(true)
    } else {
      resetForm()
      setIsOpen(false)
    }
  }

  const resetForm = () => {
    setFormData({
      surveyName: '',
      namaPekerjaan: '',
      location: '',
      penyulang: '',
      tiang: '',
      konstruksi: '',
      jenisKonduktor: '',
      panjangJaringan: '',
      coordinates: { lat: 0, lng: 0 },
      photo: '',
      keterangan: '',
      petugas: ''
    })
    setHasLocation(false)
    setHasPhoto(false)
    setCameraAllowed(false)
    setShowCamera(false)
    setCustomSurveyName('')
    setUseCustomSurvey(false)
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setFormData(prev => ({ ...prev, coordinates: newPos }))
          setHasLocation(true)
          setShowMap(true)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (useCustomSurvey) {
      const trimmedName = customSurveyName.trim()
      // Check if survey name already exists (case-insensitive)
      if (
        surveyNames.some(
          opt => opt.value.toLowerCase() === trimmedName.toLowerCase()
        )
      ) {
        toast.error('Nama survey sudah terpakai!')
        return
      }
      // Add new survey name to dropdown list
      setSurveyNames([
        ...surveyNames,
        { value: trimmedName, label: trimmedName }
      ])
    }
    onSubmit(formData) // Kirim data ke parent
    resetForm()
    setIsOpen(false)
  }

  // Cek apakah survey name yang dipilih sudah ada (untuk menentukan tampilan ULP)
  const existingSurvey =
    !useCustomSurvey && formData.surveyName
      ? submittedSurveys.find(
          survey => survey.surveyName === formData.surveyName
        )
      : null

  useEffect(() => {
    if (!showCameraDialog) {
      // Opsional: Bersihkan ref saat dialog tertutup
      cameraRef.current = null
    }
  }, [showCameraDialog])

  return (
    <div className="p-4">
      <Sheet
        open={isOpen}
        onOpenChange={open => {
          if (!open) {
            handleClose()
          } else {
            setIsOpen(true)
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
              handleClose()
            }
          }}
        >
          <SheetHeader>
            <SheetTitle>Form Survey Lapangan</SheetTitle>
            <SheetDescription>
              Isi semua data dengan lengkap dan akurat
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {/* Nama Survey */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="custom-survey-checkbox">Nama Survey</Label>
                <Checkbox
                  id="custom-survey-checkbox"
                  checked={useCustomSurvey}
                  onCheckedChange={checked => {
                    const isChecked =
                      typeof checked === 'boolean' ? checked : false
                    setUseCustomSurvey(isChecked)
                    if (!isChecked) {
                      setCustomSurveyName('')
                      setFormData(prev => ({ ...prev, surveyName: '' }))
                    }
                  }}
                />
                <label
                  htmlFor="custom-survey-checkbox"
                  className="text-sm font-medium leading-none"
                >
                  Survey Baru?
                </label>
              </div>
              {useCustomSurvey ? (
                <Input
                  placeholder="Masukkan Nama Survey"
                  value={customSurveyName}
                  onChange={e => {
                    setCustomSurveyName(e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      surveyName: e.target.value
                    }))
                  }}
                />
              ) : (
                <SearchableSelect
                  options={surveyNames}
                  onValueChange={value =>
                    setFormData(prev => ({ ...prev, surveyName: value }))
                  }
                  placeholder="Pilih Nama Survey"
                />
              )}
            </div>

            {/* Nama Pekerjaan */}
            <div className="grid gap-2">
              <Label>Nama Pekerjaan</Label>
              <SearchableSelect
                options={[
                  { value: 'Pasang Baru', label: 'Pasang Baru' },
                  { value: 'Perubahan Daya', label: 'Perubahan Daya' },
                  { value: 'PFK', label: 'PFK' },
                  {
                    value: 'Konfigurasi Jaringan',
                    label: 'Konfigurasi Jaringan'
                  },
                  { value: 'Penyulang Baru', label: 'Penyulang Baru' }
                ]}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, namaPekerjaan: value }))
                }
                placeholder="Pilih Nama Pekerjaan"
              />
            </div>

            {/* Lokasi/ULP */}
            <div className="grid gap-2">
              <Label>Lokasi/ULP</Label>
              {existingSurvey ? (
                // Jika survey name sudah ada, tampilkan ULP secara read-only
                <Input value={existingSurvey.location} readOnly />
              ) : (
                // Jika survey name baru, biarkan user memilih ULP dari dummyLocations
                <SearchableSelect
                  options={dummyLocations}
                  onValueChange={value =>
                    setFormData(prev => ({ ...prev, location: value }))
                  }
                  placeholder="Pilih Lokasi"
                />
              )}
            </div>

            {/* Penyulang */}
            <div className="grid gap-2">
              <Label htmlFor="penyulang">Penyulang</Label>
              <Input
                id="penyulang"
                maxLength={60}
                value={formData.penyulang}
                onChange={e =>
                  setFormData(prev => ({ ...prev, penyulang: e.target.value }))
                }
              />
            </div>

            {/* Tiang */}
            <div className="grid gap-2">
              <Label>Tiang</Label>
              <SearchableSelect
                options={tiangMaterial.map(material => ({
                  value: material.id,
                  label: material.nama
                }))}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, tiang: value }))
                }
                placeholder="Pilih Tiang"
              />
            </div>

            {/* Konstruksi */}
            <div className="grid gap-2">
              <Label>Konstruksi</Label>
              <SearchableSelect
                options={gk1.map(item => ({
                  value: item.id,
                  label: item.Nama_Konstruksi
                }))}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, konstruksi: value }))
                }
                placeholder="Pilih Konstruksi"
              />
            </div>

            {/* Jenis Konduktor */}
            <div className="grid gap-2">
              <Label>Jenis Konduktor</Label>
              <SearchableSelect
                options={[
                  {
                    value: 'AAAC-S 150 sqmm (SPLN)',
                    label: 'AAAC-S 150 sqmm (SPLN)'
                  },
                  {
                    value: 'AAAC-S 240 sqmm (SPLN)',
                    label: 'AAAC-S 240 sqmm (SPLN)'
                  }
                ]}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, jenisKonduktor: value }))
                }
                placeholder="Pilih Jenis Konduktor"
              />
            </div>

            {/* Panjang Jaringan */}
            <div className="grid gap-2">
              <Label htmlFor="panjangJaringan">Panjang Jaringan (meter)</Label>
              <Input
                id="panjangJaringan"
                type="number"
                max={999}
                value={formData.panjangJaringan}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    panjangJaringan: e.target.value
                  }))
                }
              />
            </div>

            {/* Koordinat */}
            <div className="grid gap-2">
              <Label>Koordinat</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude"
                  value={formData.coordinates.lat?.toFixed(6) || ''}
                  readOnly
                />
                <Input
                  placeholder="Longitude"
                  value={formData.coordinates.lng?.toFixed(6) || ''}
                  readOnly
                />
                <Button
                  type="button"
                  onClick={getLocation}
                  variant={hasLocation ? 'secondary' : 'default'}
                >
                  {hasLocation ? 'Ubah Lokasi' : 'Ambil Lokasi'}
                </Button>
              </div>
            </div>

            {/* Modal Peta dengan Dialog shadcn */}
            <Dialog open={showMap} onOpenChange={setShowMap}>
              <DialogPortal>
                <DialogContent className="bg-background p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Atur Lokasi di Peta</DialogTitle>
                    <DialogDescription>
                      Geser peta untuk menyesuaikan lokasi yang diinginkan.
                    </DialogDescription>
                  </DialogHeader>
                  <MapPicker
                    initialPosition={formData.coordinates}
                    onPositionChange={newPos =>
                      setFormData(prev => ({ ...prev, coordinates: newPos }))
                    }
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <Button onClick={() => setShowMap(false)}>
                      Simpan Lokasi
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowMap(false)
                        setFormData(prev => ({
                          ...prev,
                          coordinates: { lat: 0, lng: 0 }
                        }))
                        setHasLocation(false)
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
              {formData.photo ? (
                <>
                  <Image
                    src={formData.photo}
                    alt="Foto Survey"
                    width={320}
                    height={192}
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({ ...prev, photo: '' }))
                    }
                  >
                    Ambil Ulang Foto
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setShowCameraDialog(true)}>
                  Ambil Foto
                </Button>
              )}
            </div>

            {/* Dialog kamera */}

            <Dialog open={showCameraDialog} onOpenChange={setShowCameraDialog}>
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
                        setFormData(prev => ({ ...prev, photo }))
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
                value={formData.keterangan}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    keterangan: e.target.value
                  }))
                }
              />
            </div>

            {/* Petugas Survey */}
            <div className="grid gap-2">
              <Label htmlFor="petugas">Petugas Survey</Label>
              <Input
                id="petugas"
                maxLength={60}
                value={formData.petugas}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    petugas: e.target.value
                  }))
                }
              />
            </div>

            <Button type="submit">Simpan Survey</Button>
          </form>
        </SheetContent>
      </Sheet>

      {showConfirm && (
        <div className="fixed z-[9999] inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <div className="bg-background border border-muted p-6 rounded-lg max-w-sm">
            <h3 className="font-bold text-lg">Batal Mengisi Form?</h3>
            <p className="py-4">Data yang sudah diisi akan hilang</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  resetForm()
                  setIsOpen(false)
                  setShowConfirm(false)
                }}
              >
                Batalkan
              </Button>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Lanjutkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
