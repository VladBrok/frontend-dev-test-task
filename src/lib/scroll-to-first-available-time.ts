import { MutableRefObject } from "react"
import { assert } from "./assert"

export default function (
  dateInputContainerRef: MutableRefObject<HTMLElement | null>,
): void {
  assert(dateInputContainerRef.current)
  const availableTime = dateInputContainerRef.current?.querySelector(
    ".react-datepicker__time-list-item:not(.react-datepicker__time-list-item--disabled)",
  )

  if (!availableTime) {
    return
  }

  setTimeout(() => {
    availableTime.scrollIntoView()
  })
}
