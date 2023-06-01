import storage from "./storage"

export default function (bookingUuid: string): void {
  const data = storage.getData()
  const updatedTables = data.tables.map((table) =>
    table.bookingUuid === bookingUuid ? { ...table, bookingUuid: null } : table,
  )
  storage.setData({ ...data, tables: updatedTables })
}
