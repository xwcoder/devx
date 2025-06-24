import { useAppState } from "@/context"

export default function Application() {
  const { app } = useAppState()

  return <app.component />
}