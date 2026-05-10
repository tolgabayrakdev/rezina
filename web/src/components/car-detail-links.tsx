import { useState } from "react"
import { Plus, Trash2, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CarLinkDialog } from "@/components/car-link-dialog"
import { apiClient } from "@/lib/api-client"
import type { CarLink } from "@/types/car-detail"

interface Props {
  carId: string
  links: CarLink[]
  onRefresh: () => void
}

function getDisplayUrl(url: string) {
  try {
    const { hostname, pathname } = new URL(url)
    const path =
      pathname.length > 1 ? pathname.slice(0, 28) + (pathname.length > 28 ? "…" : "") : ""
    return hostname + path
  } catch {
    return url.slice(0, 40) + (url.length > 40 ? "…" : "")
  }
}

export function CarDetailLinks({ carId, links, onRefresh }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDelete = async (linkId: string) => {
    try {
      await apiClient.delete(`/api/cars/${carId}/links/${linkId}`)
      toast.success("Link silindi")
      onRefresh()
    } catch {
      toast.error("Link silinemedi")
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          İlan Linkleri
        </p>
        <Button variant="ghost" size="icon" className="size-7" onClick={() => setDialogOpen(true)}>
          <Plus className="size-3.5" />
        </Button>
      </div>

      {links.length === 0 ? (
        <p className="text-muted-foreground text-sm">Henüz link eklenmemiş</p>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-2 rounded-md border p-2.5">
              <LinkIcon className="text-muted-foreground size-3.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{link.platform}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.url}
                  className="text-primary block truncate text-xs hover:underline"
                >
                  {getDisplayUrl(link.url)}
                </a>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0"
                onClick={() => handleDelete(link.id)}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <CarLinkDialog
        carId={carId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={onRefresh}
      />
    </div>
  )
}
