import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CarDeleteImageDialogProps {
  carId: string
  imageId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

export function CarDeleteImageDialog({ carId, imageId, open, onOpenChange, onDeleted }: CarDeleteImageDialogProps) {
  const handleDelete = async () => {
    if (!carId || !imageId) return
    try {
      await apiClient.delete(`/api/cars/${carId}/images/${imageId}`)
      toast.success("Fotoğraf silindi")
      onOpenChange(false)
      onDeleted()
    } catch {
      toast.error("Fotoğraf silinemedi")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Fotoğraf silinsin mi?</AlertDialogTitle>
          <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
