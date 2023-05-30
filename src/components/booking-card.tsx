import formatDatetime from "../lib/format-datetime"
import pluralizeGuestCount from "../lib/pluralize-guest-count"
import { IBooking } from "../lib/types"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

export interface IBookingProps {
  booking: IBooking
}

export default function BookingCard({ booking }: IBookingProps) {
  return (
    <div className="p-3">
      <Card>
        <Card.Body className="p-4">
          <Card.Title> {formatDatetime(booking.datetime)} </Card.Title>
          <Card.Text className="fs-5 mt-3">
            {pluralizeGuestCount(booking.guestCount)}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end gap-3">
          <Button variant="outline-primary">Редактировать</Button>
          <Button variant="outline-danger">Отменить</Button>
        </Card.Footer>
      </Card>
    </div>
  )
}
