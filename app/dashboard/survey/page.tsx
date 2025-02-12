'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'

const dummyLocations = [
  { value: 'ulp-1', label: 'ULP Kota Barat' },
  { value: 'ulp-2', label: 'ULP Kota Timur' },
  { value: 'ulp-3', label: 'ULP Kota Utara' }
]

const dummyTiang = [
  { value: 't-001', label: 'Tiang Beton 9m' },
  { value: 't-002', label: 'Tiang Besi 10m' },
  { value: 't-003', label: 'Tiang Kayu 8m' }
]

const dummyKonstruksi = [
  { value: 'k-001', label: 'Konstruksi Jaringan Bawah' },
  { value: 'k-002', label: 'Konstruksi Jaringan Atas' },
  { value: 'k-003', label: 'Konstruksi Jaringan Tengah' }
]

export default function SurveyPage() {
  const [isDirty, setIsDirty] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [hasLocation, setHasLocation] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [cameraAllowed, setCameraAllowed] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

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

  // Track perubahan form
  useEffect(() => {
    const isFormEmpty = Object.values(formData).every(
      value =>
        (typeof value === 'string' && value === '') ||
        (typeof value === 'object' && value.lat === 0 && value.lng === 0)
    )
    setIsDirty(!isFormEmpty)
  }, [formData])

  // Handle close sheet
  const handleClose = () => {
    if (isDirty) {
      setShowConfirm(true)
    } else {
      resetForm()
      setIsOpen(false)
    }
  }

  // Reset form
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
      navigator.geolocation.getCurrentPosition(position => {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }))
        setHasLocation(true)
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    resetForm()
    setIsOpen(false)
  }

  const isFormValid = Object.values(formData).every(
    value =>
      value !== '' &&
      (typeof value !== 'object' || (value.lat !== 0 && value.lng !== 0))
  )

  return (
    <div className="p-4">
      <Sheet
        open={isOpen}
        onOpenChange={open => {
          if (!open) {
            handleClose() // Panggil handleClose saat mencoba menutup
          } else {
            setIsOpen(true) // Saat membuka, set ke true
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
              <Label htmlFor="surveyName">Nama Survey</Label>
              <Input
                id="surveyName"
                maxLength={60}
                value={formData.surveyName}
                onChange={e =>
                  setFormData({ ...formData, surveyName: e.target.value })
                }
              />
            </div>

            {/* Lokasi/ULP */}
            <div className="grid gap-2">
              <Label>Lokasi/ULP</Label>
              <Select
                onValueChange={value =>
                  setFormData({ ...formData, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  {dummyLocations.map(loc => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Penyulang */}
            <div className="grid gap-2">
              <Label htmlFor="penyulang">Penyulang</Label>
              <Input
                id="penyulang"
                maxLength={60}
                value={formData.penyulang}
                onChange={e =>
                  setFormData({ ...formData, penyulang: e.target.value })
                }
              />
            </div>

            {/* Tiang */}
            <div className="grid gap-2">
              <Label>Tiang</Label>
              <Select
                onValueChange={value =>
                  setFormData({ ...formData, tiang: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tiang" />
                </SelectTrigger>
                <SelectContent>
                  {dummyTiang.map(tiang => (
                    <SelectItem key={tiang.value} value={tiang.value}>
                      {tiang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Konstruksi */}
            <div className="grid gap-2">
              <Label>Konstruksi</Label>
              <Select
                onValueChange={value =>
                  setFormData({ ...formData, konstruksi: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Konstruksi" />
                </SelectTrigger>
                <SelectContent>
                  {dummyKonstruksi.map(konstruksi => (
                    <SelectItem key={konstruksi.value} value={konstruksi.value}>
                      {konstruksi.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  setFormData({ ...formData, panjangJaringan: e.target.value })
                }
              />
            </div>

            {/* Koordinat */}
            <div className="grid gap-2">
              <Label>Koordinat</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude"
                  value={formData.coordinates.lat}
                  readOnly
                />
                <Input
                  placeholder="Longitude"
                  value={formData.coordinates.lng}
                  readOnly
                />
                <Button type="button" onClick={getLocation}>
                  {hasLocation ? 'Ambil Ulang Lokasi' : 'Ambil Lokasi'}
                </Button>
              </div>
            </div>

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
                  setFormData({ ...formData, keterangan: e.target.value })
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
                  setFormData({ ...formData, petugas: e.target.value })
                }
              />
            </div>

            <Button type="submit" disabled={!isFormValid}>
              Simpan Survey
            </Button>
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
