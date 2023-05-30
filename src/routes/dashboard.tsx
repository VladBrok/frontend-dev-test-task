import Container from "react-bootstrap/Container"
import Alert from "react-bootstrap/Alert"
import Spinner from "react-bootstrap/Spinner"
import useCurrentUser from "../hooks/use-current-user"
import useBookingsQuery from "../hooks/queries/use-bookings-query"
import { Suspense, lazy } from "react"

const BookingList = lazy(() => import("../components/booking-list"))

export default function Dashboard() {
  const user = useCurrentUser()
  const userUuid = user?.uuid || ""
  const bookingsRequest = useBookingsQuery(userUuid)

  if (!user) {
    return <></>
  }

  const spinner = (
    <div className="d-flex justify-content-center">
      <Spinner animation="grow" />
    </div>
  )

  return (
    <Container>
      <h1 className="fs-2 mb-4">Текущие бронирования</h1>
      <Suspense fallback={spinner}>
        {bookingsRequest.isLoading && spinner}
        {bookingsRequest.isError && (
          <Alert variant="danger" className="w-50 mx-auto">
            Не удалось загрузить текущие бронирования. Попробуйте перезагрузить
            страницу.
          </Alert>
        )}
        {bookingsRequest.isSuccess && <BookingList />}
      </Suspense>
    </Container>
  )
}
