'use client'

import { Button } from '@/components/ui/button'
import { baseURL } from '@/lib/tools/api'
import { useAuth } from '@clerk/nextjs'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  constructionTableHeader,
  materialTableHeader,
  poleTableHeader,
  surveyDetailTableHeader,
  surveyHeaderTableHeader
} from '../_data/tableHeader'
import { useGetSurveyReportDetail } from '../_hooks/useGetSurveyReportDetail'

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
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {surveyHeaderTableHeader.map((item, index) => (
                  <th key={index} className="border p-2">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border p-2">{report.data_survey.id}</td>
                <td className="border p-2">{report.data_survey.nama_survey}</td>
                <td className="border p-2">
                  {report.data_survey.nama_pekerjaan}
                </td>
                <td className="border p-2">{report.data_survey.lokasi}</td>
                <td className="border p-2">
                  {report.data_survey.status_survey}
                </td>
                <td className="border p-2">
                  {report.data_survey.id_material_konduktor}
                </td>
                <td className="border p-2">{report.data_survey.user_id}</td>
                <td className="border p-2">
                  {format(
                    report.data_survey.created_at,
                    'EEEE, d MMM yyyy HH:mm',
                    {
                      locale: id
                    }
                  )}{' '}
                  WIB
                </td>
                <td className="border p-2 text-center">
                  {format(
                    report.data_survey.updated_at,
                    'EEEE, d MMM yyyy HH:mm',
                    {
                      locale: id
                    }
                  )}{' '}
                  WIB
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Detail Survey</h4>
          {!report.data_survey.survey_details ? (
            <p className="text-sm">Detail survey tidak tersedia.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {surveyDetailTableHeader.map((item, index) => (
                      <th key={index} className="border p-2">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.data_survey.survey_details.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{item.id}</td>
                      <td className="border p-2">{item.id_material_tiang}</td>
                      <td className="border p-2">{item.id_konstruksi}</td>
                      <td className="border p-2">{item.id_header}</td>
                      <td className="border p-2">{item.id_pole_supporter}</td>
                      <td className="border p-2">
                        {item.id_grounding_termination}
                      </td>
                      <td className="border p-2">{item.penyulang}</td>
                      <td className="border p-2">{item.panjang_jaringan} m</td>
                      <td className="border p-2">
                        Lat: {item.lat}, <br /> Long: {item.long}
                      </td>
                      <td className="border p-2">
                        {item.foto ? (
                          <Image
                            src={item.foto}
                            alt="Foto Survey"
                            width={100}
                            height={60}
                            className="object-cover"
                          />
                        ) : (
                          'Foto tidak tersedia.'
                        )}
                      </td>
                      <td className="border p-2">{item.keterangan}</td>
                      <td className="border p-2">{item.petugas_survey}</td>
                      <td className="border p-2">{item.created_at}</td>
                      <td className="border p-2">{item.updated_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Detail Pole</h4>
          {!report.detail_poles ? (
            <p className="text-sm">Detail pole tidak tersedia.</p>
          ) : (
            report.detail_poles.map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <p>ID Pole: {item.idPole}</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        {poleTableHeader.map((item, index) => (
                          <th key={index} className="border p-2">
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="border p-2">{item.data_pole.id}</td>
                        <td className="border p-2">
                          {item.data_pole.nama_pole}
                        </td>
                        <td className="border p-2">
                          {item.data_pole.nama_grounding}
                        </td>
                        <td className="border p-2">
                          {format(
                            item.data_pole.created_at,
                            'EEEE, d MMM yyyy HH:mm',
                            {
                              locale: id
                            }
                          )}{' '}
                          WIB
                        </td>
                        <td className="border p-2 text-center">
                          {format(
                            item.data_pole.updated_at,
                            'EEEE, d MMM yyyy HH:mm',
                            {
                              locale: id
                            }
                          )}{' '}
                          WIB
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>Pole Materials</p>
                {item.materials.length < 2 ? (
                  <p className="text-sm">
                    Detail pole materials tidak tersedia.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          {materialTableHeader.map((item, index) => (
                            <th key={index} className="border p-2">
                              {item}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {item.materials.map((material, materialIdx) => (
                          <tr key={materialIdx} className="text-center">
                            <td className="border p-2">
                              {material.data_material.id}
                            </td>
                            <td className="border p-2">
                              {material.data_material.id_tipe_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.nomor_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.nama_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.satuan_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.berat_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.harga_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.pasang_rab}
                            </td>
                            <td className="border p-2">
                              {material.data_material.bongkar}
                            </td>
                            <td className="border p-2">
                              {material.data_material.jenis_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.kategori_material}
                            </td>
                            <td className="border p-2">
                              {format(
                                material.data_material.created_at,
                                'EEEE, d MMM yyyy HH:mm',
                                {
                                  locale: id
                                }
                              )}{' '}
                              WIB
                            </td>
                            <td className="border p-2 text-center">
                              {format(
                                material.data_material.updated_at,
                                'EEEE, d MMM yyyy HH:mm',
                                {
                                  locale: id
                                }
                              )}{' '}
                              WIB
                            </td>
                            <td className="border p-2">
                              {material.tipe_pekerjaan}
                            </td>
                            <td className="border p-2">{material.kuantitas}</td>
                            <td className="border p-2">
                              {material.total_kuantitas}
                            </td>
                            <td className="border p-2">
                              {material.total_berat}
                            </td>
                            <td className="border p-2">
                              {material.total_harga_material}
                            </td>
                            <td className="border p-2">
                              {material.total_pasang}
                            </td>
                            <td className="border p-2">
                              {material.total_bongkar}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {materialTableHeader.map((item, index) => (
                      <th key={index} className="border p-2">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.detail_tiang.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{item.data_tiang?.id}</td>
                      <td className="border p-2">
                        {item.data_tiang?.id_tipe_material}
                      </td>
                      <td className="border p-2">
                        {item.data_tiang?.nomor_material}
                      </td>
                      <td className="border p-2">
                        {item.data_tiang?.nama_material}
                      </td>
                      <td className="border p-2">
                        {item.data_tiang?.satuan_material}
                      </td>
                      <td className="border p-2">
                        {item.data_tiang?.berat_material}
                      </td>
                      <td className="border p-2">
                        {item.data_tiang?.harga_material}
                      </td>
                      <td className="border p-2">
                        {item.data_tiang?.pasang_rab}
                      </td>
                      <td className="border p-2">{item.data_tiang?.bongkar}</td>
                      <td className="border p-2">
                        {item.data_tiang?.jenis_material}
                      </td>
                      <td className="border p-2">
                        {item.data_tiang?.kategori_material}
                      </td>
                      <td className="border p-2">
                        {format(
                          item.data_tiang?.created_at ?? '',
                          'EEEE, d MMM yyyy HH:mm',
                          {
                            locale: id
                          }
                        )}{' '}
                        WIB
                      </td>
                      <td className="border p-2 text-center">
                        {format(
                          item.data_tiang?.updated_at ?? '',
                          'EEEE, d MMM yyyy HH:mm',
                          {
                            locale: id
                          }
                        )}{' '}
                        WIB
                      </td>
                      <td className="border p-2">{item.total_kuantitas}</td>
                      <td className="border p-2">{item.total_berat}</td>
                      <td className="border p-2">
                        {item.total_harga_material}
                      </td>
                      <td className="border p-2">{item.total_pasang}</td>
                      <td className="border p-2">{item.total_bongkar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        {constructionTableHeader.map((item, index) => (
                          <th key={index} className="border p-2">
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="border p-2">
                          {item.data_konstruksi.id}
                        </td>
                        <td className="border p-2">
                          {item.data_konstruksi.nama_konstruksi}
                        </td>
                        <td className="border p-2">
                          {item.data_konstruksi.nomor_konstruksi}
                        </td>
                        <td className="border p-2">
                          {format(
                            item.data_konstruksi.created_at,
                            'EEEE, d MMM yyyy HH:mm',
                            {
                              locale: id
                            }
                          )}{' '}
                          WIB
                        </td>
                        <td className="border p-2 text-center">
                          {format(
                            item.data_konstruksi.updated_at,
                            'EEEE, d MMM yyyy HH:mm',
                            {
                              locale: id
                            }
                          )}{' '}
                          WIB
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>Material Konstruksi</p>
                {item.materials.length < 2 ? (
                  <p className="text-sm">
                    Detail material konstruksi tidak tersedia.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          {materialTableHeader.map((item, index) => (
                            <th key={index} className="border p-2">
                              {item}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {item.materials.map((material, materialIdx) => (
                          <tr key={materialIdx} className="text-center">
                            <td className="border p-2">
                              {material.data_material.id}
                            </td>
                            <td className="border p-2">
                              {material.data_material.id_tipe_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.nomor_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.nama_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.satuan_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.berat_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.harga_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.pasang_rab}
                            </td>
                            <td className="border p-2">
                              {material.data_material.bongkar}
                            </td>
                            <td className="border p-2">
                              {material.data_material.jenis_material}
                            </td>
                            <td className="border p-2">
                              {material.data_material.kategori_material}
                            </td>
                            <td className="border p-2">
                              {format(
                                material.data_material.created_at,
                                'EEEE, d MMM yyyy HH:mm',
                                {
                                  locale: id
                                }
                              )}{' '}
                              WIB
                            </td>
                            <td className="border p-2 text-center">
                              {format(
                                material.data_material.updated_at,
                                'EEEE, d MMM yyyy HH:mm',
                                {
                                  locale: id
                                }
                              )}{' '}
                              WIB
                            </td>
                            <td className="border p-2">
                              {material.tipe_pekerjaan}
                            </td>
                            <td className="border p-2">{material.kuantitas}</td>
                            <td className="border p-2">
                              {material.total_kuantitas}
                            </td>
                            <td className="border p-2">
                              {material.total_berat}
                            </td>
                            <td className="border p-2">
                              {material.total_harga_material}
                            </td>
                            <td className="border p-2">
                              {material.total_pasang}
                            </td>
                            <td className="border p-2">
                              {material.total_bongkar}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {materialTableHeader.map((item, index) => (
                      <th key={index} className="border p-2">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.detail_konduktor.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{item.data_konduktor?.id}</td>
                      <td className="border p-2">
                        {item.data_konduktor?.id_tipe_material}
                      </td>
                      <td className="border p-2">
                        {item.data_konduktor?.nomor_material}
                      </td>
                      <td className="border p-2">
                        {item.data_konduktor?.nama_material}
                      </td>
                      <td className="border p-2">
                        {item.data_konduktor?.satuan_material}
                      </td>
                      <td className="border p-2">
                        {item.data_konduktor?.berat_material}
                      </td>
                      <td className="border p-2">
                        {item.data_konduktor?.harga_material}
                      </td>
                      <td className="border p-2">
                        {item.data_konduktor?.pasang_rab}
                      </td>
                      <td className="border p-2">
                        {item.data_konduktor?.bongkar}
                      </td>
                      <td className="border p-2">
                        {item.data_konduktor?.jenis_material}
                      </td>
                      <td className="border p-2">
                        {item.data_konduktor?.kategori_material}
                      </td>
                      <td className="border p-2">
                        {format(
                          item.data_konduktor?.created_at ?? '',
                          'EEEE, d MMM yyyy HH:mm',
                          {
                            locale: id
                          }
                        )}{' '}
                        WIB
                      </td>
                      <td className="border p-2 text-center">
                        {format(
                          item.data_konduktor?.updated_at ?? '',
                          'EEEE, d MMM yyyy HH:mm',
                          {
                            locale: id
                          }
                        )}{' '}
                        WIB
                      </td>
                      <td className="border p-2">{item.total_kuantitas}</td>
                      <td className="border p-2">{item.total_berat}</td>
                      <td className="border p-2">
                        {item.total_harga_material}
                      </td>
                      <td className="border p-2">{item.total_pasang}</td>
                      <td className="border p-2">{item.total_bongkar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
