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
import { useCallback, useEffect, useRef, useState } from 'react'

import { gk1 } from '@/lib/data/gambar_konstruksi_1'
import Webcam from 'react-webcam'
import { toast } from 'sonner'
import MapPicker from './MapPicker'
import SearchableSelect, { Option } from './SearchableSelect'

export default function SurveyForm({
  onSubmit,
  surveyNames,
  setSurveyNames
}: {
  onSubmit: (data: any) => void
  surveyNames: Option[]
  setSurveyNames: (opts: Option[]) => void
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
  const [submittedSurveys, setSubmittedSurveys] = useState<
    Array<typeof formData>
  >([])

  const [formData, setFormData] = useState({
    surveyName: '',
    location: '',
    penyulang: '',
    tiang: '',
    konstruksi: '',
    panjangJaringan: '',
    coordinates: { lat: 0, lng: 0 },
    photo: '',
    keterangan: '',
    petugas: ''
  })
  const [isOpen, setIsOpen] = useState(false)
  const webcamRef = useRef<Webcam>(null)

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
      location: '',
      penyulang: '',
      tiang: '',
      konstruksi: '',
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

  const initializeCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      setCameraAllowed(true)
      setShowCamera(true)
    } catch (error) {
      alert('Akses kamera ditolak!')
    }
  }

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setFormData(prev => ({ ...prev, photo: imageSrc }))
      setHasPhoto(true)
    }
  }, [])

  const retakePhoto = () => {
    setFormData(prev => ({ ...prev, photo: '' }))
    setHasPhoto(false)
    setShowCamera(true)
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
          console.error('Error getting location:', error)
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
              Iisi semua data dengan lengkap dan akurat
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
                  options={surveyNames} // sekarang hanya dari surveyNames, bisa kosong
                  onValueChange={value =>
                    setFormData(prev => ({ ...prev, surveyName: value }))
                  }
                  placeholder="Pilih Nama Survey"
                />
              )}
            </div>

            {/* Lokasi/ULP */}
            <div className="grid gap-2">
              <Label>Lokasi/ULP</Label>
              <SearchableSelect
                options={dummyLocations}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, location: value }))
                }
                placeholder="Pilih Lokasi"
              />
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

            {/* Modal Peta */}
            {showMap && (
              <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
                <div className="bg-background p-6 rounded-lg w-full max-w-4xl">
                  <h3 className="text-lg font-bold mb-4">
                    Atur Lokasi di Peta
                  </h3>
                  <MapPicker
                    initialPosition={formData.coordinates}
                    onPositionChange={newPos => {
                      setFormData(prev => ({
                        ...prev,
                        coordinates: newPos
                      }))
                    }}
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
                </div>
              </div>
            )}
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
                  <Button type="button" onClick={retakePhoto}>
                    Ambil Ulang Foto
                  </Button>
                </>
              ) : (
                <>
                  {showCamera && cameraAllowed && (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="h-48"
                    />
                  )}

                  <Button
                    type="button"
                    onClick={!cameraAllowed ? initializeCamera : capturePhoto}
                  >
                    {hasPhoto ? 'Ambil Ulang Foto' : 'Ambil Foto'}
                  </Button>
                </>
              )}
            </div>

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
