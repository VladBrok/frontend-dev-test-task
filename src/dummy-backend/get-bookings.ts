import { IBooking } from "../lib/types"
import storage from "./storage"

export default function (userUuid?: string): IBooking[] {
  const data = storage.getData()
  const bookings = userUuid
    ? data.bookings.filter((booking) => booking.userUuid === userUuid)
    : data.bookings
  return bookings
}
