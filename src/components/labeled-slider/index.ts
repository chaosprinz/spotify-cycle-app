import { div, label, input, DOMSource, VNode } from "@cycle/dom"
import styles from "./styles"
import toLower from "ramda/es/toLower"
import { Stream, MemoryStream } from "xstream"
import { SliderProps, SLiderSources } from "./types"
import { DOMComponent } from "../../types"
const intent = (domSource: DOMSource): Stream<String> =>
  domSource
    .select(".slider")
    .events("input")
    .map((e: any): string => e.target.value)

const mapActionsToProps = (
  actions$: Stream<number>,
  props: SliderProps
): Stream<SliderProps> =>
  actions$
    .map(
      (val: number): SliderProps => ({
        label: props.label,
        unit: props.unit,
        min: props.min,
        max: props.max,
        value: val || props.value
      })
    )
    .startWith(props)

const model = (
  actions$: Stream<String>,
  props$: MemoryStream<SliderProps>
): MemoryStream<SliderProps> =>
  props$
    .map(
      (props: SliderProps): Stream<SliderProps> =>
        mapActionsToProps(actions$.map(parseInt), props)
    )
    .flatten()
    .remember()

const _view = (state: SliderProps): VNode =>
  div(`.labeled-slider.${styles.labeledSlider}.${toLower(state.label)}`, [
    label(`${state.label}: ${state.value}`),
    input(".slider", {
      attrs: {
        type: "range",
        min: state.min,
        max: state.max,
        value: state.value
      }
    })
  ])

const view = (state$: MemoryStream<SliderProps>): MemoryStream<VNode> =>
  state$.map(_view)

const LabeledSlider = (sources: SLiderSources): DOMComponent => {
  const actions$ = intent(sources.DOM)
  const state$ = model(actions$, sources.props)

  const vnode$ = view(state$)

  return {
    DOM: vnode$,
    value: state$.map(state => state.value)
  }
}

export default LabeledSlider
