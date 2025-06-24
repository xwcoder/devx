import {
  Braces,
  Code,
  Heading,
  Link2,
  Brackets,
  Menu,
  SquareSlash,
  CodeXml,
} from "lucide-react"
import JsonBeautifyApp from "./json-beautify"
import JsBeautifyApp from "./js-beautify"
import HtmlBeautifyApp from "./html-beautify"
import CssBeautifyApp from "./css-beautify"
import YmlCheckApp from "./yml-check"
import UrlCodecApp from "./url-codec"
import Base64CodecApp from "./base64-codec"
import XmlBeautifyApp from "./xml-beautify"

export const apps = [
  {
    title: "JSON",
    name: "json",
    icon: Braces,
    component: JsonBeautifyApp,
  },
  {
    title: "JS",
    name: "js",
    icon: Code,
    component: JsBeautifyApp,
  },
  {
    title: "HTML",
    name: "html",
    icon: Heading,
    component: HtmlBeautifyApp,
  },
  {
    title: "CSS",
    name: "css",
    icon: Brackets,
    component: CssBeautifyApp,
  },
  {
    title: "YML",
    name: "yml",
    icon: Menu,
    component: YmlCheckApp,
  },
  {
    title: "XML",
    name: "xml",
    icon: CodeXml,
    component: XmlBeautifyApp,
  },
  {
    title: "URL",
    name: "url",
    icon: Link2,
    component: UrlCodecApp,
  },
  {
    title: "Base64",
    name: "base64",
    icon: SquareSlash,
    component: Base64CodecApp,
  },
] as const

export type AppType = (typeof apps)[number]