import io from "socket.io-client"
import xs from "xstream"
import { adapt } from "@cycle/run/lib/adapt"

/**
 * ## Pattern
 * from main()
 *    write-effects: socket.emit <--- sinks
 * to main()
 *    read-effects: socket.on(msg) ---> sources
 *
 * ## Protocol
 * msg = {
 *  type: String (what was emited?)
 *  payload: any (contains emited content)
 * }
 */

// type:String, payload:any => {type, payload}
const createAction = (type, payload) => ({
  type,
  payload
})

const makeSocketDriver = host => {
  const socket = io(host)

  return sinks$ => {
    const types = ["connected", "message"]

    const listener = {
      next: msg => {
        socket.emit(msg.type, msg.payload)
      },
      error: console.error,
      complete: () => console.log(`closed socket-connection to ${host}`)
    }
    sinks$.addListener(listener)

    const sources$ = xs.create({
      start: listener => {
        socket.on("connect", () => {
          const msg = `socket-connection on ${host} established`
          console.log("connection-info", msg)
          listener.next(createAction("connect", msg))
        })

        types.forEach(type => {
          socket.on(type, msg => {
            if (type === types[0]) console.log("connection-id: ", msg.id)
            listener.next(createAction(type, msg))
          })
        })
      },

      stop: () => {
        types.forEach(type => socket.removeAllListeners())
      }
    })

    return adapt(sources$)
  }
}

export default makeSocketDriver
