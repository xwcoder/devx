import { useState } from "react"
import JSONView from "@uiw/react-json-view"
import { nordTheme } from "@uiw/react-json-view/nord"
import { Button } from "@/components/button"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"

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
    <div className="flex flex-col gap-4">
      <Editor
        value={content}
        onChange={onChange}
        lang="json"
      />
      <div className="flex gap-x-4">
        <Button
          onClick={beautify}
        >
          Beautify
        </Button>
        <CopyButton
          content={content}
        />
      </div>
      {error && (
        <div className="text-red-500">
          {error.message}
        </div>
      )}
      {jsonObject && (
        <div>
          <JSONView
            className="p-2"
            value={jsonObject}
            style={nordTheme}
            displayDataTypes={false}
          />
        </div>
      )}
    </div>
  )
}