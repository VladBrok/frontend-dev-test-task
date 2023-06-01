import { ITable } from "./types"

export default function (tables: ITable[]): number {
  const availableTables = tables.filter((table) => table.bookingUuid == null)
  const maxGuestCount = availableTables.reduce(
    (sum, cur) => sum + cur.guestCount,
    0,
  )
  return maxGuestCount
}
