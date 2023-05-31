import { IBooking } from "../lib/types"
import storage from "./storage"

export default function (booking: IBooking): void {
  const data = storage.getData()
  const newBookings = [...data.bookings, booking]
  storage.setData({ ...data, bookings: newBookings })
}
