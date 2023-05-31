import { ITable } from "../lib/types"
import storage from "./storage"

export default function (): ITable[] {
  const data = storage.getData()
  return data.tables
}
