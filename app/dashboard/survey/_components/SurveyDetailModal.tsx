import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { SurveyDetail } from '@/lib/types/survey'
import Image from 'next/image'

export default function SurveyDetailModal({
  surveyDetail
}: {
  surveyDetail?: SurveyDetail
}) {
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
        <div className="max-h-[400px] overflow-y-auto py-4 text-sm">
          <div className="grid gap-8">
            <div className="grid gap-4">
              <div className="flex justify-between">
                <p>Nama Pekerjaan</p>
                <p>{surveyDetail?.nama_pekerjaan}</p>
              </div>
              <div className="flex justify-between">
                <p>Penyulang</p>
                <p>{surveyDetail?.penyulang}</p>
              </div>
              <div className="flex justify-between">
                <p>Panjang Jaringan</p>
                <p>{surveyDetail?.panjang_jaringan}</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex justify-between">
                <p>Foto</p>
                <Image
                  src={surveyDetail?.foto || ''}
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
            <div className="grid gap-4">
              <h2 className="font-semibold text-base">Koordinat</h2>
              <div className="flex justify-between">
                <p>Latitude</p>
                <p>{surveyDetail?.lat}</p>
              </div>
              <div className="flex justify-between">
                <p>Longitude</p>
                <p>{surveyDetail?.lat}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
