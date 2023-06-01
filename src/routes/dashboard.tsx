import Container from "react-bootstrap/Container"
import Spinner from "react-bootstrap/Spinner"
import useBookingsQuery from "../hooks/queries/use-bookings-query"
import { Suspense, lazy } from "react"

const BookingList = lazy(() => import("../components/booking-list"))
const Alert = lazy(() => import("react-bootstrap/Alert"))

export default function Dashboard() {
  const bookingsQuery = useBookingsQuery()

  const spinner = (
    <div className="d-flex justify-content-center">
      <Spinner animation="grow" />
    </div>
  )

  return (
    <Container className="pb-4">
      <h1 className="fs-2 mb-4">Текущие бронирования</h1>
      <Suspense fallback={spinner}>
        {bookingsQuery.isLoading && spinner}
        {bookingsQuery.isError && (
          <Alert variant="danger" className="w-50 mx-auto">
            Не удалось загрузить текущие бронирования. Попробуйте перезагрузить
            страницу.
          </Alert>
        )}
        {bookingsQuery.isSuccess && <BookingList />}
      </Suspense>
    </Container>
  )
}
