import { DOMSource, VNode } from "@cycle/dom"
import { Stream, MemoryStream } from "xstream"

export type Sources = {
  DOM: DOMSource
  socket: object
  value: Stream<object>
}

export type Sinks = {
  DOM: Stream<VNode>
  socket: Stream<any>
}

export type MessageProps = {
  label: string
  value: string
}

type MessageInputAction = {
  DOM: Stream<VNode>
  value: MemoryStream<String>
}

type MessageListAction = {
  DOM: Stream<VNode>
}

type BmiCalcAction = {
  DOM: Stream<VNode>
  value: Stream<Number>
}
export type Actions = {
  messageInput: MessageInputAction
  messageList: MessageListAction
  bmiCalc: BmiCalcAction
}

export type State = {
  messageInputDOM: VNode
  messageListDOM: VNode
  bmiCalcDOM: VNode
  value: String
}

export type State$ = Stream<State>

export type DOMComponent = {
  DOM: Stream<VNode>
  value: Stream<number>
}
