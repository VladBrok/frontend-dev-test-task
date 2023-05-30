import storage from "./storage"

export default function (uuid: string): void {
  const data = storage.getData()
  const leftBookings = data.bookings.filter((booking) => booking.uuid !== uuid)
  storage.setData({ ...data, bookings: leftBookings })
}
