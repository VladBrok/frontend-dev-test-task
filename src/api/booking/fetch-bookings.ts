import getBookings from "../../dummy-backend/get-bookings"
import { ARTIFICIAL_API_DELAY_MS } from "../../lib/constants"
import { delay } from "../../lib/delay"
import { IBooking } from "../../lib/types"

export default async function (userUuid?: string): Promise<IBooking[]> {
  await delay(ARTIFICIAL_API_DELAY_MS)

  const bookings = getBookings(userUuid)
  return bookings
}
