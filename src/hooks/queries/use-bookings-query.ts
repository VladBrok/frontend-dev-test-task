import { useQuery } from "@tanstack/react-query"
import fetchBookings from "../../api/fetch-bookings"
import { useDispatch } from "react-redux"
import { setBookings } from "../../redux/slices/bookings-slice"
import { IBooking } from "../../lib/types"

export default function (userUuid: string) {
  const dispatch = useDispatch()

  const query = useQuery(
    ["bookings", userUuid],
    async (): Promise<IBooking[]> => {
      const list = await fetchBookings(userUuid)
      dispatch(setBookings(list))
      return list
    },
    {
      enabled: Boolean(userUuid),
    },
  )

  return query
}
