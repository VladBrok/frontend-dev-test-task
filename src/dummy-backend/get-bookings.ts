import { IBooking } from "../lib/types"
import storage from "./storage"

export default function (userUuid: string): IBooking[] {
  const data = storage.getData()
  const bookings = data.bookings.filter(
    (booking) => booking.userUuid === userUuid,
  )
  return bookings
}
