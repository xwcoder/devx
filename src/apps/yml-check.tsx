import { useState } from "react"
import yaml from "js-yaml"
import JSONView from "@uiw/react-json-view"
import { nordTheme } from "@uiw/react-json-view/nord"
import { Button } from "@/components/button"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"

export default function YmlCheckApp() {
  const [content, setContent] = useState("")
  const [error, setError] = useState<Error | null>(null)
  const [json, setJson] = useState<any>(null)

  const onChange = (value: string) => {
    setContent(value)
    setError(null)
    setJson(null)
  }

  const check = () => {
    try {
      const obj = yaml.load(content)
      setJson(obj)
    } catch (error) {
      setError(error as Error)
      setJson(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Editor
        value={content}
        onChange={onChange}
        lang="yaml"
        height={30}
      />
      <div className="flex gap-x-4">
        <Button
          onClick={check}
        >
          Check
        </Button>
        <CopyButton
          content={content}
          text="Copy YML"
        />
        {json && (
          <CopyButton
            content={JSON.stringify(json, null, 2)}
            text="Copy JSON"
          />
        )}
      </div>
      {error && (
        <div className="text-red-500">
          {error.message}
        </div>
      )}
      {json && (
        <JSONView
          value={json}
          style={nordTheme}
          displayDataTypes={false}
          className="p-2"
        />
      )}
    </div>
  )
}