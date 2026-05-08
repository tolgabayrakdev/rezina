import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CarBodyDiagram } from "@/components/car-body-diagram"
import { type Expertise, type PanelStatus } from "@/types/expertise"

interface Props {
  expertise: Expertise
  onChange: (key: string, status: PanelStatus) => void
  onSave: () => void
  saving: boolean
}

export function CarDetailExpertise({ expertise, onChange, onSave, saving }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Ekspertiz Raporu
        </p>
        <Button variant="outline" size="sm" onClick={onSave} disabled={saving}>
          <Save className="mr-1.5 size-3.5" />
          Kaydet
        </Button>
      </div>
      <div className="rounded-lg border p-4">
        <CarBodyDiagram expertise={expertise} onChange={onChange} />
      </div>
    </div>
  )
}
