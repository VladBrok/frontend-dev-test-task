import { differenceInHours } from "date-fns"
import { IBooking } from "./types"

export default function (booking: IBooking): boolean {
  const diff = differenceInHours(new Date(booking.datetime), new Date())
  return diff >= 1
}
