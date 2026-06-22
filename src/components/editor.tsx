import { useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { yaml } from "@codemirror/lang-yaml"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { xml } from "@codemirror/lang-xml"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

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

export function Editor(props: Props) {
  const {
    value,
    onChange,
    lang,
    label,
    height = 30,
  } = props

  const [h, setH] = useState(height)

  const handleHeightChange = (delta: number) => {
    setH(Math.max(h + delta, 10))
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-border/70 bg-muted/35 px-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)]" />
          <span className="truncate text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            {label ?? langLabels[lang]}
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            size="icon"
            variant="ghost"
            title="Decrease editor height"
            className="size-7 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => handleHeightChange(-10)}
          >
            <Minus className="size-4" />
          </Button>
          <span className="min-w-9 text-center text-xs tabular-nums text-muted-foreground">
            {h}%
          </span>
          <Button
            size="icon"
            variant="ghost"
            title="Increase editor height"
            className="size-7 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => handleHeightChange(10)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
      <CodeMirror
        value={value}
        height={`${Math.max(h, 10)}vh`}
        extensions={[langs[lang]]}
        onChange={onChange}
        className="devx-code-editor"
      />
    </div>
  )
}
