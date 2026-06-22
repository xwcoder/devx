import { useTranslation } from "react-i18next"

import { useAppState } from "@/context"
import { appGroups } from "@/apps"

export default function Application() {
  const { t } = useTranslation()
  const { app } = useAppState()
  const group = appGroups.find((item) => item.name === app.group)

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-primary/15 bg-primary/8 px-2 py-1 text-xs font-medium text-primary">
            {group ? t(group.titleKey) : null}
          </span>
          <span className="rounded-md border border-border/70 bg-muted/45 px-2 py-1 text-xs font-medium text-muted-foreground">
            {app.lang}
          </span>
        </div>
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
