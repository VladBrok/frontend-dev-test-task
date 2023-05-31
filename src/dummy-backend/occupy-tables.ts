import { ITable } from "../lib/types"
import storage from "./storage"

export default function (tables: ITable[], bookingUuid: string): void {
  const uuids = new Set(tables.map((table) => table.uuid))
  const data = storage.getData()
  const updatedTables = data.tables.map((table) =>
    uuids.has(table.uuid) ? { ...table, bookingUuid } : table,
  )
  storage.setData({ ...data, tables: updatedTables })
}
