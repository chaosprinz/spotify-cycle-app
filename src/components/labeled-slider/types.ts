import { DOMSource } from "@cycle/dom"
import { Stream } from "xstream"

export type SliderProps = {
  label: string
  unit: string
  min: number
  max: number
  value: number
}

export type SLiderSources = {
  DOM: DOMSource
  props: Stream<SliderProps>
}
