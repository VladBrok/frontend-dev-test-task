import { Formik } from "formik"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import useTablesQuery from "../hooks/queries/use-tables-query"
import getUnavailableDates from "../lib/get-unavailable-dates"
import useBookingsQuery from "../hooks/queries/use-bookings-query"
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react"
import DatePicker from "react-datepicker"
import {
  BOOKING_DURATION_HOURS,
  BOOKING_START_MAX_TIME,
  BOOKING_START_MIN_TIME,
  ROUTE_PATHS,
} from "../lib/constants"
import getUnavailableTimes from "../lib/get-unavailable-times"
import getAvailableGuestCount from "../lib/get-available-guest-count"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { addBooking } from "../redux/slices/bookings-slice"
import { setToast } from "../redux/slices/toast-slice"
import { useNavigate } from "react-router"
import postBooking, {
  BookingData,
  getBookingSchema,
} from "../api/booking/post-booking"
import useCurrentUser from "../hooks/use-current-user"
import getToday from "../lib/get-today"
import getErrorStatusCode from "../lib/get-error-status-code"
import { QUERY_KEYS } from "../lib/query-keys"
import { assert } from "../lib/assert"
import blockDatepickerManualEditing from "../lib/block-datepicker-manual-editing"
import scrollToFirstAvailableTime from "../lib/scroll-to-first-available-time"
import pluralizeHours from "../lib/pluralize/pluralize-hours"

const Alert = lazy(() => import("react-bootstrap/Alert"))
const AlertHeading = lazy(() =>
  import("react-bootstrap/Alert").then((module) => ({
    default: module.default.Heading,
  })),
)

export default function Booking() {
  const user = useCurrentUser()
  const tablesQuery = useTablesQuery()
  const bookingsQuery = useBookingsQuery()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isSubmitClicked, setIsSubmitClicked] = useState(false)
  const [isRevalidating, setIsRevalidating] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const queryClient = useQueryClient()
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)
  const timeContainerRef = useRef<HTMLDivElement | null>(null)

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

  const availableGuestCount = useMemo(() => {
    if (!tablesQuery.data) {
      return 1
    }

    return getAvailableGuestCount(tablesQuery.data)
  }, [tablesQuery.data])

  const bookingRequest = useMutation({
    mutationFn: async (data: BookingData): Promise<void> => {
      if (isRevalidating) {
        setIsRevalidating(false)
        return
      }

      const booking = await postBooking(data, user!.uuid)
      dispatch(addBooking(booking))
      dispatch(
        setToast({ isActive: true, text: "Бронирование прошло успешно." }),
      )
      navigate(ROUTE_PATHS.DASHBOARD)
    },
  })

  const submitButtonText = bookingRequest.isLoading
    ? "Загрузка..."
    : "Сохранить"
  const errorStatusCode = getErrorStatusCode(bookingRequest)
  const errorText =
    errorStatusCode === 400
      ? "Ошибка входных данных. Идет повторная проверка полей..."
      : "При бронировании произошла ошибка. Попробуйте позже."
  const canBook = availableGuestCount > 0

  useEffect(() => {
    if (errorStatusCode !== 400) {
      return
    }

    Promise.allSettled([
      queryClient.invalidateQueries([QUERY_KEYS.BOOKINGS]),
      queryClient.invalidateQueries([QUERY_KEYS.TABLES]),
    ]).then(() => {
      bookingRequest.reset()
      setIsRevalidating(true)
    })
  }, [bookingRequest, errorStatusCode, queryClient])

  useEffect(() => {
    if (!isRevalidating) {
      return
    }

    assert(submitButtonRef.current)
    submitButtonRef.current?.click()
  }, [bookingRequest, isRevalidating])

  if (!user) {
    return <></>
  }

  return (
    <Container>
      {canBook ? (
        <h1 className="fs-2 text-center mb-5">Забронировать</h1>
      ) : (
        <Suspense>
          <Alert variant="primary" className="w-50 mx-auto">
            <AlertHeading>Бронирование недоступно</AlertHeading>
            <p className="mb-0">
              Все столики уже забронированы. Возвращайтесь позже
            </p>
          </Alert>
        </Suspense>
      )}

      <Formik
        validationSchema={getBookingSchema(
          unavailableDates,
          unavailableTimes,
          availableGuestCount,
        )}
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
          <Form
            noValidate
            onSubmit={handleSubmit}
            className="mx-auto"
            style={{ width: "max(285px, 27%)" }}
          >
            <fieldset disabled={!canBook}>
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
                  onFocus={blockDatepickerManualEditing}
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
                  calendarContainer={({ children, className }) => (
                    <div className={className} ref={timeContainerRef}>
                      {children}
                    </div>
                  )}
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
                  onFocus={blockDatepickerManualEditing}
                  onCalendarOpen={() =>
                    !values.time && scrollToFirstAvailableTime(timeContainerRef)
                  }
                  excludeTimes={unavailableTimes}
                  minTime={BOOKING_START_MIN_TIME}
                  maxTime={BOOKING_START_MAX_TIME}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.time}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Продолжительность бронирования:{" "}
                  {pluralizeHours(BOOKING_DURATION_HOURS)}
                </Form.Text>
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
                ref={submitButtonRef}
                type="submit"
                variant="dark"
                onClick={() => setIsSubmitClicked(true)}
                disabled={bookingRequest.isLoading}
                className="mt-4 w-100 d-block"
              >
                {submitButtonText}
              </Button>
            </fieldset>
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
            {errorText}
          </Alert>
        )}
      </Suspense>
    </Container>
  )
}
