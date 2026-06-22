import { getCurrentWindow } from "@tauri-apps/api/window"
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react"

let isTogglingMaximize = false

export function startWindowDrag(event: ReactPointerEvent<HTMLElement>) {
  if (event.button !== 0 || event.detail > 1) {
    return
  }

  event.preventDefault()
  void getCurrentWindow().startDragging().catch(() => undefined)
}

export function toggleWindowMaximize(event: ReactMouseEvent<HTMLElement>) {
  event.preventDefault()
  void toggleWindowMaximizeState().catch(() => undefined)
}

async function toggleWindowMaximizeState() {
  if (isTogglingMaximize) {
    return
  }

  isTogglingMaximize = true
  const currentWindow = getCurrentWindow()

  try {
    if (await currentWindow.isMaximized()) {
      await currentWindow.unmaximize()
    } else {
      await currentWindow.maximize()
    }
  } finally {
    isTogglingMaximize = false
  }
}
