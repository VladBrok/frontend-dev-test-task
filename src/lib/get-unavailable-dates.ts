import getMaxBookingsForDay from "./get-max-bookings-for-day"
import { IBooking } from "./types"

export default function (bookings: IBooking[]): Date[] {
  const dateToBookingsMap = new Map<string, IBooking[]>()

  for (const booking of bookings) {
    const date = new Date(booking.datetime)
    const hash = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).toISOString()
    const bookingsForDate = dateToBookingsMap.get(hash)
    dateToBookingsMap.set(
      hash,
      bookingsForDate ? [...bookingsForDate, booking] : [booking],
    )
  }

  const unavailable: Date[] = []

  for (const [date, bookings] of dateToBookingsMap.entries()) {
    if (bookings.length == getMaxBookingsForDay()) {
      unavailable.push(new Date(date))
    }
  }

  return unavailable
}
