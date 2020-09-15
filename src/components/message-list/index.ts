import { ul, li, VNode } from "@cycle/dom"
import { Stream } from "xstream"
import { map } from "ramda"
import { Message } from "./types"

const model = (socket$: Stream<Message>): Stream<Array<string>> =>
  socket$
    .filter(msg => msg.type === "message")
    .map(m => m.payload)

    .fold((prev, msg) => {
      prev.push(msg)
      return prev
    }, [])

const mapMessageToLi: Function = map(msg => li(".message", msg))

const view = (state$: Stream<Array<string>>): Stream<VNode> =>
  state$.map(state => ul(".messages", mapMessageToLi(state)))

type MessageListSinks = {
  DOM: Stream<VNode>
  socket: Stream<any>
}
const MessageList = (sources: Stream<any>): MessageListSinks => {
  const state$ = model(sources)
  const vdom$: Stream<VNode> = view(state$)

  return {
    DOM: vdom$,
    socket: sources
  }
}

export default MessageList
