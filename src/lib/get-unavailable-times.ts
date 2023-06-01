import { setMinutes } from "date-fns"
import { IBooking } from "./types"

export default function (date: Date, bookings: IBooking[]): Date[] {
  const equalYearMonthDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const bookinsForDate = bookings.filter((booking) =>
    equalYearMonthDate(new Date(booking.datetime), date),
  )

  const unavailable = bookinsForDate.map((booking) =>
    setMinutes(new Date(booking.datetime), 0),
  )

  return unavailable
}
