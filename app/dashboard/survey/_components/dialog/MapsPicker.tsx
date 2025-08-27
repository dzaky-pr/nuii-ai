import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle
} from '@/components/ui/dialog'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { useFormContext } from 'react-hook-form'
import { MapPicker } from '../maps/Picker'

export function MapsPickerDialog({ dialogId }: { dialogId: string }) {
  const { isOpen, close } = useOverlayStore()

  const { setValue, reset, watch } = useFormContext<{
    lat: string
    long: string
  }>()

  const latitude = watch('lat')
  const longitude = watch('long')

  return (
    <Dialog
      open={isOpen[dialogId]}
      onOpenChange={isOpen => !isOpen && close(dialogId)}
    >
      <DialogPortal>
        <DialogContent className="bg-background p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Atur Lokasi di Peta</DialogTitle>
            <DialogDescription>
              Geser peta untuk menyesuaikan lokasi yang diinginkan.
            </DialogDescription>
          </DialogHeader>
          <MapPicker
            initialPosition={{
              lat: Number(latitude),
              lng: Number(longitude)
            }}
            onPositionChange={newPos => {
              setValue('lat', newPos.lat.toString())
              setValue('long', newPos.lng.toString())
            }}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={() => close(dialogId)}>Simpan Lokasi</Button>
            <Button
              variant="outline"
              onClick={() => {
                close(dialogId)
                reset({
                  lat: '0',
                  long: '0'
                })
              }}
            >
              Batal
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
