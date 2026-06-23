import { useState } from "react"
import { Binary, Eye, EyeOff, LetterText } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/button"
import { CopyButton } from "@/components/copy-button"
import { Editor } from "@/components/editor"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ToolActions,
  ToolError,
  ToolPanels,
  ToolWorkspace,
} from "@/components/tool-workspace"
import { cn } from "@/lib/utils"

const DEFAULT_HEADER = `{
  "alg": "none",
  "typ": "JWT"
}`

const DEFAULT_PAYLOAD = `{}`

type JwtHeader = Record<string, unknown> & {
  alg?: unknown
}

type VerificationStatus = "valid" | "invalid" | "signed" | null

const HMAC_HASHES = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
} as const

class UnsupportedAlgorithmError extends Error {
  constructor(readonly algorithm: string) {
    super(algorithm)
  }
}

function encodeBytesBase64Url(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte)
  ).join("")

  return btoa(binString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

function encodeBase64Url(value: string) {
  return encodeBytesBase64Url(new TextEncoder().encode(value))
}

function decodeBase64Url(value: string) {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=")
  const binString = atob(normalized)
  const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0)!)

  return new TextDecoder().decode(bytes)
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function getHmacHash(header: JwtHeader) {
  const algorithm = header.alg

  if (typeof algorithm !== "string" || !(algorithm in HMAC_HASHES)) {
    throw new UnsupportedAlgorithmError(String(algorithm || "none"))
  }

  return HMAC_HASHES[algorithm as keyof typeof HMAC_HASHES]
}

function timingSafeEqual(left: string, right: string) {
  let diff = left.length === right.length ? 0 : 1
  const length = Math.max(left.length, right.length)

  for (let index = 0; index < length; index += 1) {
    diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0)
  }

  return diff === 0
}

async function signHmac(input: string, secret: string, header: JwtHeader) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    {
      name: "HMAC",
      hash: getHmacHash(header),
    },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(input)
  )

  return encodeBytesBase64Url(new Uint8Array(signature))
}

type TextPanelProps = {
  className?: string
  label: string
  minHeight?: string
  onChange: (value: string) => void
  value: string
}

function TextPanel({
  className,
  label,
  minHeight = "min-h-[220px]",
  onChange,
  value,
}: TextPanelProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm",
        className
      )}
    >
      <div className="flex h-10 items-center border-b border-border/70 bg-muted/35 px-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)]" />
          <span className="truncate text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
      <Textarea
        value={value}
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "field-sizing-fixed resize-y rounded-none border-0 bg-[color-mix(in_oklab,var(--card)_88%,var(--muted))] font-mono text-[13px] shadow-none focus-visible:ring-0",
          minHeight
        )}
      />
    </section>
  )
}

export default function JwtCodecApp() {
  const { t } = useTranslation()
  const [token, setToken] = useState("")
  const [headerJson, setHeaderJson] = useState(DEFAULT_HEADER)
  const [payloadJson, setPayloadJson] = useState(DEFAULT_PAYLOAD)
  const [signature, setSignature] = useState("")
  const [secret, setSecret] = useState("")
  const [showSecret, setShowSecret] = useState(false)
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(null)
  const [error, setError] = useState<Error | null>(null)

  const clearFeedback = () => {
    setError(null)
    setVerificationStatus(null)
  }

  const onTokenChange = (value: string) => {
    setToken(value)
    clearFeedback()
  }

  const onHeaderChange = (value: string) => {
    setHeaderJson(value)
    clearFeedback()
  }

  const onPayloadChange = (value: string) => {
    setPayloadJson(value)
    clearFeedback()
  }

  const onSignatureChange = (value: string) => {
    setSignature(value)
    clearFeedback()
  }

  const onSecretChange = (value: string) => {
    setSecret(value)
    clearFeedback()
  }

  const decode = async () => {
    try {
      const parts = token.trim().split(".")

      if (parts.length !== 3) {
        throw new Error(t("jwt.error.parts"))
      }

      const header = JSON.parse(decodeBase64Url(parts[0]))
      const payload = JSON.parse(decodeBase64Url(parts[1]))
      const trimmedSecret = secret.trim()

      setHeaderJson(formatJson(header))
      setPayloadJson(formatJson(payload))
      setSignature(parts[2])
      setVerificationStatus(null)

      if (trimmedSecret) {
        const expectedSignature = await signHmac(
          `${parts[0]}.${parts[1]}`,
          trimmedSecret,
          header
        )

        setVerificationStatus(
          timingSafeEqual(expectedSignature, parts[2]) ? "valid" : "invalid"
        )
      }

      setError(null)
    } catch (error) {
      setError(
        error instanceof UnsupportedAlgorithmError
          ? new Error(
              t("jwt.error.unsupportedAlgorithm", {
                algorithm: error.algorithm,
              })
            )
          : (error as Error)
      )
      setVerificationStatus(null)
    }
  }

  const encode = async () => {
    try {
      const header = JSON.parse(headerJson) as JwtHeader
      const payload = JSON.parse(payloadJson)
      const trimmedSecret = secret.trim()
      const nextHeader = { ...header }

      if (
        trimmedSecret &&
        (nextHeader.alg == null || nextHeader.alg === "none")
      ) {
        nextHeader.alg = "HS256"
      }

      const encodedHeader = encodeBase64Url(JSON.stringify(nextHeader))
      const encodedPayload = encodeBase64Url(JSON.stringify(payload))
      const signingInput = `${encodedHeader}.${encodedPayload}`
      const nextSignature = trimmedSecret
        ? await signHmac(signingInput, trimmedSecret, nextHeader)
        : signature.trim()
      const nextToken = [encodedHeader, encodedPayload, nextSignature].join(".")

      setToken(nextToken)
      setHeaderJson(formatJson(nextHeader))
      setPayloadJson(formatJson(payload))
      setSignature(nextSignature)
      setVerificationStatus(trimmedSecret ? "signed" : null)
      setError(null)
    } catch (error) {
      setError(
        error instanceof UnsupportedAlgorithmError
          ? new Error(
              t("jwt.error.unsupportedAlgorithm", {
                algorithm: error.algorithm,
              })
            )
          : (error as Error)
      )
      setVerificationStatus(null)
    }
  }

  const statusText = verificationStatus
    ? t(`jwt.status.${verificationStatus}`)
    : null

  return (
    <ToolWorkspace>
      <ToolActions>
        <Button onClick={decode}>
          <LetterText className="size-4" />
          {t("tool.decode")}
        </Button>
        <Button onClick={encode}>
          <Binary className="size-4" />
          {t("tool.encode")}
        </Button>
        <CopyButton
          content={token}
          text={t("copy.jwt")}
        />
      </ToolActions>
      <div className="grid gap-2 rounded-lg border border-border/70 bg-card/70 p-3 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="relative min-w-0">
          <Input
            type={showSecret ? "text" : "password"}
            value={secret}
            spellCheck={false}
            placeholder={t("jwt.secret.placeholder")}
            aria-label={t("jwt.secret.label")}
            onChange={(event) => onSecretChange(event.target.value)}
            className="pr-10 font-mono text-[13px]"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              showSecret ? t("jwt.secret.hide") : t("jwt.secret.show")
            }
            onClick={() => setShowSecret((value) => !value)}
            className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
          >
            {showSecret ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>
        {statusText && (
          <div
            className={cn(
              "flex min-h-9 items-center rounded-md border px-3 text-sm font-medium",
              verificationStatus === "invalid"
                ? "border-destructive/25 bg-destructive/8 text-destructive"
                : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            )}
          >
            {statusText}
          </div>
        )}
      </div>
      <ToolPanels>
        <TextPanel
          label={t("jwt.token")}
          value={token}
          onChange={onTokenChange}
          minHeight="min-h-[420px]"
        />
        <div className="grid min-w-0 gap-4">
          <Editor
            value={headerJson}
            onChange={onHeaderChange}
            lang="json"
            label={t("jwt.header")}
            height={16}
          />
          <Editor
            value={payloadJson}
            onChange={onPayloadChange}
            lang="json"
            label={t("jwt.payload")}
            height={24}
          />
          <TextPanel
            label={t("jwt.signature")}
            value={signature}
            onChange={onSignatureChange}
            minHeight="min-h-20"
          />
        </div>
      </ToolPanels>
      <ToolError error={error} />
    </ToolWorkspace>
  )
}
