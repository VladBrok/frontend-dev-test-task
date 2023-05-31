import { Formik } from "formik"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import useTablesQuery from "../hooks/queries/use-tables-query"
import getUnavailableDates from "../lib/get-unavailable-dates"
import useBookingsQuery from "../hooks/queries/use-bookings-query"
import { useMemo, useState } from "react"
import DatePicker from "react-datepicker"
import { InferType, date, number, object } from "yup"
import {
  BOOKING_DURATION_HOURS,
  BOOKING_START_MAX_HOURS,
  BOOKING_START_MAX_TIME,
  BOOKING_START_MIN_HOURS,
  BOOKING_START_MIN_TIME,
} from "../lib/constants"
import getUnavailableTimes from "../lib/get-unavailable-times"
import getMaxGuestCount from "../lib/get-max-guest-count"
import pluralizeGuestCount from "../lib/pluralize-guest-count"
import { useMutation } from "@tanstack/react-query"

export default function Booking() {
  const tablesQuery = useTablesQuery()
  const bookingsQuery = useBookingsQuery()
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

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // TODO: move to api
  const bookingSchema = object().shape({
    date: date()
      .required("Обязательное поле")
      .min(today, "Дата не может быть меньше текущей")
      .test(
        "date-available",
        "Эта дата уже занята",
        (date) =>
          !unavailableDates.some(
            (unavailable) => unavailable.getTime() === date.getTime(),
          ),
      ),
    time: date()
      .required("Обязательное поле")
      .min(
        BOOKING_START_MIN_TIME,
        `Бронировать можно начиная с ${BOOKING_START_MIN_HOURS}:00`,
      )
      .max(
        BOOKING_START_MAX_TIME,
        `Бронировать можно до ${BOOKING_START_MAX_HOURS}:00`,
      )
      .test(
        "time-available",
        "Это время уже занято",
        (time) =>
          !unavailableTimes.some(
            (unavailable) => unavailable.getHours() === time.getHours(),
          ),
      ),
    guestCount: number()
      .required("Обязательное поле")
      .min(1, "Минимум 1 гость")
      .max(maxGuestCount, `Максимум ${pluralizeGuestCount(maxGuestCount)}`),
  })

  const bookingRequest = useMutation({
    mutationFn: async (
      data: InferType<typeof bookingSchema>,
    ): Promise<void> => {
      console.log(data)
    },
  })

  // TODO: make datepickers readonly

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
                minDate={today}
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
              className="mt-4 w-100 d-block"
              onClick={() => setIsSubmitClicked(true)}
            >
              Сохранить
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
