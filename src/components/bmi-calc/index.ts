import xs, { Stream, MemoryStream } from "xstream"
import LabeledSlider from "../labeled-slider"
import { div, h2, DOMSource, VNode } from "@cycle/dom"
import isolate, { Component } from "@cycle/isolate"
import { SliderProps } from "../labeled-slider/types"
import { DOMComponent } from "../../types"

const WeightSlider: Component<any, any> = isolate(LabeledSlider, "weight")
const HeightSlider: Component<any, any> = isolate(LabeledSlider, "height")

type BmiInnerSources = {
  DOM: DOMSource
  props: Stream<SliderProps>
}

const BmiCalc = (domSources: DOMSource): DOMComponent => {
  const weightProps$: Stream<SliderProps> = xs.of({
    label: "Weight",
    unit: "kg",
    min: 40,
    max: 200,
    value: 103
  })
  const heightProps$: Stream<SliderProps> = xs.of({
    label: "Height",
    unit: "kg",
    min: 130,
    max: 220,
    value: 189
  })

  const weightSources: BmiInnerSources = {
    DOM: domSources,
    props: weightProps$
  }
  const heightSources: BmiInnerSources = {
    DOM: domSources,
    props: heightProps$
  }

  const weightSlider: DOMComponent = WeightSlider(weightSources)
  const heightSlider: DOMComponent = HeightSlider(heightSources)

  const bmi$: MemoryStream<number> = xs
    .combine(weightSlider.value, heightSlider.value)
    .map(([weight, height]: [number, number]) => {
      const heightMeters = height * 0.01
      return Math.round(weight / (heightMeters * heightMeters))
    })
    .remember()

  const vdom$: Stream<VNode> = xs
    .combine(bmi$, weightSlider.DOM, heightSlider.DOM)
    .map(([bmi, weightDom, heightDom]) =>
      div([weightDom, heightDom, h2(`Your BMI: ${bmi}`)])
    )

  return {
    DOM: vdom$,
    value: bmi$
  }
}

export default BmiCalc
