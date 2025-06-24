import { useState } from "react"
import { Button } from "@/components/button"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"

export default function UrlCodecApp() {
  const [content, setContent] = useState("")

  const iEncodeURIComponent = () => {
    setContent(encodeURIComponent(content))
  }

  const iDecodeURIComponent = () => {
    setContent(decodeURIComponent(content))
  }

  const iEncodeURI = () => {
    setContent(encodeURI(content))
  }

  const iDecodeURI = () => {
    setContent(decodeURI(content))
  }

  const onChange = (value: string) => {
    setContent(value)
  }

  return (
    <div className="flex flex-col gap-4">
      <Editor
        value={content}
        onChange={onChange}
        lang="json"
        height={30}
      />
      <div className="flex gap-x-4">
        <Button
          onClick={iEncodeURIComponent}
        >
          encodeURIComponent
        </Button>
        <Button
          onClick={iDecodeURIComponent}
        >
          decodeURIComponent
        </Button>
        <Button
          onClick={iEncodeURI}
        >
          encodeURI
        </Button>
        <Button
          onClick={iDecodeURI}
        >
          decodeURI
        </Button>
        <CopyButton
          content={content}
        />
      </div>
    </div>
  )
}