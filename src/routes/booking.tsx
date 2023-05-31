import { Formik } from "formik"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import useTablesQuery from "../hooks/queries/use-tables-query"
import getUnavailableDates from "../lib/get-unavailable-dates"
import useBookingsQuery from "../hooks/queries/use-bookings-query"
import { Suspense, lazy, useMemo, useState } from "react"
import DatePicker from "react-datepicker"
import { InferType } from "yup"
import {
  BOOKING_DURATION_HOURS,
  BOOKING_START_MAX_TIME,
  BOOKING_START_MIN_TIME,
  ROUTE_PATHS,
} from "../lib/constants"
import getUnavailableTimes from "../lib/get-unavailable-times"
import getMaxGuestCount from "../lib/get-max-guest-count"
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { addBooking } from "../redux/slices/bookings-slice"
import { setToast } from "../redux/slices/toast-slice"
import { useNavigate } from "react-router"
import postBooking, { getBookingSchema } from "../api/post-booking"
import useCurrentUser from "../hooks/use-current-user"
import getToday from "../lib/get-today"
import getErrorStatusCode from "../lib/get-error-status-code"

const Alert = lazy(() => import("react-bootstrap/Alert"))

export default function Booking() {
  const user = useCurrentUser()
  const tablesQuery = useTablesQuery()
  const bookingsQuery = useBookingsQuery()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isSubmitClicked, setIsSubmitClicked] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const unavailableDates = useMemo(() => {
    if (!bookingsQuery.data) {
      return []
    }

    return getUnavailableDates(bookingsQuery.data)
  }, [bookingsQuery.data])

  const unavailableTimes = useMemo(() => {
    if (!selectedDate || !bookingsQuery.data) {
      return []
    }

    return getUnavailableTimes(selectedDate, bookingsQuery.data)
  }, [bookingsQuery.data, selectedDate])

  const maxGuestCount = useMemo(() => {
    if (!tablesQuery.data) {
      return 1
    }

    return getMaxGuestCount(tablesQuery.data)
  }, [tablesQuery.data])

  const bookingSchema = getBookingSchema(
    unavailableDates,
    unavailableTimes,
    maxGuestCount,
  )

  const bookingRequest = useMutation({
    mutationFn: async (
      data: InferType<typeof bookingSchema>,
    ): Promise<void> => {
      const booking = await postBooking(data, user!.uuid)
      dispatch(addBooking(booking))
      dispatch(
        setToast({ isActive: true, text: "Бронирование прошло успешно." }),
      )
      navigate(ROUTE_PATHS.DASHBOARD)
    },
  })

  // TODO: make datepickers readonly
  // TODO: handle error 400 (revalidate queries) + test conflict (2 bookings at the same time)
  const submitButtonText = bookingRequest.isLoading
    ? "Загрузка..."
    : "Сохранить"

  if (!user) {
    return <></>
  }

  return (
    <Container>
      <h1 className="fs-2 text-center mb-5">Забронировать</h1>
      <Formik
        validationSchema={bookingSchema}
        onSubmit={bookingRequest.mutate}
        initialValues={
          {
            date: null,
            time: null,
            guestCount: "",
          } as any
        }
        validateOnChange={isSubmitClicked}
      >
        {({ handleSubmit, handleChange, setFieldValue, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit} className="w-25 mx-auto">
            <Form.Group controlId="validationFormikDate" className="mt-3">
              <Form.Label>Дата</Form.Label>
              <DatePicker
                customInput={
                  <Form.Control
                    type="text"
                    disabled
                    readOnly
                    isInvalid={!!errors.date}
                  />
                }
                dateFormat="dd.MM.yyyy"
                placeholderText="Дата бронирования"
                name="date"
                selected={values.date}
                onChange={(val) => {
                  setSelectedDate(val)
                  setFieldValue("date", val)
                }}
                minDate={getToday()}
                excludeDates={unavailableDates}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationFormikTime" className="mt-3">
              <Form.Label>Время</Form.Label>
              <DatePicker
                customInput={
                  <Form.Control
                    type="text"
                    disabled
                    readOnly
                    isInvalid={!!errors.time}
                  />
                }
                showTimeSelect
                showTimeSelectOnly
                timeCaption=""
                timeIntervals={BOOKING_DURATION_HOURS * 60}
                dateFormat="HH:mm"
                placeholderText="Время бронирования"
                name="time"
                selected={values.time}
                onChange={(val) => {
                  setFieldValue("time", val)
                }}
                excludeTimes={unavailableTimes}
                minTime={BOOKING_START_MIN_TIME}
                maxTime={BOOKING_START_MAX_TIME}
              />
              <Form.Control.Feedback type="invalid">
                {errors.time}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationFormikGuests" className="mt-3">
              <Form.Label>Гости</Form.Label>
              <Form.Control
                type="number"
                placeholder="Количество гостей"
                name="guestCount"
                value={values.guestCount}
                onChange={handleChange}
                isInvalid={!!errors.guestCount}
              />
              <Form.Control.Feedback type="invalid">
                {errors.guestCount}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              type="submit"
              variant="dark"
              onClick={() => setIsSubmitClicked(true)}
              disabled={bookingRequest.isLoading}
              className="mt-4 w-100 d-block"
            >
              {submitButtonText}
            </Button>
          </Form>
        )}
      </Formik>
      <Suspense>
        {bookingRequest.isError && (
          <Alert
            variant="danger"
            style={{ maxWidth: "50%" }}
            className="mx-auto mt-4"
          >
            При бронировании произошла ошибка. Попробуйте позже.
          </Alert>
        )}
      </Suspense>
    </Container>
  )
}
