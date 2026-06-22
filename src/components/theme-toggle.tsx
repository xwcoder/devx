import { Monitor, Moon, Sun } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const THEME_STORAGE_KEY = "devx:theme"
const THEME_QUERY = "(prefers-color-scheme: dark)"

type ThemeMode = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

const themeOptions: Array<{
  value: ThemeMode
  label: string
  icon: typeof Sun
}> = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
  },
]

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system"
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia(THEME_QUERY).matches ? "dark" : "light"
}

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "system"
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isThemeMode(savedTheme) ? savedTheme : "system"
}

function resolveTheme(theme: ThemeMode, systemTheme: ResolvedTheme): ResolvedTheme {
  return theme === "system" ? systemTheme : theme
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle("dark", resolvedTheme === "dark")
  root.style.colorScheme = resolvedTheme
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  const resolvedTheme = resolveTheme(theme, systemTheme)
  const TriggerIcon = resolvedTheme === "dark" ? Moon : Sun

  const activeLabel = useMemo(() => {
    const modeLabel = themeOptions.find((option) => option.value === theme)?.label
    return theme === "system"
      ? `${modeLabel} (${resolvedTheme})`
      : modeLabel ?? "Theme"
  }, [resolvedTheme, theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia(THEME_QUERY)

    const handleThemeChange = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light")
    }

    handleThemeChange()
    mediaQuery.addEventListener("change", handleThemeChange)

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyTheme(resolvedTheme)
  }, [resolvedTheme, theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`Theme: ${activeLabel}`}
          className="group rounded-lg text-muted-foreground hover:text-foreground"
          size="icon"
          title={`Theme: ${activeLabel}`}
          variant="ghost"
        >
          <TriggerIcon className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-12" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as ThemeMode)}
        >
          {themeOptions.map((option) => {
            const Icon = option.icon

            return (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <Icon className="size-4 text-muted-foreground" />
                <span>{option.label}</span>
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
