// 'use client'
// import Image from 'next/image'
// import { useEffect, useRef, useState } from 'react'
// import MapPicker from './_components/MapPicker'
// import MapViewer from './_components/MapViewer'
// import type { Option } from './_components/SearchableSelect'
// import SurveyForm from './_components/SurveyForm'

// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Sheet, SheetContent } from '@/components/ui/sheet'

// // Import DialogTitle dan VisuallyHidden dari Radix UI
// import { DialogTitle } from '@radix-ui/react-dialog'
// import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

// // Type definition
// type SurveyData = {
//   surveyName: string
//   location: string
//   penyulang: string
//   tiang: string
//   konstruksi: string
//   panjangJaringan: string
//   coordinates: { lat: number; lng: number }
//   photo: string
//   keterangan: string
//   petugas: string
// }

// export default function Page() {
//   const [submittedSurveys, setSubmittedSurveys] = useState<SurveyData[]>([])
//   const [surveyNames, setSurveyNames] = useState<Option[]>([])
//   const [selectedSurvey, setSelectedSurvey] = useState<SurveyData | null>(null)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//   const [selectedMapSurvey, setSelectedMapSurvey] = useState<string | null>(
//     null
//   )

//   // Load surveys from localStorage on mount
//   useEffect(() => {
//     const storedSurveys = localStorage.getItem('submittedSurveys')
//     if (storedSurveys) {
//       setSubmittedSurveys(JSON.parse(storedSurveys))
//     }
//   }, [])

//   // Prevent overwriting localStorage on initial mount.
//   const isInitialMount = useRef(true)
//   useEffect(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false
//     } else {
//       localStorage.setItem('submittedSurveys', JSON.stringify(submittedSurveys))
//     }
//   }, [submittedSurveys])

//   useEffect(() => {
//     const uniqueNames = Array.from(
//       new Set(
//         submittedSurveys.map(survey => survey.surveyName).filter(name => name)
//       )
//     )
//     setSurveyNames(uniqueNames.map(name => ({ value: name, label: name })))
//   }, [submittedSurveys])

//   // Group surveys by surveyName (includes custom names)
//   const groupedSurveys = submittedSurveys.reduce(
//     (acc: Record<string, SurveyData[]>, survey) => {
//       if (!acc[survey.surveyName]) {
//         acc[survey.surveyName] = []
//       }
//       acc[survey.surveyName].push(survey)
//       return acc
//     },
//     {}
//   )

//   const handleDelete = () => {
//     setSubmittedSurveys(prev =>
//       prev.filter(survey => survey !== selectedSurvey)
//     )
//     setIsDeleteModalOpen(false)
//   }

//   const handleEdit = () => {
//     if (selectedSurvey) {
//       setSubmittedSurveys(prev =>
//         prev.map(survey =>
//           survey === selectedSurvey ? selectedSurvey : survey
//         )
//       )
//       setIsEditModalOpen(false)
//     }
//   }

//   return (
//     <div className="p-4">
//       <SurveyForm
//         onSubmit={data => setSubmittedSurveys(prev => [...prev, data])}
//         surveyNames={surveyNames}
//         setSurveyNames={setSurveyNames}
//       />

//       {Object.keys(groupedSurveys).length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-lg font-bold">Data Survey</h2>
//           {Object.entries(groupedSurveys).map(([surveyName, surveys]) => (
//             <div key={surveyName} className="mb-4">
//               <div className="flex items-center gap-4 mb-2">
//                 <h3 className="text-md font-semibold">{surveyName}</h3>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setSelectedMapSurvey(surveyName)}
//                 >
//                   Lihat Map
//                 </Button>
//               </div>

//               <table className="w-full border-collapse border border-gray-300">
//                 <thead>
//                   <tr>
//                     <th className="border p-2">#</th>
//                     <th className="border p-2">Foto</th>
//                     <th className="border p-2">ULP</th>
//                     <th className="border p-2">Penyulang</th>
//                     <th className="border p-2">Nama Tiang</th>
//                     <th className="border p-2">Konstruksi</th>
//                     <th className="border p-2">Panjang Jaringan</th>
//                     <th className="border p-2">Koordinat</th>
//                     <th className="border p-2">Petugas</th>
//                     <th className="border p-2">Keterangan</th>
//                     <th className="border p-2">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {surveys.map((data, index) => (
//                     <tr key={index} className="text-center">
//                       <td className="border p-2">{index + 1}</td>
//                       <td className="border p-2">
//                         {data.photo ? (
//                           <Image
//                             src={data.photo}
//                             alt="Foto Survey"
//                             width={100}
//                             height={60}
//                             className="object-cover"
//                           />
//                         ) : (
//                           'No Photo'
//                         )}
//                       </td>
//                       <td className="border p-2">{data.location}</td>
//                       <td className="border p-2">{data.penyulang}</td>
//                       <td className="border p-2">{data.tiang}</td>
//                       <td className="border p-2">{data.konstruksi}</td>
//                       <td className="border p-2">{data.panjangJaringan}</td>
//                       <td className="border p-2">
//                         {`Lat: ${data.coordinates.lat.toFixed(
//                           6
//                         )}, Lng: ${data.coordinates.lng.toFixed(6)}`}
//                       </td>
//                       <td className="border p-2">{data.petugas}</td>
//                       <td className="border p-2">{data.keterangan}</td>
//                       <td className="border p-2 flex justify-center gap-2">
//                         <button
//                           className="text-red-500"
//                           onClick={() => {
//                             setSelectedSurvey(data)
//                             setIsDeleteModalOpen(true)
//                           }}
//                         >
//                           Delete
//                         </button>
//                         <button
//                           className="text-blue-500"
//                           onClick={() => {
//                             setSelectedSurvey(data)
//                             setIsEditModalOpen(true)
//                           }}
//                         >
//                           Edit
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Edit Modal */}
//       <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <SheetContent side="right" className="p-4">
//           <VisuallyHidden>
//             <DialogTitle>Edit Survey</DialogTitle>
//           </VisuallyHidden>
//           <h2 className="text-lg font-bold mb-4">Edit Survey</h2>
//           {selectedSurvey && (
//             <div className="flex flex-col gap-3">
//               <Label>Nama Tiang</Label>
//               <Input
//                 value={selectedSurvey.tiang}
//                 onChange={e =>
//                   setSelectedSurvey(prev =>
//                     prev ? { ...prev, tiang: e.target.value } : null
//                   )
//                 }
//               />
//               <Label>Keterangan</Label>
//               <Input
//                 value={selectedSurvey.keterangan}
//                 onChange={e =>
//                   setSelectedSurvey(prev =>
//                     prev ? { ...prev, keterangan: e.target.value } : null
//                   )
//                 }
//               />
//               <Label>Foto</Label>
//               <Input
//                 value={selectedSurvey.photo}
//                 onChange={e =>
//                   setSelectedSurvey(prev =>
//                     prev ? { ...prev, photo: e.target.value } : null
//                   )
//                 }
//               />
//               <Button onClick={handleEdit} className="mt-4">
//                 Simpan
//               </Button>
//             </div>
//           )}
//         </SheetContent>
//       </Sheet>

//       {/* Map Modal untuk MapPicker */}
//       <Sheet
//         open={!!selectedMapSurvey}
//         onOpenChange={open => !open && setSelectedMapSurvey(null)}
//       >
//         <SheetContent side="bottom" className="h-[90vh]">
//           <VisuallyHidden>
//             <DialogTitle>Map Viewer</DialogTitle>
//           </VisuallyHidden>
//           {selectedMapSurvey && (
//             <MapPicker
//               initialPosition={{
//                 lat: groupedSurveys[selectedMapSurvey][0].coordinates.lat,
//                 lng: groupedSurveys[selectedMapSurvey][0].coordinates.lng
//               }}
//               onPositionChange={() => {}}
//             />
//           )}
//         </SheetContent>
//       </Sheet>

//       {/* Map Modal untuk MapViewer */}
//       <Sheet
//         open={!!selectedMapSurvey}
//         onOpenChange={open => !open && setSelectedMapSurvey(null)}
//       >
//         <SheetContent side="bottom" className="h-[90vh]">
//           <VisuallyHidden>
//             <DialogTitle>Map Viewer</DialogTitle>
//           </VisuallyHidden>
//           {selectedMapSurvey && (
//             <MapViewer surveys={groupedSurveys[selectedMapSurvey]} />
//           )}
//         </SheetContent>
//       </Sheet>

//       <div className="mt-8 w-screen overflow-y-auto">
//         <h2 className="text-lg font-bold">Debug Submitted Surveys JSON</h2>
//         <pre className="p-4 bg-background rounded">
//           {JSON.stringify(submittedSurveys, null, 2)}
//         </pre>
//       </div>
//     </div>
//   )
// }

'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import MapPicker from './_components/MapPicker'
import MapViewer from './_components/MapViewer'
import SearchableSelect, { Option } from './_components/SearchableSelect'
import SurveyForm from './_components/SurveyForm'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

// Import data RAB
import { gk1 } from '@/lib/data/gambar_konstruksi_1'
import { tiangMaterial } from '@/lib/data/survey'

// Type definition
type SurveyData = {
  surveyName: string
  location: string
  penyulang: string
  tiang: string
  konstruksi: string
  panjangJaringan: string
  coordinates: { lat: number; lng: number }
  photo: string
  keterangan: string
  petugas: string
}

export default function Page() {
  const [submittedSurveys, setSubmittedSurveys] = useState<SurveyData[]>([])
  const [surveyNames, setSurveyNames] = useState<Option[]>([])
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedMapSurvey, setSelectedMapSurvey] = useState<string | null>(
    null
  )

  // State untuk Export RAB
  const [isRABModalOpen, setIsRABModalOpen] = useState(false)
  const [selectedRABSurvey, setSelectedRABSurvey] = useState<Option | null>(
    null
  )

  // Load surveys from localStorage on mount
  useEffect(() => {
    const storedSurveys = localStorage.getItem('submittedSurveys')
    if (storedSurveys) {
      setSubmittedSurveys(JSON.parse(storedSurveys))
    }
  }, [])

  // Prevent overwriting localStorage on initial mount.
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      localStorage.setItem('submittedSurveys', JSON.stringify(submittedSurveys))
    }
  }, [submittedSurveys])

  useEffect(() => {
    const uniqueNames = Array.from(
      new Set(
        submittedSurveys.map(survey => survey.surveyName).filter(name => name)
      )
    )
    setSurveyNames(uniqueNames.map(name => ({ value: name, label: name })))
  }, [submittedSurveys])

  // Group surveys by surveyName (includes custom names)
  const groupedSurveys = submittedSurveys.reduce(
    (acc: Record<string, SurveyData[]>, survey) => {
      if (!acc[survey.surveyName]) {
        acc[survey.surveyName] = []
      }
      acc[survey.surveyName].push(survey)
      return acc
    },
    {}
  )

  const handleDelete = () => {
    setSubmittedSurveys(prev =>
      prev.filter(survey => survey !== selectedSurvey)
    )
    setIsDeleteModalOpen(false)
  }

  const handleEdit = () => {
    if (selectedSurvey) {
      setSubmittedSurveys(prev =>
        prev.map(survey =>
          survey === selectedSurvey ? selectedSurvey : survey
        )
      )
      setIsEditModalOpen(false)
    }
  }

  return (
    <div className="p-4">
      <SurveyForm
        onSubmit={data => setSubmittedSurveys(prev => [...prev, data])}
        surveyNames={surveyNames}
        setSurveyNames={setSurveyNames}
      />

      {Object.keys(groupedSurveys).length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold">Data Survey</h2>
          {Object.entries(groupedSurveys).map(([surveyName, surveys]) => (
            <div key={surveyName} className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-md font-semibold">{surveyName}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMapSurvey(surveyName)}
                >
                  Lihat Map
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsRABModalOpen(true)
                    setSelectedRABSurvey({
                      value: surveyName,
                      label: surveyName
                    })
                  }}
                >
                  Export RAB
                </Button>
              </div>

              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border p-2">#</th>
                    <th className="border p-2">Foto</th>
                    <th className="border p-2">ULP</th>
                    <th className="border p-2">Penyulang</th>
                    <th className="border p-2">Nama Tiang</th>
                    <th className="border p-2">Konstruksi</th>
                    <th className="border p-2">Panjang Jaringan</th>
                    <th className="border p-2">Koordinat</th>
                    <th className="border p-2">Petugas</th>
                    <th className="border p-2">Keterangan</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.map((data, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">
                        {data.photo ? (
                          <Image
                            src={data.photo}
                            alt="Foto Survey"
                            width={100}
                            height={60}
                            className="object-cover"
                          />
                        ) : (
                          'No Photo'
                        )}
                      </td>
                      <td className="border p-2">{data.location}</td>
                      <td className="border p-2">{data.penyulang}</td>
                      <td className="border p-2">{data.tiang}</td>
                      <td className="border p-2">{data.konstruksi}</td>
                      <td className="border p-2">{data.panjangJaringan}</td>
                      <td className="border p-2">
                        {`Lat: ${data.coordinates.lat.toFixed(
                          6
                        )}, Lng: ${data.coordinates.lng.toFixed(6)}`}
                      </td>
                      <td className="border p-2">{data.petugas}</td>
                      <td className="border p-2">{data.keterangan}</td>
                      <td className="border p-2 flex justify-center gap-2">
                        <button
                          className="text-red-500"
                          onClick={() => {
                            setSelectedSurvey(data)
                            setIsDeleteModalOpen(true)
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="text-blue-500"
                          onClick={() => {
                            setSelectedSurvey(data)
                            setIsEditModalOpen(true)
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <SheetContent side="right" className="p-4">
          <VisuallyHidden>
            <DialogTitle>Edit Survey</DialogTitle>
          </VisuallyHidden>
          <h2 className="text-lg font-bold mb-4">Edit Survey</h2>
          {selectedSurvey && (
            <div className="flex flex-col gap-3">
              <Label>Nama Tiang</Label>
              <Input
                value={selectedSurvey.tiang}
                onChange={e =>
                  setSelectedSurvey(prev =>
                    prev ? { ...prev, tiang: e.target.value } : null
                  )
                }
              />
              <Label>Keterangan</Label>
              <Input
                value={selectedSurvey.keterangan}
                onChange={e =>
                  setSelectedSurvey(prev =>
                    prev ? { ...prev, keterangan: e.target.value } : null
                  )
                }
              />
              <Label>Foto</Label>
              <Input
                value={selectedSurvey.photo}
                onChange={e =>
                  setSelectedSurvey(prev =>
                    prev ? { ...prev, photo: e.target.value } : null
                  )
                }
              />
              <Button onClick={handleEdit} className="mt-4">
                Simpan
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Map Modal untuk MapPicker */}
      <Sheet
        open={!!selectedMapSurvey}
        onOpenChange={open => !open && setSelectedMapSurvey(null)}
      >
        <SheetContent side="bottom" className="h-[90vh]">
          <VisuallyHidden>
            <DialogTitle>Map Viewer</DialogTitle>
          </VisuallyHidden>
          {selectedMapSurvey && (
            <MapPicker
              initialPosition={{
                lat: groupedSurveys[selectedMapSurvey][0].coordinates.lat,
                lng: groupedSurveys[selectedMapSurvey][0].coordinates.lng
              }}
              onPositionChange={() => {}}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Map Modal untuk MapViewer */}
      <Sheet
        open={!!selectedMapSurvey}
        onOpenChange={open => !open && setSelectedMapSurvey(null)}
      >
        <SheetContent side="bottom" className="h-[90vh]">
          <VisuallyHidden>
            <DialogTitle>Map Viewer</DialogTitle>
          </VisuallyHidden>
          {selectedMapSurvey && (
            <MapViewer surveys={groupedSurveys[selectedMapSurvey]} />
          )}
        </SheetContent>
      </Sheet>

      {/* Export RAB Modal */}
      <Sheet open={isRABModalOpen} onOpenChange={setIsRABModalOpen}>
        <SheetContent side="bottom" className="h-[90vh] p-4 overflow-auto">
          <VisuallyHidden>
            <DialogTitle>Export RAB</DialogTitle>
          </VisuallyHidden>
          <h2 className="text-lg font-bold mb-4">Export RAB</h2>
          <div className="mb-4">
            <Label>Pilih Survey</Label>
            <SearchableSelect
              options={surveyNames}
              value={selectedRABSurvey ? selectedRABSurvey.value : ''}
              onValueChange={value => {
                const option =
                  surveyNames.find(opt => opt.value === value) || null
                setSelectedRABSurvey(option)
              }}
              placeholder="Pilih Survey"
            />
          </div>
          {selectedRABSurvey && (
            <>
              {(() => {
                const surveysForRAB = submittedSurveys.filter(
                  s => s.surveyName === selectedRABSurvey.value
                )
                // Ambil unique id tiang dari surveys
                const tiangIds = Array.from(
                  new Set(surveysForRAB.map(s => s.tiang))
                )
                const filteredTiang = tiangMaterial.filter(material =>
                  tiangIds.includes(material.id)
                )
                // Ambil unique id konstruksi dari surveys
                const konstruksiIds = Array.from(
                  new Set(surveysForRAB.map(s => s.konstruksi))
                )
                const filteredKonstruksi = gk1.filter(kon =>
                  konstruksiIds.includes(kon.id)
                )
                return (
                  <>
                    <div className="mb-6">
                      <h3 className="text-md font-semibold mb-2">
                        Detail Tiang Material
                      </h3>
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Nama</th>
                            <th className="border p-2">Berat (kg)</th>
                            <th className="border p-2">HPS RAB</th>
                            <th className="border p-2">Pasang RAB</th>
                            <th className="border p-2">Bongkar</th>
                            <th className="border p-2">Jenis Material</th>
                            <th className="border p-2">Kategori</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTiang.map((material, index) => (
                            <tr key={index}>
                              <td className="border p-2">{material.id}</td>
                              <td className="border p-2">{material.nama}</td>
                              <td className="border p-2">
                                {material.berat_kg}
                              </td>
                              <td className="border p-2">
                                {material.harga_2024.hps_rab}
                              </td>
                              <td className="border p-2">
                                {material.harga_2024.pasang_rab}
                              </td>
                              <td className="border p-2">
                                {material.harga_2024.bongkar}
                              </td>
                              <td className="border p-2">
                                {material.jenis_material}
                              </td>
                              <td className="border p-2">
                                {material.kategori}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h3 className="text-md font-semibold mb-2">
                        Detail Konstruksi
                      </h3>
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Nama Konstruksi</th>
                            <th className="border p-2">No</th>
                            <th className="border p-2">Nama Material</th>
                            <th className="border p-2">Satuan</th>
                            <th className="border p-2">Kuantitas</th>
                            <th className="border p-2">HPS RAB</th>
                            <th className="border p-2">Pasang RAB</th>
                            <th className="border p-2">Bongkar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredKonstruksi.map((konstruksi, index) => (
                            <React.Fragment key={index}>
                              <tr>
                                <td
                                  className="border p-2 align-middle"
                                  rowSpan={
                                    konstruksi.Detail_Material.length + 1
                                  }
                                >
                                  {konstruksi.id}
                                </td>
                                <td
                                  className="border p-2 align-middle"
                                  rowSpan={
                                    konstruksi.Detail_Material.length + 1
                                  }
                                >
                                  {konstruksi.Nama_Konstruksi}
                                </td>
                              </tr>
                              {konstruksi.Detail_Material.map((detail, idx) => (
                                <tr key={idx}>
                                  <td className="border p-2">{detail.nomor}</td>
                                  <td className="border p-2">{detail.nama}</td>
                                  <td className="border p-2">
                                    {detail.satuan}
                                  </td>
                                  <td className="border p-2">
                                    {detail.kuantitas}
                                  </td>
                                  <td className="border p-2">100rb</td>
                                  <td className="border p-2">100rb</td>
                                  <td className="border p-2">100rb</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )
              })()}
            </>
          )}
        </SheetContent>
      </Sheet>

      <div className="mt-8 w-screen overflow-y-auto">
        <h2 className="text-lg font-bold">Debug Submitted Surveys JSON</h2>
        <pre className="p-4 bg-background rounded">
          {JSON.stringify(submittedSurveys, null, 2)}
        </pre>
      </div>
    </div>
  )
}
