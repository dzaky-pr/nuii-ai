'use client'

import { Button } from '@/components/ui/button'
import { baseURL } from '@/lib/tools/api'
import { useAuth } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  constructionTableHeader,
  materialTableHeader,
  materialTableHeaderLite,
  poleTableHeader,
  surveyDetailTableHeader,
  surveyHeaderTableHeader
} from '../_data/tableHeader'
import { useGetSurveyReportDetail } from '../_hooks/useGetSurveyReportDetail'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function DetailReportPage({ reportId }: { reportId: string }) {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false)

  const router = useRouter()
  const { getToken } = useAuth()
  const { data: report, isPending } = useGetSurveyReportDetail(reportId)

  const handleDownloadReport = async () => {
    setIsDownloadLoading(true)

    try {
      const token = await getToken()

      const response = await fetch(
        `${baseURL}/survey/export/excel/${reportId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Gagal mengunduh file report: ${response.statusText}`)
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const date = new Date()
      const a = document.createElement('a')
      a.href = blobUrl
      a.setAttribute(
        'download',
        `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}_REPORT-SURVEY-${reportId}.xlsx`
      )

      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Gagal mengunduh: ', error.message)
        toast.error(`Gagal mengunduh file report. Silakan coba lagi!`)
      }
    } finally {
      toast.success('Berhasil mengunduh file report!')
      setIsDownloadLoading(false)
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (isPending) {
    return (
      <div className="grid place-items-center min-h-screen">
        <h2 className="font-semibold">Loading...</h2>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="grid place-items-center min-h-screen">
        <h2 className="font-semibold">Data laporan survey tidak tersedia.</h2>
      </div>
    )
  }

  return (
    <>
      <div className="py-4 px-10 flex flex-col gap-8 my-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Button
              asChild
              size="icon"
              variant="outline"
              onClick={() => router.back()}
            >
              <span>
                <ArrowLeft size={20} />
              </span>
            </Button>
            <h3 className="font-semibold">Report {reportId}</h3>
          </div>
          <div className="flex gap-4 items-center">
            <Button size="sm" variant="outline" onClick={handleDownloadReport}>
              {isDownloadLoading ? 'Downloading...' : 'Download Report'}
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {surveyHeaderTableHeader.map((item, index) => (
                  <TableHead key={index}>{item}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {surveyHeaderTableHeader.map((header, index) => {
                  const surveyHeaderMap: Record<string, string | number> = {
                    ID: report.data_survey.id,
                    'Nama Survey': report.data_survey.nama_survey,
                    'Nama Pekerjaan': report.data_survey.nama_pekerjaan,
                    Lokasi: report.data_survey.lokasi,
                    'Status Survey': report.data_survey.status_survey,
                    'ID Material Konduktor':
                      report.data_survey.id_material_konduktor
                  }

                  return (
                    <TableCell key={index}>
                      {surveyHeaderMap[header] || ''}
                    </TableCell>
                  )
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Detail Survey</h4>
          {!report.data_survey.survey_details ? (
            <p className="text-sm">Detail survey tidak tersedia.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {surveyDetailTableHeader.map((item, index) => (
                      <TableHead key={index}>{item}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.data_survey.survey_details.map((item, index) => (
                    <TableRow key={index}>
                      {surveyDetailTableHeader.map((header, idx) => {
                        const surveyDetailMap: Record<string, React.ReactNode> =
                          {
                            ID: item.id,
                            'ID Material Tiang': item.id_material_tiang,
                            'ID Konstruksi': item.id_konstruksi,
                            'ID Pole Suporter': item.id_pole_supporter ?? '-',
                            'ID Grounding Termination':
                              item.id_grounding_termination ?? '-',
                            Penyulang: item.penyulang,
                            'Panjang Jaringan': `${item.panjang_jaringan} m`,
                            Koordinat: (
                              <>
                                Lat: {item.lat}, <br /> Long: {item.long}
                              </>
                            ),
                            Foto:
                              item.foto !== '-' && item.foto ? (
                                <Image
                                  src={item.foto}
                                  alt="Foto Survey"
                                  width={100}
                                  height={60}
                                  className="object-cover"
                                />
                              ) : (
                                'Foto tidak tersedia.'
                              ),
                            Keterangan:
                              !item.keterangan || item.keterangan == ''
                                ? '-'
                                : item.keterangan,
                            'Nama Petugas': item.petugas_survey
                          }

                        return (
                          <TableCell key={idx}>
                            {surveyDetailMap[header]}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Detail Pole</h4>
          {report.detail_poles.length === 0 ? (
            <p className="text-sm">Tidak ada Pole Supporter</p>
          ) : (
            report.detail_poles.map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <p>ID Pole: {item.idPole}</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {poleTableHeader.map((item, index) => (
                          <TableHead key={index}>{item}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        {poleTableHeader.map((header, idx) => {
                          const poleMap: Record<string, string | number> = {
                            ID: item.data_pole.id,
                            'Nama Pole':
                              item.data_pole.nama_pole_supporter ?? '',
                            'Nama Grounding':
                              item.data_pole.nama_grounding_termination ?? ''
                          }

                          return (
                            <TableCell key={idx}>{poleMap[header]}</TableCell>
                          )
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <p>Pole Materials</p>
                {item.materials.length < 2 ? (
                  <p className="text-sm">
                    Detail material pole tidak tersedia.
                  </p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {materialTableHeader.map((item, index) => (
                            <TableHead key={index}>{item}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.materials.map((material, materialIdx) => (
                          <TableRow key={materialIdx}>
                            {materialTableHeader.map((header, idx) => {
                              const materialMap: Record<
                                string,
                                string | number
                              > = {
                                ID: material.data_material.id,
                                'ID Tipe Material':
                                  material.data_material.id_tipe_material,
                                'Nomor Material':
                                  material.data_material.nomor_material,
                                'Nama Material':
                                  material.data_material.nama_material,
                                'Satuan Material':
                                  material.data_material.satuan_material,
                                'Berat Material':
                                  material.data_material.berat_material,
                                'Harga Material':
                                  material.data_material.harga_material,
                                'Pasang RAB': material.data_material.pasang_rab,
                                Bongkar: material.data_material.bongkar,
                                'Jenis Material':
                                  material.data_material.jenis_material,
                                'Kategori Material':
                                  material.data_material.kategori_material,
                                'Tipe Pekerjaan': material.tipe_pekerjaan,
                                Kuantitas: material.kuantitas,
                                'Total Kuantitas': material.total_kuantitas,
                                'Total Berat': material.total_berat,
                                'Total Harga Material':
                                  material.total_harga_material,
                                'Total Pasang': material.total_pasang,
                                'Total Bongkar': material.total_bongkar
                              }

                              return (
                                <TableCell key={idx}>
                                  {materialMap[header]}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Detail Tiang</h4>
          {!report.detail_tiang ? (
            <p className="text-sm">Detail tiang tidak tersedia.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {materialTableHeaderLite.map((item, index) => (
                      <TableHead key={index}>{item}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.detail_tiang.map((item, index) => (
                    <TableRow key={index}>
                      {materialTableHeaderLite.map((header, idx) => {
                        const materialMap: Record<string, string | number> = {
                          ID: item.data_tiang?.id ?? 0,
                          'ID Tipe Material':
                            item.data_tiang?.id_tipe_material ?? 0,
                          'Nomor Material':
                            item.data_tiang?.nomor_material ?? 0,
                          'Nama Material': item.data_tiang?.nama_material ?? '',
                          'Satuan Material':
                            item.data_tiang?.satuan_material ?? '',
                          'Berat Material':
                            item.data_tiang?.berat_material ?? '',
                          'Harga Material':
                            item.data_tiang?.harga_material ?? 0,
                          'Pasang RAB': item.data_tiang?.pasang_rab ?? 0,
                          Bongkar: item.data_tiang?.bongkar ?? 0,
                          'Jenis Material':
                            item.data_tiang?.jenis_material ?? '',
                          'Kategori Material':
                            item.data_tiang?.kategori_material ?? '',
                          'Total Kuantitas': item.total_kuantitas,
                          'Total Berat': item.total_berat,
                          'Total Harga Material': item.total_harga_material,
                          'Total Pasang': item.total_pasang,
                          'Total Bongkar': item.total_bongkar
                        }

                        return (
                          <TableCell key={idx}>{materialMap[header]}</TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Detail Konstruksi</h4>
          {!report.detail_konstruksi ? (
            <p className="text-sm">Detail konstruksi tidak tersedia.</p>
          ) : (
            report.detail_konstruksi.map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <p>ID Konstruksi: {item.idKonstruksi}</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {constructionTableHeader.map((item, index) => (
                          <TableHead key={index}>{item}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        {constructionTableHeader.map((header, idx) => {
                          const constructionMap: Record<
                            string,
                            string | number
                          > = {
                            ID: item.data_konstruksi.id,
                            'Nama Konstruksi':
                              item.data_konstruksi.nama_konstruksi,
                            'Nomor Konstruksi':
                              item.data_konstruksi.nomor_konstruksi
                          }

                          return (
                            <TableCell key={idx}>
                              {constructionMap[header]}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <p>Material Konstruksi</p>
                {item.materials.length < 2 ? (
                  <p className="text-sm">
                    Detail material konstruksi tidak tersedia.
                  </p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {materialTableHeader.map((item, index) => (
                            <TableHead key={index}>{item}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.materials.map((material, materialIdx) => (
                          <TableRow key={materialIdx}>
                            {materialTableHeader.map((header, idx) => {
                              const materialMap: Record<
                                string,
                                string | number
                              > = {
                                ID: material.data_material.id,
                                'ID Tipe Material':
                                  material.data_material.id_tipe_material,
                                'Nomor Material':
                                  material.data_material.nomor_material,
                                'Nama Material':
                                  material.data_material.nama_material,
                                'Satuan Material':
                                  material.data_material.satuan_material,
                                'Berat Material':
                                  material.data_material.berat_material,
                                'Harga Material':
                                  material.data_material.harga_material,
                                'Pasang RAB': material.data_material.pasang_rab,
                                Bongkar: material.data_material.bongkar,
                                'Jenis Material':
                                  material.data_material.jenis_material,
                                'Kategori Material':
                                  material.data_material.kategori_material,
                                'Tipe Pekerjaan': material.tipe_pekerjaan,
                                Kuantitas: material.kuantitas,
                                'Total Kuantitas': material.total_kuantitas,
                                'Total Berat': material.total_berat,
                                'Total Harga Material':
                                  material.total_harga_material,
                                'Total Pasang': material.total_pasang,
                                'Total Bongkar': material.total_bongkar
                              }

                              return (
                                <TableCell key={idx}>
                                  {materialMap[header]}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Detail Konduktor</h4>
          {!report.detail_konduktor ? (
            <p className="text-sm">Detail konduktor tidak tersedia.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {materialTableHeaderLite.map((item, index) => (
                      <TableHead key={index}>{item}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.detail_konduktor.map((item, index) => (
                    <TableRow key={index}>
                      {materialTableHeaderLite.map((header, idx) => {
                        const materialMap: Record<string, string | number> = {
                          ID: item.data_konduktor?.id ?? 0,
                          'ID Tipe Material':
                            item.data_konduktor?.id_tipe_material ?? 0,
                          'Nomor Material':
                            item.data_konduktor?.nomor_material ?? 0,
                          'Nama Material':
                            item.data_konduktor?.nama_material ?? '',
                          'Satuan Material':
                            item.data_konduktor?.satuan_material ?? '',
                          'Berat Material':
                            item.data_konduktor?.berat_material ?? '',
                          'Harga Material':
                            item.data_konduktor?.harga_material ?? 0,
                          'Pasang RAB': item.data_konduktor?.pasang_rab ?? 0,
                          Bongkar: item.data_konduktor?.bongkar ?? 0,
                          'Jenis Material':
                            item.data_konduktor?.jenis_material ?? '',
                          'Kategori Material':
                            item.data_konduktor?.kategori_material ?? '',
                          'Total Kuantitas': item.total_kuantitas,
                          'Total Berat': item.total_berat,
                          'Total Harga Material': item.total_harga_material,
                          'Total Pasang': item.total_pasang,
                          'Total Bongkar': item.total_bongkar
                        }

                        return (
                          <TableCell key={idx}>{materialMap[header]}</TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
