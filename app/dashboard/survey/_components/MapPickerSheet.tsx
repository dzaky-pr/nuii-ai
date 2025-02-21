import { DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import MapPicker from './MapPicker'

type MapSheetProps = {
  coordinates: {
    lat: number
    long: number
  }
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MapPickerSheet({
  coordinates,
  isOpen,
  setIsOpen
}: MapSheetProps) {
  const { setValue } = useFormContext()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>Map Viewer</DialogTitle>
        </VisuallyHidden>
        <MapPicker
          initialPosition={{
            lat: coordinates.lat,
            lng: coordinates.long
          }}
          onPositionChange={newPos => {
            setValue('detail.lat', newPos.lat.toString())
            setValue('detail.lng', newPos.lng.toString())
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
