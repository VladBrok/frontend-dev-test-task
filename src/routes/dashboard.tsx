import Container from "react-bootstrap/Container"
import useCurrentUser from "../hooks/use-current-user"
import useBookings from "../hooks/queries/use-bookings"

export default function Dashboard() {
  const user = useCurrentUser()
  const userUuid = user?.uuid || ""
  const bookingsRequest = useBookings(userUuid)

  if (!user) {
    return <></>
  }

  return (
    <Container>
      <h1 className="fs-2">Текущие бронирования</h1>
      {JSON.stringify(bookingsRequest.data)}
    </Container>
  )
}
