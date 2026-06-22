import type { ReactNode } from "react"
import { CircleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

type ToolWorkspaceProps = {
  children: ReactNode
  className?: string
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

  return (
    <section
      className={cn(
        "animate-in fade-in slide-in-from-top-1 overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm duration-300",
        className
      )}
    >
      <div className="flex h-10 items-center border-b border-border/70 bg-muted/35 px-3">
        <span className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
          {title ?? t("common.preview")}
        </span>
      </div>
      <div className="overflow-auto p-3">{children}</div>
    </section>
  )
}
