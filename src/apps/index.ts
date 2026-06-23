import {
  Binary,
  Braces,
  Code2,
  Link2,
  FileCode2,
  CodeXml,
  ListChecks,
  Palette,
  Shield,
} from "lucide-react"
import JsonBeautifyApp from "./json-beautify"
import JsBeautifyApp from "./js-beautify"
import HtmlBeautifyApp from "./html-beautify"
import CssBeautifyApp from "./css-beautify"
import YmlCheckApp from "./yml-check"
import UrlCodecApp from "./url-codec"
import Base64CodecApp from "./base64-codec"
import XmlBeautifyApp from "./xml-beautify"
import JwtCodecApp from "./jwt-codec"

export const appGroups = [
  {
    name: "format",
    titleKey: "group.format",
  },
  {
    name: "validate",
    titleKey: "group.validate",
  },
  {
    name: "codec",
    titleKey: "group.codec",
  },
] as const

export const apps = [
  {
    title: "JSON",
    name: "json",
    group: "format",
    descriptionKey: "app.json.description",
    lang: "JSON",
    icon: Braces,
    component: JsonBeautifyApp,
  },
  {
    title: "JS",
    name: "js",
    group: "format",
    descriptionKey: "app.js.description",
    lang: "JavaScript",
    icon: Code2,
    component: JsBeautifyApp,
  },
  {
    title: "HTML",
    name: "html",
    group: "format",
    descriptionKey: "app.html.description",
    lang: "HTML",
    icon: CodeXml,
    component: HtmlBeautifyApp,
  },
  {
    title: "CSS",
    name: "css",
    group: "format",
    descriptionKey: "app.css.description",
    lang: "CSS",
    icon: Palette,
    component: CssBeautifyApp,
  },
  {
    title: "XML",
    name: "xml",
    group: "format",
    descriptionKey: "app.xml.description",
    lang: "XML",
    icon: FileCode2,
    component: XmlBeautifyApp,
  },
  {
    title: "YML",
    name: "yml",
    group: "validate",
    descriptionKey: "app.yml.description",
    lang: "YAML",
    icon: ListChecks,
    component: YmlCheckApp,
  },
  {
    title: "URL",
    name: "url",
    group: "codec",
    descriptionKey: "app.url.description",
    lang: "URI",
    icon: Link2,
    component: UrlCodecApp,
  },
  {
    title: "Base64",
    name: "base64",
    group: "codec",
    descriptionKey: "app.base64.description",
    lang: "Base64",
    icon: Binary,
    component: Base64CodecApp,
  },
  {
    title: "JWT",
    name: "jwt",
    group: "codec",
    descriptionKey: "app.jwt.description",
    lang: "JWT",
    icon: Shield,
    component: JwtCodecApp,
  },
] as const

export type AppType = (typeof apps)[number]
