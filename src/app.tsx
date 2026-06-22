import { useCallback, useEffect, useState } from "react"
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { AppContext } from "@/context"
import Application from "@/application"
import { useTranslation } from "react-i18next"

const SIDEBAR_WIDTH_KEY = "devx:sidebar-width"
const DEFAULT_SIDEBAR_WIDTH = 220
const MIN_SIDEBAR_WIDTH = 180
const MAX_SIDEBAR_WIDTH = 320

function clampSidebarWidth(width: number) {
  return Math.min(Math.max(width, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH)
}

function getInitialSidebarWidth() {
  if (typeof window === "undefined") {
    return DEFAULT_SIDEBAR_WIDTH
  }

  const savedValue = window.localStorage.getItem(SIDEBAR_WIDTH_KEY)
  if (!savedValue) {
    return DEFAULT_SIDEBAR_WIDTH
  }

  const savedWidth = Number(savedValue)
  return Number.isFinite(savedWidth)
    ? clampSidebarWidth(savedWidth)
    : DEFAULT_SIDEBAR_WIDTH
}

function SidebarResizeHandle({
  onResizeStart,
}: {
  onResizeStart: (event: ReactMouseEvent<HTMLDivElement>) => void
}) {
  const { t } = useTranslation()
  const { isMobile, state } = useSidebar()

  if (isMobile || state === "collapsed") {
    return null
  }

  return (
    <div
      aria-label={t("sidebar.resize")}
      aria-orientation="vertical"
      role="separator"
      style={{ left: "var(--sidebar-width)" }}
      className="group fixed inset-y-0 z-30 hidden w-3 -translate-x-1/2 cursor-col-resize items-stretch justify-center md:flex"
      onMouseDown={onResizeStart}
    >
      <span className="my-3 w-px rounded-full bg-transparent transition-colors duration-150 group-hover:bg-sidebar-border" />
    </div>
  )
}

export default function App() {
  const [sidebarWidth, setSidebarWidth] = useState(getInitialSidebarWidth)

  const startSidebarResize = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth = clampSidebarWidth(moveEvent.clientX)
      setSidebarWidth(nextWidth)
      window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(nextWidth))
    }

    const stopResize = () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", stopResize)
    }

    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", stopResize)
  }, [])

  useEffect(() => {
    return () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [])

  return (
    <AppContext>
      <SidebarProvider
        style={
          {
            "--sidebar-width": `${sidebarWidth}px`,
          } as CSSProperties
        }
      >
        <AppSidebar />
        <SidebarResizeHandle onResizeStart={startSidebarResize} />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border/70 bg-background/90 px-4 backdrop-blur">
            <SidebarTrigger className="rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground" />
            <div className="h-5 w-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground">
              DevX
            </span>
            <div className="ml-auto flex items-center gap-1">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>
          <main className="p-5 sm:p-6">
            <Application />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AppContext>
  )
}
