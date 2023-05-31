import formatDatetime from "../lib/format-datetime"
import pluralizeGuestCount from "../lib/pluralize-guest-count"
import { IBooking } from "../lib/types"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import { Suspense, lazy, useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { cancelBooking as cancelBookingAction } from "../redux/slices/bookings-slice"
import { setToast } from "../redux/slices/toast-slice"
import cancelBooking from "../api/cancel-booking"
import canCancelBooking from "../lib/can-cancel-booking"

const Modal = lazy(() => import("react-bootstrap/Modal"))
const ModalHeader = lazy(() => import("react-bootstrap/ModalHeader"))
const ModalTitle = lazy(() => import("react-bootstrap/ModalTitle"))
const ModalBody = lazy(() => import("react-bootstrap/ModalBody"))
const ModalFooter = lazy(() => import("react-bootstrap/ModalFooter"))
const Alert = lazy(() => import("react-bootstrap/Alert"))

export interface IBookingProps {
  booking: IBooking
}

export default function BookingCard({ booking }: IBookingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()
  const cancellationRequest = useMutation({
    mutationFn: async () => {
      await cancelBooking(booking.uuid)
      dispatch(cancelBookingAction(booking.uuid))
      dispatch(
        setToast({ isActive: true, text: "Бронирование успешно отменено." }),
      )
      closeModal()
    },
  })

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

  const modalConfirmButtonText = cancellationRequest.isLoading
    ? "Загрузка..."
    : "Подтвердить"

  return (
    <div className="p-3">
      <Card>
        <Card.Body className="p-4">
          <Card.Title> {datetime} </Card.Title>
          <Card.Text className="fs-5 mt-3">{guestCount}</Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end gap-3">
          {/* TODO: implement editing */}
          <Button variant="outline-primary">Редактировать</Button>
          {canCancelBooking(booking) && (
            <Button variant="outline-danger" onClick={openModal}>
              Отменить
            </Button>
          )}
        </Card.Footer>
      </Card>

      <Suspense>
        {isModalOpen && (
          <Modal show={isModalOpen} onHide={closeModal} centered>
            {canCancelBooking(booking) ? (
              <>
                <ModalHeader closeButton>
                  <ModalTitle>Подтвердите отмену</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Выбрано бронирование на {guestCount}, на дату: {datetime}.
                  </p>
                  <p>Отмененное бронирование нельзя будет восстановить.</p>
                  <Suspense>
                    {cancellationRequest.isError && (
                      <Alert variant="danger">
                        Не удалось отменить бронирование. Попробуйте позже.
                      </Alert>
                    )}
                  </Suspense>
                </ModalBody>
                <ModalFooter>
                  <Button variant="outline-secondary" onClick={closeModal}>
                    Закрыть
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => cancellationRequest.mutate()}
                    disabled={cancellationRequest.isLoading}
                  >
                    {modalConfirmButtonText}
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <>
                <ModalHeader closeButton>
                  <ModalTitle>Отмена недоступна</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Бронирование можно отменить не позднее чем за 1 час до
                    времени бронирования.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="outline-secondary" onClick={closeModal}>
                    ОК
                  </Button>
                </ModalFooter>
              </>
            )}
          </Modal>
        )}
      </Suspense>
    </div>
  )
}
