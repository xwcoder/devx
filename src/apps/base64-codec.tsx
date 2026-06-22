import { useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"
import { Button } from "@/components/button"
import { ToolActions, ToolError, ToolWorkspace } from "@/components/tool-workspace"

export default function Base64CodecApp() {
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
      <Editor
        value={content}
        onChange={onChange}
        lang="json"
        label="Base64"
      />
      <ToolActions>
        <Button onClick={encode}>Encode</Button>
        <Button onClick={decode}>Decode</Button>
        <CopyButton content={content} />
      </ToolActions>
      <ToolError error={error} />
    </ToolWorkspace>
  )
}
