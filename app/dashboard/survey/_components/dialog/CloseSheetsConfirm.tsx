import { Button } from '@/components/ui/button'
import useOverlayStore from '@/lib/hooks/useOverlayStore'
import { cn } from '@/lib/utils'
import { FieldValues, UseFormReset } from 'react-hook-form'

export function CloseSheetsConfirmationDialog<T extends FieldValues>({
  dialogId,
  sheetId,
  reset
}: {
  dialogId: string
  sheetId: string
  reset: UseFormReset<T>
}) {
  const { isOpen, close } = useOverlayStore()

  return (
    <div
      className={cn(
        'z-[9999] inset-0 bg-black/50 flex items-center justify-center pointer-events-auto',
        isOpen[dialogId] ? 'fixed' : 'hidden'
      )}
    >
      <div className="bg-background border border-muted p-6 rounded-lg max-w-sm">
        <h3 className="font-bold text-lg">Batal Mengisi Form?</h3>
        <p className="py-4">Data yang sudah diisi akan hilang</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              reset()
              close(sheetId)
              close(dialogId)
            }}
          >
            Batalkan
          </Button>
          <Button variant="outline" onClick={() => close(dialogId)}>
            Lanjutkan
          </Button>
        </div>
      </div>
    </div>
  )
}
