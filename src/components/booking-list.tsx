import { IBooking } from "../lib/types"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import BookingCard from "./booking-card"
import { useMemo } from "react"
import dateComparator from "../lib/date-comparator"

export interface IBookingListProps {
  bookings: IBooking[]
}

export default function BookingList({ bookings }: IBookingListProps) {
  const sortedBookings = useMemo(
    () => bookings.sort((a, b) => dateComparator(b.datetime, a.datetime)),
    [bookings],
  )

  return (
    <Container>
      <Row xm={1} md={2}>
        {sortedBookings.map((booking) => (
          <Col key={booking.uuid} className="p-0">
            <BookingCard booking={booking} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}
