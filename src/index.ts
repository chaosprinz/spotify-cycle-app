import "./styles.css"
import { run } from "@cycle/run"
import { makeDOMDriver, div } from "@cycle/dom"
import makeSocketDriver from "./drivers/socket-io"
import xs from "xstream"

const main = (sources: any): any => {
  const state$ = xs.of("Hello World")
  return {
    DOM: state$.map(state => div("#canvas", state))
  }
}

const drivers = {
  DOM: makeDOMDriver("#app")
}

run(main, drivers)
