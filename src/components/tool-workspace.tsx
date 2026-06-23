import { useCallback, useEffect, useState } from "react"
import type { KeyboardEvent, PointerEvent, ReactNode } from "react"
import { CircleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

type ToolWorkspaceProps = {
  children: ReactNode
  className?: string
}

const MIN_PREVIEW_HEIGHT = 180
const DEFAULT_PREVIEW_HEIGHT_RATIO = 0.6
const PREVIEW_CHROME_HEIGHT = 52
const KEYBOARD_RESIZE_STEP = 16
const KEYBOARD_RESIZE_LARGE_STEP = 48

function clampPreviewHeight(height: number) {
  return Math.max(height, MIN_PREVIEW_HEIGHT)
}

function getInitialPreviewHeight() {
  if (typeof window === "undefined") {
    return MIN_PREVIEW_HEIGHT
  }

  return clampPreviewHeight(
    Math.round(window.innerHeight * DEFAULT_PREVIEW_HEIGHT_RATIO) +
      PREVIEW_CHROME_HEIGHT
  )
}

export function ToolWorkspace({ children, className }: ToolWorkspaceProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-4 duration-300",
        className
      )}
    >
      {children}
    </div>
  )
}

export function ToolActions({ children, className }: ToolWorkspaceProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-top-1 flex flex-wrap items-center gap-1.5 duration-200",
        className
      )}
    >
      {children}
    </div>
  )
}

export function ToolPanels({ children, className }: ToolWorkspaceProps) {
  return (
    <div
      className={cn(
        "grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]",
        className
      )}
    >
      {children}
    </div>
  )
}

type ToolErrorProps = {
  error: Error | null
}

export function ToolError({ error }: ToolErrorProps) {
  if (!error) {
    return null
  }

  return (
    <div className="animate-in fade-in slide-in-from-top-1 flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/8 px-3 py-2 text-sm text-destructive duration-200">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      <span className="break-words">{error.message}</span>
    </div>
  )
}

type ToolPreviewProps = ToolWorkspaceProps & {
  title?: string
}

export function ToolPreview({
  children,
  className,
  title,
}: ToolPreviewProps) {
  const { t } = useTranslation()
  const [previewHeight, setPreviewHeight] = useState(getInitialPreviewHeight)

  const resizeBy = useCallback((delta: number) => {
    setPreviewHeight((currentHeight) =>
      clampPreviewHeight(currentHeight + delta)
    )
  }, [])

  const handleResizeStart = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault()

      const startY = event.clientY
      const startHeight = previewHeight

      const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
        setPreviewHeight(
          clampPreviewHeight(startHeight + moveEvent.clientY - startY)
        )
      }

      const stopResize = () => {
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", stopResize)
        window.removeEventListener("pointercancel", stopResize)
      }

      document.body.style.cursor = "row-resize"
      document.body.style.userSelect = "none"
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", stopResize)
      window.addEventListener("pointercancel", stopResize)
    },
    [previewHeight]
  )

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey
      ? KEYBOARD_RESIZE_LARGE_STEP
      : KEYBOARD_RESIZE_STEP

    if (event.key === "ArrowUp") {
      event.preventDefault()
      resizeBy(-step)
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      resizeBy(step)
      return
    }

    if (event.key === "Home") {
      event.preventDefault()
      setPreviewHeight(MIN_PREVIEW_HEIGHT)
      return
    }
  }

  useEffect(() => {
    const handleWindowResize = () => {
      setPreviewHeight((currentHeight) => clampPreviewHeight(currentHeight))
    }

    window.addEventListener("resize", handleWindowResize)

    return () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return (
    <section
      className={cn(
        "animate-in fade-in slide-in-from-top-1 flex min-h-0 flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm duration-300",
        className
      )}
      style={{
        height: previewHeight,
      }}
    >
      <div className="flex h-10 items-center border-b border-border/70 bg-muted/35 px-3">
        <span className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
          {title ?? t("common.preview")}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">{children}</div>
      <div
        role="separator"
        aria-label={t("preview.resizeHeight")}
        aria-orientation="horizontal"
        aria-valuemin={MIN_PREVIEW_HEIGHT}
        aria-valuenow={previewHeight}
        tabIndex={0}
        className="group flex h-3 cursor-row-resize items-center justify-center border-t border-border/60 bg-muted/20 outline-none transition-colors hover:bg-accent/45 focus-visible:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring/55"
        onPointerDown={handleResizeStart}
        onKeyDown={handleResizeKeyDown}
      >
        <span className="h-1 w-8 rounded-full bg-muted-foreground/25 transition-colors group-hover:bg-muted-foreground/45 group-focus-visible:bg-muted-foreground/55" />
      </div>
    </section>
  )
}
