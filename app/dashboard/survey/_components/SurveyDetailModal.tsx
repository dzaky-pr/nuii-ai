import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import Image from 'next/image'
import { useGetSurveyDetail } from '../_hooks/@read/useGetSurveyDetail'

export default function SurveyDetailModal({ surveyId }: { surveyId: string }) {
  const { data: survey, isPending: loadingSurveyDetail } =
    useGetSurveyDetail(surveyId)

  const { isOpen, close } = useOverlayStore()
  const modalId = 'detail-survey-modal'

  return (
    <Dialog
      open={isOpen[modalId]}
      onOpenChange={isOpen => !isOpen && close(modalId)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Survey</DialogTitle>
        </DialogHeader>
        {loadingSurveyDetail ? (
          <div className="py-4">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="grid gap-8 py-4 text-sm">
            <div className="grid gap-4">
              <div className="flex justify-between">
                <p>Nama Survey</p>
                <p>{survey?.header.nama_survey}</p>
              </div>
              <div className="flex justify-between">
                <p>Lokasi</p>
                <p>{survey?.header.lokasi}</p>
              </div>
              <div className="flex justify-between">
                <p>Status</p>
                <p>{survey?.header.status_survey}</p>
              </div>
              <div className="flex justify-between">
                <p>ID Pengguna</p>
                <p>{survey?.header.user_id}</p>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto grid gap-8">
              {survey?.detail.map((item, index) => (
                <div key={index} className="grid gap-4">
                  <h2 className="font-medium text-base">Detail {index + 1}</h2>
                  <div className="flex justify-between">
                    <p>Nama Pekerjaan</p>
                    <p>{item.nama_pekerjaan}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Penyulang</p>
                    <p>{item.penyulang}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Panjang Jaringan</p>
                    <p>{item.panjang_jaringan} meter</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>Foto Survey</p>
                    <Image
                      src={item.foto}
                      alt="Foto Survey"
                      width={150}
                      height={110}
                      className="object-cover border border-neutral-700 rounded-md"
                    />
                  </div>
                  <div className="flex justify-between">
                    <p>Nama Pekerjaan</p>
                    <p>{item.keterangan}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Petugas Survey</p>
                    <p>{item.petugas_survey}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
