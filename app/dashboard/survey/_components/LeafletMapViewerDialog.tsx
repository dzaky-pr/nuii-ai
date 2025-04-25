import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle
} from '@/components/ui/dialog'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { SurveyDetailExtended } from '@/lib/types/survey'
import LeafletMapViewer from './LeafletMapViewer'

export default function LeafletMapViewerDialog({
  surveys
}: {
  surveys: SurveyDetailExtended[]
}) {
  const { isOpen, close } = useOverlayStore()
  const modalId = 'leaflet-map-viewer-modal'
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
          <LeafletMapViewer surveys={surveys} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
