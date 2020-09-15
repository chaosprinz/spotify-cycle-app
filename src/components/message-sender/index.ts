import sampleCombine from "xstream/extra/sampleCombine"
import { Stream } from "xstream"
import { Message } from "../message-list/types"
import { DOMSource } from "@cycle/dom"

type SocketSource = {
  input: Stream<string>
  source: Stream<Message>
}

type MsgDomSource = {
  source: DOMSource
  evt: string
}

type MsgSenderActions = {
  DOM: Stream<Message>
  input: Stream<Message>
  socket: Stream<Message>
}

type MsgSenderState = {
  message: Stream<Array<Message>>
  socket: Stream<Message>
}

const intent = (
  socketSource: SocketSource,
  domSource: MsgDomSource
): MsgSenderActions => ({
  DOM: domSource.source.events(domSource.evt).startWith({
    type: "init",
    payload: null
  }),
  input: socketSource.input.map(m => ({
    type: "message",
    payload: m
  })),
  socket: socketSource.source
})

const model = (actions$: MsgSenderActions): MsgSenderState => ({
  message: actions$.DOM.compose(sampleCombine(actions$.input)),
  socket: actions$.socket
})

const view = (state$: MsgSenderState): Stream<Message> =>
  state$.socket
    .map(() => state$.message)
    .flatten()
    .map(m => m[1])
    .remember()

const MessageSender = (
  sock: SocketSource,
  dom: MsgDomSource
): { socket: Stream<Message> } => {
  const actions$ = intent(sock, dom)
  const state$ = model(actions$)
  const socket$ = view(state$)

  return {
    socket: socket$
  }
}

export default MessageSender
