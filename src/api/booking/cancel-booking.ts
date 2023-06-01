import deleteBooking from "../../dummy-backend/delete-booking"
import freeUpTables from "../../dummy-backend/free-up-tables"
import { ARTIFICIAL_API_DELAY_MS } from "../../lib/constants"
import { delay } from "../../lib/delay"

export default async function (uuid: string): Promise<void> {
  await delay(ARTIFICIAL_API_DELAY_MS)

  deleteBooking(uuid)
  freeUpTables(uuid)
}
