import { assert } from "../lib/assert"
import { ITable } from "../lib/types"
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

export default function (): ITable[] {
  const tables: ITable[] = []

  for (let i = 0; i < CONFIG.length; i++) {
    for (let j = 0; j < CONFIG[i].tableCount; j++) {
      tables.push({
        uuid: uuidv4(),
        guestCount: CONFIG[i].guestCount,
        bookingUuid: null, // TODO: book some
      })
    }
  }

  assert(tables.length === TOTAL_TABLE_COUNT)

  return tables
}
