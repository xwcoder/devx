import {
  Binary,
  Braces,
  Code2,
  Link2,
  FileCode2,
  CodeXml,
  ListChecks,
  Palette,
} from "lucide-react"
import JsonBeautifyApp from "./json-beautify"
import JsBeautifyApp from "./js-beautify"
import HtmlBeautifyApp from "./html-beautify"
import CssBeautifyApp from "./css-beautify"
import YmlCheckApp from "./yml-check"
import UrlCodecApp from "./url-codec"
import Base64CodecApp from "./base64-codec"
import XmlBeautifyApp from "./xml-beautify"

export const appGroups = [
  {
    name: "format",
    title: "格式化",
  },
  {
    name: "validate",
    title: "校验",
  },
  {
    name: "codec",
    title: "编码转换",
  },
] as const

export const apps = [
  {
    title: "JSON",
    name: "json",
    group: "format",
    description: "Format, validate, and inspect structured JSON payloads.",
    lang: "JSON",
    icon: Braces,
    component: JsonBeautifyApp,
  },
  {
    title: "JS",
    name: "js",
    group: "format",
    description: "Beautify JavaScript snippets with consistent indentation.",
    lang: "JavaScript",
    icon: Code2,
    component: JsBeautifyApp,
  },
  {
    title: "HTML",
    name: "html",
    group: "format",
    description: "Clean up HTML markup for easier reading and editing.",
    lang: "HTML",
    icon: CodeXml,
    component: HtmlBeautifyApp,
  },
  {
    title: "CSS",
    name: "css",
    group: "format",
    description: "Beautify CSS rules while keeping styles easy to scan.",
    lang: "CSS",
    icon: Palette,
    component: CssBeautifyApp,
  },
  {
    title: "XML",
    name: "xml",
    group: "format",
    description: "Format XML documents into readable nested markup.",
    lang: "XML",
    icon: FileCode2,
    component: XmlBeautifyApp,
  },
  {
    title: "YML",
    name: "yml",
    group: "validate",
    description: "Validate YAML and preview the parsed data as JSON.",
    lang: "YAML",
    icon: ListChecks,
    component: YmlCheckApp,
  },
  {
    title: "URL",
    name: "url",
    group: "codec",
    description: "Run standard URI and URI component encode/decode functions.",
    lang: "URI",
    icon: Link2,
    component: UrlCodecApp,
  },
  {
    title: "Base64",
    name: "base64",
    group: "codec",
    description: "Encode and decode Unicode text through Base64.",
    lang: "Base64",
    icon: Binary,
    component: Base64CodecApp,
  },
] as const

export type AppType = (typeof apps)[number]
