import { useState } from "react"
import { Braces, Code2 } from "lucide-react"
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
      <ToolActions>
        <Button onClick={iEncodeURIComponent}>
          <Braces className="size-4" />
          encodeURIComponent
        </Button>
        <Button onClick={iDecodeURIComponent}>
          <Braces className="size-4" />
          decodeURIComponent
        </Button>
        <Button onClick={iEncodeURI}>
          <Code2 className="size-4" />
          encodeURI
        </Button>
        <Button onClick={iDecodeURI}>
          <Code2 className="size-4" />
          decodeURI
        </Button>
        <CopyButton content={content} />
      </ToolActions>
      <Editor
        value={content}
        onChange={onChange}
        lang="json"
        label="URI"
        height={30}
      />
      <ToolError error={error} />
    </ToolWorkspace>
  )
}
