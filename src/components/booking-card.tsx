import formatDatetime from "../lib/format-datetime"
import pluralizeGuestCount from "../lib/pluralize-guest-count"
import { IBooking } from "../lib/types"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import { Suspense, lazy, useMemo, useState } from "react"

const Modal = lazy(() => import("react-bootstrap/Modal"))
const ModalHeader = lazy(() => import("react-bootstrap/ModalHeader"))
const ModalTitle = lazy(() => import("react-bootstrap/ModalTitle"))
const ModalBody = lazy(() => import("react-bootstrap/ModalBody"))
const ModalFooter = lazy(() => import("react-bootstrap/ModalFooter"))

export interface IBookingProps {
  booking: IBooking
}

export default function BookingCard({ booking }: IBookingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const datetime = useMemo(
    () => formatDatetime(booking.datetime),
    [booking.datetime],
  )

  const guestCount = useMemo(
    () => pluralizeGuestCount(booking.guestCount),
    [booking.guestCount],
  )

  return (
    <div className="p-3">
      <Card>
        <Card.Body className="p-4">
          <Card.Title> {datetime} </Card.Title>
          <Card.Text className="fs-5 mt-3">{guestCount}</Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end gap-3">
          <Button variant="outline-primary">Редактировать</Button>
          <Button variant="outline-danger" onClick={openModal}>
            Отменить
          </Button>
        </Card.Footer>
      </Card>

      <Suspense>
        {isModalOpen && (
          <Modal show={isModalOpen} onHide={closeModal} centered>
            <ModalHeader closeButton>
              <ModalTitle>Подтвердите отмену брони</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>
                Выбрана бронь на {guestCount}, на дату: {datetime}.
              </p>
              <p>Отмененную бронь нельзя будет восстановить.</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline-secondary" onClick={closeModal}>
                Закрыть
              </Button>
              <Button variant="outline-danger" onClick={closeModal}>
                Подтвердить
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Suspense>
    </div>
  )
}
