import { useState } from "react"
import { Button } from "@/components/button"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"
import { ToolActions, ToolError, ToolWorkspace } from "@/components/tool-workspace"

export default function UrlCodecApp() {
  const [content, setContent] = useState("")
  const [error, setError] = useState<Error | null>(null)

  const iEncodeURIComponent = () => {
    setError(null)
    setContent(encodeURIComponent(content))
  }

  const iDecodeURIComponent = () => {
    try {
      setContent(decodeURIComponent(content))
      setError(null)
    } catch (error) {
      setError(error as Error)
    }
  }

  const iEncodeURI = () => {
    setError(null)
    setContent(encodeURI(content))
  }

  const iDecodeURI = () => {
    try {
      setContent(decodeURI(content))
      setError(null)
    } catch (error) {
      setError(error as Error)
    }
  }

  const onChange = (value: string) => {
    setContent(value)
    setError(null)
  }

  return (
    <ToolWorkspace>
      <Editor
        value={content}
        onChange={onChange}
        lang="json"
        label="URI"
        height={30}
      />
      <ToolActions>
        <Button onClick={iEncodeURIComponent}>encodeURIComponent</Button>
        <Button onClick={iDecodeURIComponent}>decodeURIComponent</Button>
        <Button onClick={iEncodeURI}>encodeURI</Button>
        <Button onClick={iDecodeURI}>decodeURI</Button>
        <CopyButton content={content} />
      </ToolActions>
      <ToolError error={error} />
    </ToolWorkspace>
  )
}
