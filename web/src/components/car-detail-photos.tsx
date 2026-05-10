import { useState } from "react"
import { Car, Plus, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CarImageDialog } from "@/components/car-image-dialog"
import { CarDeleteImageDialog } from "@/components/car-delete-image-dialog"
import { apiClient } from "@/lib/api-client"
import type { CarImage } from "@/types/car-detail"

interface Props {
  carId: string
  images: CarImage[]
  onRefresh: () => void
}

export function CarDetailPhotos({ carId, images, onRefresh }: Props) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [deleteImageOpen, setDeleteImageOpen] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handleSetCover = async (imageId: string) => {
    try {
      await apiClient.patch(`/api/cars/${carId}/images/${imageId}/cover`)
      toast.success("Kapak fotoğrafı güncellendi")
      onRefresh()
    } catch {
      toast.error("Kapak fotoğrafı güncellenemedi")
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Fotoğraflar
        </p>
        <Button variant="outline" size="sm" onClick={() => setImageDialogOpen(true)}>
          <Plus className="mr-1.5 size-3.5" />
          Ekle
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
          <Car className="text-muted-foreground/30 mb-2 size-8" />
          <p className="text-muted-foreground text-sm">Henüz fotoğraf eklenmemiş</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative cursor-zoom-in overflow-hidden rounded-lg border"
              onClick={() => setLightboxIndex(idx)}
            >
              <img src={img.url} alt="" className="aspect-[4/3] w-full object-cover" />
              {img.is_cover && <Badge className="absolute top-2 left-2 text-[10px]">Kapak</Badge>}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {!img.is_cover && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSetCover(img.id)
                    }}
                  >
                    Kapak yap
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageId(img.id)
                    setDeleteImageOpen(true)
                  }}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <DialogContent className="max-w-5xl border-0 bg-black/95 p-0 shadow-2xl">
          {lightboxIndex !== null && (
            <div className="relative flex items-center justify-center">
              <img
                src={images[lightboxIndex].url}
                alt=""
                className="max-h-[88vh] w-full object-contain"
              />
              <button
                className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="size-4" />
              </button>
              {lightboxIndex > 0 && (
                <button
                  className="absolute left-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((i) => (i ?? 1) - 1)
                  }}
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {lightboxIndex < images.length - 1 && (
                <button
                  className="absolute right-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((i) => (i ?? 0) + 1)
                  }}
                >
                  <ChevronRight className="size-5" />
                </button>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white/70">
                {lightboxIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CarImageDialog
        carId={carId}
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onSaved={onRefresh}
      />
      <CarDeleteImageDialog
        carId={carId}
        imageId={selectedImageId}
        open={deleteImageOpen}
        onOpenChange={setDeleteImageOpen}
        onDeleted={() => {
          setSelectedImageId(null)
          onRefresh()
        }}
      />
    </div>
  )
}
