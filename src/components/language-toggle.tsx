import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LOCALES, type Locale, normalizeLocale } from "@/lib/i18n"

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language)
  const activeLabel = t(`language.${locale}`)
  const label = t("language.current", { language: activeLabel })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={label}
          className="group rounded-lg text-muted-foreground hover:text-foreground"
          size="icon"
          title={label}
          variant="ghost"
        >
          <Languages className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-12" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => void i18n.changeLanguage(value as Locale)}
        >
          {LOCALES.map((item) => (
            <DropdownMenuRadioItem key={item} value={item}>
              <span>{t(`language.${item}`)}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
