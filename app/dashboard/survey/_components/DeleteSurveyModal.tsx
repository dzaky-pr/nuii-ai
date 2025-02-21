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
}

export default function DeleteSurveyModal({ onSubmit, onCancel }: ModalProps) {
  const { isOpen, close } = useOverlayStore()

  const modalId = 'delete-survey-modal'

  return (
    <AlertDialog
      open={isOpen[modalId]}
      onOpenChange={isOpen => !isOpen && close(modalId)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin ingin menghapus survey ini?
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
