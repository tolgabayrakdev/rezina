import { useState } from "react"
import {
  type Expertise,
  type PanelStatus,
  STATUS_FILL,
  STATUS_LABEL,
  STATUS_ORDER,
  PANEL_LABEL,
  PANELS,
  STATUS_LABEL_COLOR,
  STATUS_DOT_BG,
} from "@/types/expertise"

interface Props {
  expertise: Expertise
  onChange?: (key: string, status: PanelStatus) => void
  readOnly?: boolean
}

const DIAGRAM_PANELS = [
  { id: "front_bumper", x: 60, y: 18, w: 160, h: 42, rx: 12, rotateAngle: 0 },
  { id: "hood", x: 60, y: 60, w: 160, h: 108, rx: 3, rotateAngle: 0 },
  { id: "left_front_fender", x: 18, y: 60, w: 42, h: 108, rx: 3, rotateAngle: -90 },
  { id: "right_front_fender", x: 220, y: 60, w: 42, h: 108, rx: 3, rotateAngle: 90 },
  { id: "left_front_door", x: 18, y: 168, w: 42, h: 100, rx: 3, rotateAngle: -90 },
  { id: "right_front_door", x: 220, y: 168, w: 42, h: 100, rx: 3, rotateAngle: 90 },
  { id: "roof", x: 60, y: 168, w: 160, h: 200, rx: 3, rotateAngle: 0 },
  { id: "left_rear_door", x: 18, y: 268, w: 42, h: 100, rx: 3, rotateAngle: -90 },
  { id: "right_rear_door", x: 220, y: 268, w: 42, h: 100, rx: 3, rotateAngle: 90 },
  { id: "left_rear_fender", x: 18, y: 368, w: 42, h: 82, rx: 3, rotateAngle: -90 },
  { id: "right_rear_fender", x: 220, y: 368, w: 42, h: 82, rx: 3, rotateAngle: 90 },
  { id: "trunk", x: 60, y: 368, w: 160, h: 82, rx: 3, rotateAngle: 0 },
  { id: "rear_bumper", x: 60, y: 450, w: 160, h: 42, rx: 12, rotateAngle: 0 },
]

const WHEEL_ARCHES = [
  { cx: 39, cy: 150, r: 17 },
  { cx: 241, cy: 150, r: 17 },
  { cx: 39, cy: 384, r: 17 },
  { cx: 241, cy: 384, r: 17 },
]

export function CarBodyDiagram({ expertise, onChange, readOnly }: Props) {
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null)

  const cycleStatus = (panelId: string) => {
    if (readOnly) return
    const current = expertise[panelId] ?? "original"
    const idx = STATUS_ORDER.indexOf(current)
    onChange?.(panelId, STATUS_ORDER[(idx + 1) % STATUS_ORDER.length])
  }

  const hoveredStatus = hoveredPanel ? (expertise[hoveredPanel] ?? "original") : null

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs">
        {STATUS_ORDER.map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span
              className="inline-block size-3 rounded-sm border border-black/10"
              style={{ background: STATUS_FILL[s] }}
            />
            <span className={STATUS_LABEL_COLOR[s]}>{STATUS_LABEL[s]}</span>
          </span>
        ))}
      </div>

      {/* SVG Diagram */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 280 510"
          className="w-full max-w-[280px]"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {/* Direction labels */}
          <text x="140" y="10" textAnchor="middle" fontSize={7.5} fill="#94a3b8" letterSpacing="1">ÖN</text>
          <text x="140" y="507" textAnchor="middle" fontSize={7.5} fill="#94a3b8" letterSpacing="1">ARKA</text>
          <text x="7" y="258" textAnchor="middle" fontSize={7.5} fill="#94a3b8" letterSpacing="1" transform="rotate(-90,7,258)">SOL</text>
          <text x="273" y="258" textAnchor="middle" fontSize={7.5} fill="#94a3b8" letterSpacing="1" transform="rotate(90,273,258)">SAĞ</text>

          {/* Panels */}
          {DIAGRAM_PANELS.map((panel) => {
            const status = expertise[panel.id] ?? "original"
            const isHovered = hoveredPanel === panel.id
            const cx = panel.x + panel.w / 2
            const cy = panel.y + panel.h / 2
            const label = PANEL_LABEL[panel.id] ?? ""
            const isSide = panel.rotateAngle !== 0
            const fontSize = isSide ? 7 : panel.h > 80 ? 10 : 8.5

            return (
              <g
                key={panel.id}
                onClick={() => cycleStatus(panel.id)}
                onMouseEnter={() => setHoveredPanel(panel.id)}
                onMouseLeave={() => setHoveredPanel(null)}
                style={{ cursor: readOnly ? "default" : "pointer" }}
              >
                <rect
                  x={panel.x}
                  y={panel.y}
                  width={panel.w}
                  height={panel.h}
                  rx={panel.rx}
                  fill={STATUS_FILL[status]}
                  stroke={isHovered ? "#475569" : "#cbd5e1"}
                  strokeWidth={isHovered ? 1.5 : 0.75}
                  style={{ transition: "stroke 0.1s, stroke-width 0.1s" }}
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fill="#334155"
                  transform={panel.rotateAngle ? `rotate(${panel.rotateAngle},${cx},${cy})` : undefined}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {label}
                </text>
              </g>
            )
          })}

          {/* Wheel arches */}
          {WHEEL_ARCHES.map((w, i) => (
            <circle
              key={i}
              cx={w.cx}
              cy={w.cy}
              r={w.r}
              fill="#1e293b"
              opacity={0.1}
              style={{ pointerEvents: "none" }}
            />
          ))}

          {/* Windshield line */}
          <line x1="60" y1="168" x2="220" y2="168" stroke="#94a3b8" strokeWidth={2} style={{ pointerEvents: "none" }} />
          {/* Rear window line */}
          <line x1="60" y1="368" x2="220" y2="368" stroke="#94a3b8" strokeWidth={2} style={{ pointerEvents: "none" }} />
        </svg>
      </div>

      {/* Hover info */}
      <div className="h-5 text-center text-[11px]">
        {hoveredPanel && hoveredStatus ? (
          <span>
            <span className="text-muted-foreground">{PANEL_LABEL[hoveredPanel]}</span>
            {" · "}
            <span className={STATUS_LABEL_COLOR[hoveredStatus]}>{STATUS_LABEL[hoveredStatus]}</span>
            {!readOnly && (
              <span className="text-muted-foreground/50"> · tıkla değiştir</span>
            )}
          </span>
        ) : null}
      </div>

      {/* Summary */}
      <div className="border-t pt-3">
        <p className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-widest">
          Özet
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          {STATUS_ORDER.map((s) => {
            const count = PANELS.filter((p) => (expertise[p.id] ?? "original") === s).length
            return (
              <span key={s} className="flex items-center gap-1.5">
                <span className={`inline-block size-2 rounded-full ${STATUS_DOT_BG[s]}`} />
                <span className={`font-bold ${STATUS_LABEL_COLOR[s]}`}>{count}</span>
                <span className="text-muted-foreground">{STATUS_LABEL[s]}</span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
