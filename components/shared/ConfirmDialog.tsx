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

type ConfirmDialogProps = {
  dialogId: string
  title: string
  description: string
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export default function ConfirmDialog({
  dialogId,
  title,
  description,
  onConfirm,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'default'
}: ConfirmDialogProps) {
  const { isOpen, close } = useOverlayStore()

  const handleConfirm = () => {
    onConfirm()
    close(dialogId)
  }

  return (
    <AlertDialog
      open={isOpen[dialogId]}
      onOpenChange={openState => {
        if (!openState) {
          close(dialogId)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => close(dialogId)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              variant === 'destructive'
                ? 'bg-red-500 hover:bg-red-600'
                : undefined
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
