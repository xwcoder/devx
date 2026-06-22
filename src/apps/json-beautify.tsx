import { useState } from "react"
import JSONView from "@uiw/react-json-view"
import { nordTheme } from "@uiw/react-json-view/nord"
import { WandSparkles } from "lucide-react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
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
      <ToolActions>
        <Button onClick={beautify}>
          <WandSparkles className="size-4" />
          {t("tool.beautify")}
        </Button>
        <CopyButton content={content} />
      </ToolActions>
      <Editor
        value={content}
        onChange={onChange}
        lang="json"
      />
      <ToolError error={error} />
      {jsonObject && (
        <ToolPreview title={t("preview.json")}>
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
