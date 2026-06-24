import { useAppState } from "@/context"

export default function Application() {
  const { app } = useAppState()

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <app.component />
    </section>
  )
}
