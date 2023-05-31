import getTables from "../dummy-backend/get-tables"
import { ARTIFICIAL_API_DELAY_MS } from "../lib/constants"
import { delay } from "../lib/delay"
import { ITable } from "../lib/types"

export default async function (): Promise<ITable[]> {
  await delay(ARTIFICIAL_API_DELAY_MS)

  return getTables()
}
