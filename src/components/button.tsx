import { ComponentProps } from "react"
import { Button as BaseButton } from "./ui/button"

type Props = Omit<ComponentProps<typeof BaseButton>, "variant" | "size">

export function Button({ children, ...props }: Props) {
  return (
    <BaseButton
      variant="ghost"
      size="sm"
      {...props}
    >
      {children}
    </BaseButton>
  )
}