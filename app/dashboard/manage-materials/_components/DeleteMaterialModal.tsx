'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import useOverlayStore from '@/lib/hooks/useOverlayStore'

type ModalProps = {
  onSubmit: () => void
  onCancel: () => void
  modalId: string
}

export default function DeleteMaterialModal({
  onSubmit,
  onCancel,
  modalId
}: ModalProps) {
  const { isOpen, close } = useOverlayStore()

  return (
    <AlertDialog
      open={isOpen[modalId]}
      onOpenChange={openState => {
        if (!openState) {
          close(modalId)
          onCancel()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin ingin menghapus material ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Data yang sudah dihapus tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
