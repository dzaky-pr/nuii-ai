import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle
} from '@/components/ui/dialog'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { SurveyDetail } from '@/lib/types/survey'
import MapViewer from './MapViewer'

export default function MapViewerDialog({
  surveys
}: {
  surveys: SurveyDetail[]
}) {
  const { isOpen, close } = useOverlayStore()
  const modalId = 'map-viewer-modal'
  return (
    <Dialog
      open={isOpen[modalId]}
      onOpenChange={isOpen => !isOpen && close(modalId)}
    >
      <DialogPortal>
        <DialogContent className="bg-background p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Lokasi Survey</DialogTitle>
            <DialogDescription>
              Geser peta untuk melihat lokasi sekitar.
            </DialogDescription>
          </DialogHeader>
          <MapViewer surveys={surveys} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
