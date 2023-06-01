import { assert } from "../lib/assert"
import getTablesToOccupy from "../lib/get-tables-to-occupy"
import { IBooking, ITable } from "../lib/types"
import { v4 as uuidv4 } from "uuid"

interface ITableConfig {
  tableCount: number
  guestCount: number
}

const CONFIG: ITableConfig[] = [
  {
    tableCount: 7,
    guestCount: 2,
  },
  {
    tableCount: 6,
    guestCount: 3,
  },
  {
    tableCount: 3,
    guestCount: 6,
  },
]
const TOTAL_TABLE_COUNT = CONFIG.reduce((sum, cur) => sum + cur.tableCount, 0)

export default function (bookings: IBooking[]): ITable[] {
  const tables: ITable[] = []

  for (let i = 0; i < CONFIG.length; i++) {
    for (let j = 0; j < CONFIG[i].tableCount; j++) {
      tables.push({
        uuid: uuidv4(),
        guestCount: CONFIG[i].guestCount,
        bookingUuid: null,
      })
    }
  }

  assert(tables.length === TOTAL_TABLE_COUNT)

  for (const booking of bookings) {
    const tablesToOccupy = getTablesToOccupy(tables, booking.guestCount).map(
      (table) => table.uuid,
    )
    tables
      .filter((table) => tablesToOccupy.includes(table.uuid))
      .forEach((table) => {
        table.bookingUuid = booking.uuid
      })
  }

  return tables
}
