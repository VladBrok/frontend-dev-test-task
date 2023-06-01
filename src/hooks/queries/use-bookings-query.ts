import { useQuery } from "@tanstack/react-query"
import fetchBookings from "../../api/booking/fetch-bookings"
import { useDispatch } from "react-redux"
import { setBookings } from "../../redux/slices/bookings-slice"
import { IBooking } from "../../lib/types"
import { QUERY_KEYS } from "../../lib/query-keys"

export default function () {
  const dispatch = useDispatch()

  const query = useQuery(
    [QUERY_KEYS.BOOKINGS],
    async (): Promise<IBooking[]> => {
      const list = await fetchBookings()
      dispatch(setBookings(list))
      return list
    },
  )

  return query
}
