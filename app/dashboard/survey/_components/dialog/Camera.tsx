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
import { Camera } from 'react-camera-pro'
import { useFormContext } from 'react-hook-form'

export function CameraDialog({
  dialogId,
  ref
}: {
  dialogId: string
  ref: any
}) {
  const { isOpen, close } = useOverlayStore()

  const { setValue } = useFormContext<{ foto: string }>()

  return (
    <Dialog
      open={isOpen[dialogId]}
      onOpenChange={isOpen => !isOpen && close(dialogId)}
    >
      <DialogPortal>
        <DialogContent className="bg-background p-6 rounded-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Ambil Foto</DialogTitle>
            <DialogDescription>
              Pastikan kamera menghadap dengan benar.
            </DialogDescription>
          </DialogHeader>
          <Camera
            ref={ref}
            aspectRatio={1 / 1}
            facingMode="environment"
            errorMessages={{
              noCameraAccessible: 'Kamera pada perangkat tidak dapat diakses',
              permissionDenied: 'Akses ditolak',
              switchCamera: 'Switch kamera',
              canvas: 'Canvas tidak didukung'
            }}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => {
                const photo = ref.current.takePhoto()
                setValue('foto', photo, { shouldDirty: true, shouldValidate: true })
                close(dialogId)
              }}
            >
              Ambil Foto
            </Button>
            <Button variant="outline" onClick={() => close(dialogId)}>
              Batal
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
