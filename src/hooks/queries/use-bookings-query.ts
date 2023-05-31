import { useQuery } from "@tanstack/react-query"
import fetchBookings from "../../api/fetch-bookings"
import { useDispatch } from "react-redux"
import { setBookings } from "../../redux/slices/bookings-slice"
import { IBooking } from "../../lib/types"

export default function () {
  const dispatch = useDispatch()

  const query = useQuery(["bookings"], async (): Promise<IBooking[]> => {
    const list = await fetchBookings()
    dispatch(setBookings(list))
    return list
  })

  return query
}
