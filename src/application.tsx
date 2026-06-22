import { useTranslation } from "react-i18next"

import { useAppState } from "@/context"

export default function Application() {
  const { t } = useTranslation()
  const { app } = useAppState()

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-foreground">
            {app.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t(app.descriptionKey)}
          </p>
        </div>
      </header>
      <app.component />
    </section>
  )
}
