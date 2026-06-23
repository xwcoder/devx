import { useCallback, useEffect, useState } from "react"
import type { KeyboardEvent, PointerEvent } from "react"
import CodeMirror, { EditorView } from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { yaml } from "@codemirror/lang-yaml"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { xml } from "@codemirror/lang-xml"
import { useTranslation } from "react-i18next"

type Props = {
  value: string
  onChange: (value: string) => void
  lang: "javascript" | "json" | "yaml" | "html" | "css" | "xml"
  label?: string
  height?: number
}

const langs = {
  javascript: javascript(),
  json: json(),
  yaml: yaml(),
  html: html(),
  css: css(),
  xml: xml(),
}

const langLabels = {
  javascript: "JavaScript",
  json: "JSON",
  yaml: "YAML",
  html: "HTML",
  css: "CSS",
  xml: "XML",
}

const devxEditorTheme = EditorView.theme({
  "&": {
    backgroundColor: "color-mix(in oklab, var(--card) 88%, var(--muted))",
    color: "var(--card-foreground)",
    fontFamily:
      '"JetBrains Mono", "SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, monospace',
    fontSize: "13px",
  },
  ".cm-scroller": {
    backgroundColor: "color-mix(in oklab, var(--card) 88%, var(--muted))",
  },
  ".cm-content": {
    caretColor: "var(--foreground)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--foreground)",
  },
  ".cm-gutters": {
    backgroundColor: "color-mix(in oklab, var(--card) 82%, var(--muted))",
    borderRightColor: "var(--border)",
    color: "var(--muted-foreground)",
  },
  ".cm-gutter": {
    backgroundColor: "transparent",
  },
  ".cm-gutterElement": {
    color: "var(--muted-foreground)",
  },
  ".cm-activeLine, .cm-activeLineGutter": {
    backgroundColor: "color-mix(in oklab, var(--accent) 38%, transparent)",
  },
})

const MIN_EDITOR_HEIGHT = 160
const KEYBOARD_RESIZE_STEP = 16
const KEYBOARD_RESIZE_LARGE_STEP = 48

function clampEditorHeight(height: number) {
  return Math.max(height, MIN_EDITOR_HEIGHT)
}

function getInitialEditorHeight(height: number) {
  if (typeof window === "undefined") {
    return MIN_EDITOR_HEIGHT
  }

  return clampEditorHeight(Math.round(window.innerHeight * (height / 100)))
}

export function Editor(props: Props) {
  const { t } = useTranslation()
  const {
    value,
    onChange,
    lang,
    label,
    height = 30,
  } = props

  const [editorHeight, setEditorHeight] = useState(() =>
    getInitialEditorHeight(height)
  )

  const resizeBy = useCallback((delta: number) => {
    setEditorHeight((currentHeight) => clampEditorHeight(currentHeight + delta))
  }, [])

  const handleResizeStart = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault()

      const startY = event.clientY
      const startHeight = editorHeight

      const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
        setEditorHeight(
          clampEditorHeight(startHeight + moveEvent.clientY - startY)
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
    [editorHeight]
  )

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? KEYBOARD_RESIZE_LARGE_STEP : KEYBOARD_RESIZE_STEP

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
      setEditorHeight(MIN_EDITOR_HEIGHT)
      return
    }
  }

  useEffect(() => {
    const handleWindowResize = () => {
      setEditorHeight((currentHeight) => clampEditorHeight(currentHeight))
    }

    window.addEventListener("resize", handleWindowResize)

    return () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-border/70 bg-muted/35 px-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)]" />
          <span className="truncate text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            {label ?? langLabels[lang]}
          </span>
        </div>
      </div>
      <CodeMirror
        value={value}
        height={`${editorHeight}px`}
        extensions={[langs[lang], devxEditorTheme]}
        onChange={onChange}
        className="devx-code-editor"
        theme="none"
      />
      <div
        role="separator"
        aria-label={t("editor.resizeHeight")}
        aria-orientation="horizontal"
        aria-valuemin={MIN_EDITOR_HEIGHT}
        aria-valuenow={editorHeight}
        tabIndex={0}
        className="group flex h-3 cursor-row-resize items-center justify-center border-t border-border/60 bg-muted/20 outline-none transition-colors hover:bg-accent/45 focus-visible:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring/55"
        onPointerDown={handleResizeStart}
        onKeyDown={handleResizeKeyDown}
      >
        <span className="h-1 w-8 rounded-full bg-muted-foreground/25 transition-colors group-hover:bg-muted-foreground/45 group-focus-visible:bg-muted-foreground/55" />
      </div>
    </div>
  )
}
