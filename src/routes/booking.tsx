import { Formik } from "formik"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import useTablesQuery from "../hooks/queries/use-tables-query"
import getUnavailableDates from "../lib/get-unavailable-dates"
import useBookingsQuery from "../hooks/queries/use-bookings-query"
import useCurrentUser from "../hooks/use-current-user"
import { useMemo, useState } from "react"
import DatePicker from "react-datepicker"
import { date, object } from "yup"
import {
  BOOKING_DURATION_HOURS,
  BOOKING_START_MAX_HOURS,
  BOOKING_START_MAX_TIME,
  BOOKING_START_MIN_HOURS,
  BOOKING_START_MIN_TIME,
} from "../lib/constants"
import getUnavailableTimes from "../lib/get-unavailable-times"

export default function Booking() {
  const user = useCurrentUser()
  const tablesQuery = useTablesQuery()
  const bookingsQuery = useBookingsQuery(user?.uuid || "")
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
  })

  if (!user) {
    return <></>
  }

  // TODO: make datepickers readonly

  return (
    <Container>
      <h1 className="fs-2 text-center mb-5">Забронировать</h1>
      <Formik
        validationSchema={bookingSchema}
        onSubmit={console.log}
        initialValues={{
          date: null,
          time: null,
        }}
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
