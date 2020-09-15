import { div, VNode } from "@cycle/dom"

const CircleDiv = (radius: number, bg: number, content: string): VNode =>
  div(
    {
      style: {
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: `${radius * 2}px`,
        backgroundColor: bg
      }
    },
    [
      div(
        {
          style: {
            fontSize: `${radius / 2.5}px`,
            padding: `${radius / 2}px`
          }
        },
        content
      )
    ]
  )

export default CircleDiv
