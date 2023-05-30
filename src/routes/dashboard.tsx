import Container from "react-bootstrap/Container"
import useCurrentUser from "../hooks/use-current-user"
import useBookings from "../hooks/queries/use-bookings"
import BookingList from "../components/booking-list"

export default function Dashboard() {
  const user = useCurrentUser()
  const userUuid = user?.uuid || ""
  const bookingsRequest = useBookings(userUuid)

  if (!user) {
    return <></>
  }

  // TODO: loading/error
  return (
    <Container>
      <h1 className="fs-2 mb-4">Текущие бронирования</h1>
      {bookingsRequest.isSuccess && (
        <BookingList bookings={bookingsRequest.data} />
      )}
    </Container>
  )
}
