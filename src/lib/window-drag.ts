import { getCurrentWindow } from "@tauri-apps/api/window"
import type { PointerEvent as ReactPointerEvent } from "react"

export function startWindowDrag(event: ReactPointerEvent<HTMLElement>) {
  if (event.button !== 0) {
    return
  }

  event.preventDefault()
  void getCurrentWindow().startDragging().catch(() => undefined)
}
