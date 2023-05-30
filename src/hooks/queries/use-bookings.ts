import { useQuery } from "@tanstack/react-query"
import fetchBookings from "../../api/fetch-bookings"

export default function (userUuid: string) {
  return useQuery(["bookings", userUuid], () => fetchBookings(userUuid), {
    enabled: Boolean(userUuid),
  })
}
