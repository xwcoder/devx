import { useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"
import { Button } from "@/components/button"

export default function Base64CodecApp() {
  const [content, setContent] = useState("")

  const onChange = (value: string) => {
    setContent(value)
  }

  const encode = () => {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(content)
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("")
    const base64 = btoa(binString)

    setContent(base64)
  }

  const decode = () => {
    const binString = atob(content)
    const bytes = Uint8Array.from(binString, (c) => c.codePointAt(0)!)
    const decoder = new TextDecoder()
    setContent(decoder.decode(bytes))
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
          onClick={encode}
        >
          Encode
        </Button>
        <Button
          onClick={decode}
        >
          Decode
        </Button>
        <CopyButton
          content={content}
        />
      </div>
    </div>
  )
}