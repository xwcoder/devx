import { useState } from "react"
import { Binary, LetterText } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"
import { Button } from "@/components/button"
import { ToolActions, ToolError, ToolWorkspace } from "@/components/tool-workspace"
import { useTranslation } from "react-i18next"

export default function Base64CodecApp() {
  const { t } = useTranslation()
  const [content, setContent] = useState("")
  const [error, setError] = useState<Error | null>(null)

  const onChange = (value: string) => {
    setContent(value)
    setError(null)
  }

  const encode = () => {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(content)
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("")
    const base64 = btoa(binString)

    setContent(base64)
    setError(null)
  }

  const decode = () => {
    try {
      const binString = atob(content)
      const bytes = Uint8Array.from(binString, (c) => c.codePointAt(0)!)
      const decoder = new TextDecoder()
      setContent(decoder.decode(bytes))
      setError(null)
    } catch (error) {
      setError(error as Error)
    }
  }

  return (
    <ToolWorkspace>
      <ToolActions>
        <Button onClick={encode}>
          <Binary className="size-4" />
          {t("tool.encode")}
        </Button>
        <Button onClick={decode}>
          <LetterText className="size-4" />
          {t("tool.decode")}
        </Button>
        <CopyButton content={content} />
      </ToolActions>
      <Editor
        value={content}
        onChange={onChange}
        lang="json"
        label="Base64"
      />
      <ToolError error={error} />
    </ToolWorkspace>
  )
}
