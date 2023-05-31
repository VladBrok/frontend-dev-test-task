import { IBooking } from "../lib/types"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import BookingCard from "./booking-card"
import { useMemo } from "react"
import dateComparator from "../lib/date-comparator"
import { useNavigate } from "react-router"
import { ROUTE_PATHS } from "../lib/constants"
import { useAppSelector } from "../redux/hooks"

export interface IBookingListProps {
  bookings: IBooking[]
}

export default function BookingList() {
  const navigate = useNavigate()
  const bookings = useAppSelector((state) => state.bookings.list)

  const sortedBookings = useMemo(
    () =>
      bookings.slice().sort((a, b) => dateComparator(a.datetime, b.datetime)),
    [bookings],
  )

  return (
    <Container>
      {sortedBookings.length === 0 ? (
        <p className="mx-auto" style={{ width: "fit-content" }}>
          Бронирований пока нет.{" "}
          <Button
            variant="link"
            onClick={() => navigate(ROUTE_PATHS.BOOKING)}
            className="mb-1 p-0"
          >
            Забронировать
          </Button>
        </p>
      ) : (
        <Row xm={1} md={2}>
          {sortedBookings.map((booking) => (
            <Col key={booking.uuid} className="p-0">
              <BookingCard booking={booking} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}
