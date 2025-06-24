import { ComponentProps, useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cva } from "class-variance-authority"
import { Button } from "./button"
import { copyToClipboard } from "@/lib/copy"
import { cn } from "@/lib/utils"

type Props = Omit<ComponentProps<typeof Button>, "onClick" | "children"> & {
  content: string
  text?: string
}

const iconVariants = cva("w-4 h-4", {
  variants: {
    copied: {
      true: 'animate-in fade-in slide-in-from-bottom-8 duration-500',
      false: 'animate-out fade-out slide-out-to-top-8 duration-500',
    },
  },
})  

export function CopyButton({
  content,
  text = "Copy",
  ...props
}: Props) {
  const [copied, setCopied] = useState(false)
  const [showIcon, setShowIcon] = useState(false)

  const copy = async () => {
    if (!content || copied) {
      return
    }

    await copyToClipboard(content)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2e3)
  }

  useEffect(() => {
    if (copied) {
      setShowIcon(true)
    } else {
      const timeout = setTimeout(() => {
        setShowIcon(false)
      }, 500)

      return () => clearTimeout(timeout)
    }
  }, [copied])

  return (
    <Button
      onClick={copy}
      {...props}
    >
      {showIcon ? "Copied" : text}
      {showIcon && (
        <Check
          className={cn(iconVariants({ copied }))}
        />
      )}
    </Button>
  )
}