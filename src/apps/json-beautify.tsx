import { useState } from "react"
import JSONView from "@uiw/react-json-view"
import { nordTheme } from "@uiw/react-json-view/nord"
import { Button } from "@/components/button"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"
import {
  ToolActions,
  ToolError,
  ToolPreview,
  ToolWorkspace,
} from "@/components/tool-workspace"

export default function JsonBeautifyApp() {
  const [content, setContent] = useState("")
  const [jsonObject, setJsonObject] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)

  const onChange = (value: string) => {
    setContent(value)
    setError(null)
    setJsonObject(null)
  }

  const beautify = () => {
    try {
      const obj = JSON.parse(content)
      setContent(JSON.stringify(obj, null, 2))
      setJsonObject(obj)
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
      />
      <ToolActions>
        <Button onClick={beautify}>Beautify</Button>
        <CopyButton content={content} />
      </ToolActions>
      <ToolError error={error} />
      {jsonObject && (
        <ToolPreview title="JSON Preview">
          <JSONView
            value={jsonObject}
            style={nordTheme}
            displayDataTypes={false}
          />
        </ToolPreview>
      )}
    </ToolWorkspace>
  )
}
