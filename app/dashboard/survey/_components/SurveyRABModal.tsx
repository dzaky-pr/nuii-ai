import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import Image from 'next/image'
import { useGetSurveyRAB } from '../_hooks/@read/useGetSurveyRAB'

export default function SurveyRABModal({ surveyId }: { surveyId: string }) {
  const { data: survey, isPending } = useGetSurveyRAB(surveyId)

  const { isOpen, close } = useOverlayStore()
  const modalId = 'rab-survey-modal'

  return (
    <Dialog
      open={isOpen[modalId]}
      onOpenChange={isOpen => !isOpen && close(modalId)}
    >
      <DialogContent className="bg-background p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            RAB Survey {survey?.data_survey.nama_survey}
          </DialogTitle>
        </DialogHeader>
        {isPending ? (
          <div>
            <p className="text-sm">Loading...</p>
          </div>
        ) : !survey ? (
          <div>
            <p className="text-sm">Data RAB survey tidak tersedia.</p>
          </div>
        ) : (
          <div className="grid gap-8 text-sm">
            <div className="grid gap-4">
              <div className="flex justify-between">
                <p>Lokasi</p>
                <p>{survey.data_survey.lokasi}</p>
              </div>
              <div className="flex justify-between">
                <p>Status</p>
                <p>{survey.data_survey.status_survey}</p>
              </div>
              <div className="flex justify-between">
                <p>ID Pengguna</p>
                <p>{survey.data_survey.user_id}</p>
              </div>
            </div>
            {survey.data_survey.survey_details.map((surveyDetail, index) => (
              <div key={index} className="grid gap-4">
                <h2 className="text-base font-semibold">
                  Survey {surveyDetail.id}
                </h2>
                <div className="flex justify-between">
                  <p>Nama Pekerjaan</p>
                  <p>{surveyDetail.nama_pekerjaan}</p>
                </div>
                <div className="flex justify-between">
                  <p>Penyulang</p>
                  <p>{surveyDetail.penyulang}</p>
                </div>
                <div className="flex justify-between">
                  <p>Panjang Jaringan</p>
                  <p>{surveyDetail.panjang_jaringan}</p>
                </div>
                <div className="flex justify-between">
                  <p>Latitude</p>
                  <p>{surveyDetail.lat}</p>
                </div>
                <div className="flex justify-between">
                  <p>Longitude</p>
                  <p>{surveyDetail.long}</p>
                </div>
                <div className="flex justify-between">
                  <p>Foto</p>
                  <Image
                    src={surveyDetail.foto || ''}
                    alt="Foto Survey"
                    width={150}
                    height={110}
                    className="object-cover border border-neutral-700 rounded-md"
                  />
                </div>
                <div className="flex justify-between">
                  <p>Keterangan</p>
                  <p>{surveyDetail?.keterangan}</p>
                </div>
                <div className="flex justify-between">
                  <p>Nama Petugas</p>
                  <p>{surveyDetail?.petugas_survey}</p>
                </div>
              </div>
            ))}
            {!survey.data_survey.detail_tiang ? (
              <div>
                <h2 className="text-base font-semibold">
                  Detail tiang tidak tersedia.
                </h2>
              </div>
            ) : (
              survey.data_survey.detail_tiang.map((tiang, index) => (
                <div key={index} className="grid gap-4">
                  <h2 className="text-base font-semibold">Tiang {tiang.id}</h2>
                  <div className="flex justify-between">
                    <p>Nama Tiang</p>
                    <p>{tiang.nama_material}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Satuan</p>
                    <p>{tiang.satuan_material}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Berat</p>
                    <p>{tiang.berat_material}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Pasanga RAB</p>
                    <p>{tiang.pasang_rab}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Bongkar RAB</p>
                    <p>{tiang.bongkar}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Jenis</p>
                    <p>{tiang.jenis_material}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Kategori</p>
                    <p>{tiang.kategori_material}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Jumlah Total</p>
                    <p>{tiang.total_kuantitas}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Total Harga</p>
                    <p>{tiang.total_harga_material}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Total Pasang</p>
                    <p>{tiang.total_pasang}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Total Bongkar</p>
                    <p>{tiang.total_bongkar}</p>
                  </div>
                </div>
              ))
            )}
            {!survey.data_survey.detail_konstruksi ? (
              <div>
                <h2 className="text-base font-semibold">
                  Detail konstruksi tidak tersedia.
                </h2>
              </div>
            ) : (
              survey.data_survey.detail_konstruksi.map((konstruksi, index) => (
                <div key={index} className="grid gap-4">
                  <h2 className="text-base font-semibold">
                    Kontruksi {konstruksi.idKonstruksi}
                  </h2>
                  {konstruksi.material.map((material, matIndex) => (
                    <div key={matIndex} className="grid gap-4">
                      <h2 className="text-base font-semibold">
                        Material {material.id}
                      </h2>
                      <div className="flex justify-between">
                        <p>Nama Material</p>
                        <p>{material.nama_material}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Satuan</p>
                        <p>{material.satuan_material}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Berat</p>
                        <p>{material.berat_material}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Pasanga RAB</p>
                        <p>{material.pasang_rab}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Bongkar RAB</p>
                        <p>{material.bongkar}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Jenis</p>
                        <p>{material.jenis_material}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Kategori</p>
                        <p>{material.kategori_material}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Jumlah Total</p>
                        <p>{material.total_kuantitas}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Total Harga</p>
                        <p>{material.total_harga_material}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Total Pasang</p>
                        <p>{material.total_pasang}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Total Bongkar</p>
                        <p>{material.total_bongkar}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
