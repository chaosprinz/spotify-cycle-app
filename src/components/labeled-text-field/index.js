import { div, input, p, label } from "@cycle/dom"

const intent = domSource =>
  domSource
    .select(".text-input")
    .events("input")
    .map(e => e.target.value)

const model = (actions$, props$) =>
  props$
    .map(props =>
      actions$
        .map(val => ({
          label: props.label,
          value: val || props.val
        }))
        .startWith(props)
    )
    .flatten()
    .remember()

const view = state$ =>
  state$.map(state =>
    div([
      p(label(`${state.label}:`)),
      p(input(".text-input", { type: "text" }))
    ])
  )

const LabeledTextField = sources => {
  const actions$ = intent(sources.DOM)
  const props$ = sources.props
  const state$ = model(actions$, props$)
  const vdom$ = view(state$)

  return {
    DOM: vdom$,
    value: state$.map(s => s.value)
  }
}

export default LabeledTextField
