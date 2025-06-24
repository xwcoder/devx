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

export function Editor(props: Props) {
  const {
    value,
    onChange,
    lang,
    height = 30,
  } = props

  const [h, setH] = useState(height)

  const handleHeightChange = (delta: number) => {
    setH(Math.max(h + delta, 10))
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-x-2">
          <Button
            size="icon"
            variant="ghost"
            className="size-6 text-muted-foreground"
            onClick={() => handleHeightChange(-10)}
          >
            <Minus />
          </Button>
          <span className="text-xs text-muted-foreground">
            {h}%
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="size-6 text-muted-foreground"
            onClick={() => handleHeightChange(10)}
          >
            <Plus />
          </Button>
        </div>
      </div>
      <div className="border rounded-md overflow-hidden">
        <CodeMirror
          value={value}
          height={`${Math.max(h, 10)}vh`}
          extensions={[langs[lang]]}
          onChange={onChange}
        />
      </div>
    </div>
  )
}