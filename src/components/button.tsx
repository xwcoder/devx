import { ComponentProps } from "react"
import { Button as BaseButton } from "./ui/button"
import { cn } from "@/lib/utils"

type Props = ComponentProps<typeof BaseButton>

export function Button({
  children,
  className,
  variant = "default",
  size = "sm",
  ...props
}: Props) {
  return (
    <BaseButton
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-150 active:translate-y-px",
        variant === "default" && "shadow-sm hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
