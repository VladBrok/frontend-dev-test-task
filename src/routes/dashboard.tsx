import Container from "react-bootstrap/Container"
import useCurrentUser from "../hooks/use-current-user"
import useBookings from "../hooks/queries/use-bookings"
import { useMemo } from "react"
import dateComparator from "../lib/date-comparator"

export default function Dashboard() {
  const user = useCurrentUser()
  const userUuid = user?.uuid || ""
  const bookingsRequest = useBookings(userUuid)

  const sortedBookings = useMemo(
    () =>
      bookingsRequest.data?.sort((a, b) =>
        dateComparator(b.datetime, a.datetime),
      ) ?? [],
    [bookingsRequest.data],
  )

  if (!user) {
    return <></>
  }

  return (
    <Container>
      <h1 className="fs-2">Текущие бронирования</h1>
      {JSON.stringify(sortedBookings)}
    </Container>
  )
}
