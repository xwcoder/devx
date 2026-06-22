import { useState, ComponentProps } from "react"
import beautify from "js-beautify"
import { WandSparkles } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/button"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"
import { ToolActions, ToolError, ToolWorkspace } from "@/components/tool-workspace"

type EditorProps = ComponentProps<typeof Editor>

type Props = Pick<EditorProps, "height"> & {
  lang: Extract<EditorProps["lang"], "javascript" | "html" | "css" | "xml">
}

const methods = {
  javascript: beautify.js,
  html: beautify.html,
  css: beautify.css,
  xml: beautify.html,
}

export default function BeautifyApp(props: Props) {
  const { t } = useTranslation()
  const {
    lang,
    height = 60,
  } = props
  const [content, setContent] = useState("")
  const [error, setError] = useState<Error | null>(null)

  const onChange = (value: string) => {
    setContent(value)
    setError(null)
  }

  const format = () => {
    try {
      const formatted = methods[lang](content, {
        indent_size: 2,
        indent_char: " ",
        indent_level: 0,
        indent_with_tabs: false,
      })
      setContent(formatted)
    } catch (error) {
      setError(error as Error)
    }
  }

  return (
    <ToolWorkspace>
      <ToolActions>
        <Button onClick={format}>
          <WandSparkles className="size-4" />
          {t("tool.beautify")}
        </Button>
        <CopyButton content={content} />
      </ToolActions>
      <Editor
        value={content}
        onChange={onChange}
        lang={lang}
        height={height}
      />
      <ToolError error={error} />
    </ToolWorkspace>
  )
}
