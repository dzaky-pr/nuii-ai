import { DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

type MapViewerProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MapViewerSheet({ isOpen, setIsOpen }: MapViewerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>Map Viewer</DialogTitle>
        </VisuallyHidden>
        {/* <MapViewer surveys={groupedSurveys[selectedMapSurvey]} /> */}
      </SheetContent>
    </Sheet>
  )
}
