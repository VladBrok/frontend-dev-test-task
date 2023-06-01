import { assert } from "./assert"
import getAvailableGuestCount from "./get-available-guest-count"
import { ITable } from "./types"

export default function getTablesToOccupy(
  tables: ITable[],
  guestCount: number,
): ITable[] {
  if (guestCount <= 0) {
    throw new Error(`Guest count should be > 0 (received ${guestCount}).`)
  }

  const availableGuestCount = getAvailableGuestCount(tables)
  if (guestCount > availableGuestCount) {
    throw new Error(
      `Supplied guest count = ${guestCount} is greater than max = ${availableGuestCount}.`,
    )
  }

  const available = tables.filter((table) => table.bookingUuid == null)
  assert(available.length > 0)
  const sortedAvailable = available
    .slice()
    .sort((a, b) => b.guestCount - a.guestCount)
  const result: ITable[] = []

  let remainingGuests = guestCount

  for (let i = 0; i < sortedAvailable.length && remainingGuests > 0; i++) {
    const table = sortedAvailable[i]
    remainingGuests -= table.guestCount

    if (remainingGuests < 0) {
      remainingGuests += table.guestCount
    } else {
      result.push(table)
    }
  }

  if (remainingGuests > 0) {
    const smallestTable = sortedAvailable.at(-1)
    assert(smallestTable)
    if (smallestTable) {
      assert(smallestTable.guestCount >= remainingGuests)
      result.push(smallestTable)
    }
  }

  return result
}
