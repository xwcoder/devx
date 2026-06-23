import { check, type DownloadEvent, type Update } from "@tauri-apps/plugin-updater"
import { relaunch } from "@tauri-apps/plugin-process"
import { CircleArrowUp, LoaderCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type UpdateState = "idle" | "checking" | "available" | "installing" | "error"

function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window
}

function formatProgress(downloadedBytes: number, contentLength?: number) {
  if (!contentLength) {
    return null
  }

  return Math.min(Math.round((downloadedBytes / contentLength) * 100), 100)
}

export function UpdateButton() {
  const { t } = useTranslation()
  const [update, setUpdate] = useState<Update | null>(null)
  const [state, setState] = useState<UpdateState>("idle")
  const [progress, setProgress] = useState<number | null>(null)

  const label = useMemo(() => {
    if (state === "installing" && progress !== null) {
      return t("update.installingProgress", { progress })
    }

    if (state === "installing") {
      return t("update.installing")
    }

    if (state === "error") {
      return t("update.error")
    }

    return update
      ? t("update.available", { version: update.version })
      : t("update.checking")
  }, [progress, state, t, update])

  useEffect(() => {
    if (!isTauriRuntime()) {
      return
    }

    let cancelled = false

    async function checkForUpdates() {
      setState("checking")

      try {
        const nextUpdate = await check()
        if (cancelled) {
          return
        }

        setUpdate(nextUpdate)
        setState(nextUpdate ? "available" : "idle")
      } catch {
        if (!cancelled) {
          setState("idle")
        }
      }
    }

    void checkForUpdates()

    return () => {
      cancelled = true
    }
  }, [])

  async function installUpdate() {
    if (!update || state === "installing") {
      return
    }

    setState("installing")
    setProgress(null)

    let contentLength: number | undefined
    let downloadedBytes = 0

    try {
      await update.downloadAndInstall((event: DownloadEvent) => {
        if (event.event === "Started") {
          contentLength = event.data.contentLength
          downloadedBytes = 0
          setProgress(formatProgress(downloadedBytes, contentLength))
          return
        }

        if (event.event === "Progress") {
          downloadedBytes += event.data.chunkLength
          setProgress(formatProgress(downloadedBytes, contentLength))
          return
        }

        setProgress(100)
      })

      await relaunch()
    } catch {
      setState("error")
      setProgress(null)
    }
  }

  if (!update && state !== "installing" && state !== "error") {
    return null
  }

  const isBusy = state === "installing"
  const Icon = isBusy ? LoaderCircle : CircleArrowUp

  return (
    <Button
      aria-label={label}
      className={cn(
        "group relative rounded-lg text-muted-foreground hover:text-foreground",
        state === "available" &&
          "text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/15",
        state === "error" &&
          "text-destructive hover:bg-destructive/10 hover:text-destructive"
      )}
      disabled={isBusy}
      onClick={() => void installUpdate()}
      size="icon"
      title={label}
      variant="ghost"
    >
      <Icon
        className={cn(
          "size-4 transition-transform duration-200 group-hover:-translate-y-0.5",
          isBusy && "animate-spin group-hover:translate-y-0"
        )}
      />
      <span className="sr-only">{label}</span>
    </Button>
  )
}
