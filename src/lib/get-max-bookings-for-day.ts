import { assert } from "./assert"
import { BOOKING_START_MAX_HOURS, BOOKING_START_MIN_HOURS } from "./constants"

export default function (): number {
  const result = BOOKING_START_MAX_HOURS - BOOKING_START_MIN_HOURS + 1
  assert(result > 0)
  return result
}
